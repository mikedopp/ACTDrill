using System.Diagnostics;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace ACTDrill.Desktop;

static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new MainForm());
    }
}

class MainForm : Form
{
    // public repo holding ONLY the question bank (original content — no real ACT items, no personal notes)
    const string BankUrl = "https://raw.githubusercontent.com/mikedopp/actdrill-bank/main/questions.js";
    // local, offline AI — the student's own Ollama. Nothing leaves the machine.
    const string OllamaBase = "http://localhost:11434";

    readonly WebView2 _web = new();
    string _webDir = "";

    public MainForm()
    {
        Text = "ACT Pattern Drill";
        Width = 1000;
        Height = 800;
        MinimumSize = new Size(720, 560);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(13, 13, 13);

        _web.Dock = DockStyle.Fill;
        _web.DefaultBackgroundColor = Color.FromArgb(13, 13, 13);
        Controls.Add(_web);

        Load += async (_, _) => await InitAsync();
    }

    async Task InitAsync()
    {
        try
        {
            var dataDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "ACTDrill");
            Directory.CreateDirectory(dataDir);

            _webDir = ResolveWebDir(dataDir);

            // fixed user-data folder so localStorage (XP, streaks, mastery) persists across runs
            var env = await CoreWebView2Environment.CreateAsync(null, dataDir);
            await _web.EnsureCoreWebView2Async(env);

            _web.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            _web.CoreWebView2.Settings.IsStatusBarEnabled = false;
            _web.CoreWebView2.Settings.IsZoomControlEnabled = true;

            // links in the Real practice tab open in the default browser, not inside the app
            _web.CoreWebView2.NewWindowRequested += (_, e) =>
            {
                e.Handled = true;
                Process.Start(new ProcessStartInfo(e.Uri) { UseShellExecute = true });
            };

            _web.CoreWebView2.WebMessageReceived += OnWebMessage;

            _web.CoreWebView2.SetVirtualHostNameToFolderMapping(
                "actdrill.local", _webDir, CoreWebView2HostResourceAccessKind.Allow);
            _web.CoreWebView2.Navigate("https://actdrill.local/index.html");
        }
        catch (WebView2RuntimeNotFoundException)
        {
            MessageBox.Show(
                "This app needs the Microsoft WebView2 Runtime, which is usually preinstalled with Windows.\n\n" +
                "Free download: https://developer.microsoft.com/microsoft-edge/webview2/",
                "ACT Pattern Drill", MessageBoxButtons.OK, MessageBoxIcon.Information);
            Close();
        }
        catch (Exception ex)
        {
            MessageBox.Show(ex.Message, "ACT Pattern Drill", MessageBoxButtons.OK, MessageBoxIcon.Error);
            Close();
        }
    }

    async void OnWebMessage(object sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        string msg;
        try { msg = e.TryGetWebMessageAsString(); } catch { return; }
        if (msg is null) return;

        // legacy plain-string trigger still supported
        if (msg == "updateBank") { await UpdateBankAsync(); return; }

        // everything else is JSON: { kind, id, ... }
        JsonElement m;
        try { m = JsonDocument.Parse(msg).RootElement; }
        catch { return; }
        if (!m.TryGetProperty("kind", out var kindEl)) return;
        var kind = kindEl.GetString();
        var id = m.TryGetProperty("id", out var idEl) ? idEl.GetString() : "";

        if (kind == "updateBank") { await UpdateBankAsync(); return; }
        if (kind == "ollamaPing") { await OllamaPingAsync(id); return; }
        if (kind == "ollamaChat") { await OllamaChatAsync(id, m); return; }
    }

    void Reply(object payload) => _web.CoreWebView2.PostWebMessageAsString(JsonSerializer.Serialize(payload));

    async Task UpdateBankAsync()
    {
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(20) };
            var js = await http.GetStringAsync(BankUrl);
            if (!js.Contains("const ACT_QUESTIONS") || !js.Contains("const ACT_PATTERNS"))
                throw new InvalidDataException("Downloaded file doesn't look like a question bank.");
            File.WriteAllText(Path.Combine(_webDir, "questions.js"), js);
            _web.CoreWebView2.Reload();
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                "Couldn't update the question bank:\n" + ex.Message +
                "\n\nCheck the internet connection and try again — the current bank is untouched.",
                "ACT Pattern Drill", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
    }

    // Is the student's Ollama running, and which chat model should we use?
    async Task OllamaPingAsync(string id)
    {
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(4) };
            var json = await http.GetStringAsync(OllamaBase + "/api/tags");
            var names = new List<string>();
            foreach (var mdl in JsonDocument.Parse(json).RootElement.GetProperty("models").EnumerateArray())
                if (mdl.TryGetProperty("name", out var n)) names.Add(n.GetString() ?? "");
            string Pick() =>
                names.FirstOrDefault(x => x.Contains("qwen3", StringComparison.OrdinalIgnoreCase))
                ?? names.FirstOrDefault(x => x.Contains("qwen", StringComparison.OrdinalIgnoreCase))
                ?? names.FirstOrDefault(x => !x.Contains("embed", StringComparison.OrdinalIgnoreCase))
                ?? names.FirstOrDefault() ?? "";
            var model = Pick();
            Reply(new { kind = "ollamaReply", id, ok = !string.IsNullOrEmpty(model), model, models = names });
        }
        catch
        {
            Reply(new { kind = "ollamaReply", id, ok = false, model = "", error = "offline" });
        }
    }

    // Ask the local model to EXPLAIN already-known-correct content (grounded → won't invent math).
    async Task OllamaChatAsync(string id, JsonElement m)
    {
        try
        {
            var model = m.GetProperty("model").GetString();
            var system = m.TryGetProperty("system", out var s) ? s.GetString() : "";
            var prompt = m.GetProperty("prompt").GetString();
            var body = new
            {
                model,
                stream = false,
                messages = new object[]
                {
                    new { role = "system", content = system },
                    new { role = "user", content = prompt }
                }
            };
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(120) };
            var resp = await http.PostAsync(OllamaBase + "/api/chat",
                new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
            var txt = await resp.Content.ReadAsStringAsync();
            var content = JsonDocument.Parse(txt).RootElement.GetProperty("message").GetProperty("content").GetString() ?? "";
            // thinking models (qwen3) may wrap reasoning in <think>…</think> — strip it for the student
            content = Regex.Replace(content, "(?s)<think>.*?</think>", "").Trim();
            Reply(new { kind = "ollamaReply", id, ok = true, text = content });
        }
        catch (Exception ex)
        {
            Reply(new { kind = "ollamaReply", id, ok = false, error = ex.Message });
        }
    }

    /// <summary>
    /// A "web" folder sitting next to the exe wins (easy editing of notes.js/questions.js).
    /// Otherwise the embedded assets are extracted to %LOCALAPPDATA%\ACTDrill\web —
    /// index.html and questions.js are refreshed every run so app updates take effect,
    /// but notes.js is only written if missing, so personalized notes survive updates.
    /// </summary>
    static string ResolveWebDir(string dataDir)
    {
        var beside = Path.Combine(AppContext.BaseDirectory, "web");
        if (File.Exists(Path.Combine(beside, "index.html")))
            return beside;

        var target = Path.Combine(dataDir, "web");
        Directory.CreateDirectory(target);

        var asm = Assembly.GetExecutingAssembly();
        foreach (var res in asm.GetManifestResourceNames())
        {
            string file =
                res.EndsWith("index.html", StringComparison.OrdinalIgnoreCase) ? "index.html" :
                res.EndsWith("questions.js", StringComparison.OrdinalIgnoreCase) ? "questions.js" :
                res.EndsWith("notes.js", StringComparison.OrdinalIgnoreCase) ? "notes.js" : null;
            if (file is null) continue;

            var dest = Path.Combine(target, file);
            var overwrite = file != "notes.js";
            if (!overwrite && File.Exists(dest)) continue;

            using var src = asm.GetManifestResourceStream(res)!;
            using var dst = File.Create(dest);
            src.CopyTo(dst);
        }
        return target;
    }
}
