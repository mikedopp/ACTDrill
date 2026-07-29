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
        if (kind == "aiSetup") { await AiSetupAsync(); return; }
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

    string _model = "";

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
                ?? names.FirstOrDefault(x => !x.Contains("embed", StringComparison.OrdinalIgnoreCase) && !x.Contains("vl", StringComparison.OrdinalIgnoreCase))
                ?? names.FirstOrDefault() ?? "";
            _model = Pick();
            // server answered → it's running. ok means we also have a usable model.
            Reply(new { kind = "ollamaReply", id, ok = !string.IsNullOrEmpty(_model), running = true, model = _model, models = names });
            if (!string.IsNullOrEmpty(_model)) _ = WarmAsync(_model); // load into memory so the first real question is fast
        }
        catch
        {
            Reply(new { kind = "ollamaReply", id, ok = false, running = false, model = "", error = "offline" });
        }
    }

    // Fire-and-forget: get the model resident in RAM (cold load is the slow part).
    async Task WarmAsync(string model)
    {
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(90) };
            var body = new { model, stream = false, think = false, keep_alive = "30m",
                             messages = new object[] { new { role = "user", content = "hi" } } };
            await http.PostAsync(OllamaBase + "/api/chat",
                new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
        }
        catch { /* best effort */ }
    }

    // Ask the local model to EXPLAIN already-known-correct content (grounded → won't invent math).
    async Task OllamaChatAsync(string id, JsonElement m)
    {
        try
        {
            var model = m.GetProperty("model").GetString();
            var system = m.TryGetProperty("system", out var s) ? s.GetString() : "";
            var prompt = m.GetProperty("prompt").GetString();
            string content;
            try { content = await ChatOnce(model, system, prompt, noThink: true); }   // fast path (qwen3 etc.)
            catch { content = await ChatOnce(model, system, prompt, noThink: false); } // model may reject the 'think' field
            content = Regex.Replace(content, "(?s)<think>.*?</think>", "").Trim();       // strip any reasoning block
            Reply(new { kind = "ollamaReply", id, ok = true, text = content });
        }
        catch (Exception ex)
        {
            Reply(new { kind = "ollamaReply", id, ok = false, error = ex.Message });
        }
    }

    const string SetupModel = "qwen2.5:3b";   // small + fast; good for the tutor role
    const string OllamaSetupUrl = "https://ollama.com/download/OllamaSetup.exe";

    static string FindOllamaExe()
    {
        var local = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                                 "Programs", "Ollama", "ollama.exe");
        if (File.Exists(local)) return local;
        foreach (var dir in (Environment.GetEnvironmentVariable("PATH") ?? "").Split(';'))
            try { var q = Path.Combine(dir.Trim(), "ollama.exe"); if (File.Exists(q)) return q; } catch { }
        return null;
    }

    async Task<bool> OllamaUp()
    {
        try { using var h = new HttpClient { Timeout = TimeSpan.FromSeconds(3) }; await h.GetStringAsync(OllamaBase + "/api/tags"); return true; }
        catch { return false; }
    }

    // One-click: install Ollama if needed, start it, pull the model — reporting progress the whole way.
    async Task AiSetupAsync()
    {
        void P(int pct, string label, bool done = false, bool ok = false, string error = null)
            => Reply(new { kind = "aiProgress", pct, label, done, ok, error });
        try
        {
            P(2, "Checking for Ollama…");
            var exe = FindOllamaExe();
            if (exe == null)
            {
                // download the official Ollama installer with progress
                var tmp = Path.Combine(Path.GetTempPath(), "OllamaSetup.exe");
                using (var http = new HttpClient { Timeout = TimeSpan.FromMinutes(20) })
                using (var resp = await http.GetAsync(OllamaSetupUrl, HttpCompletionOption.ResponseHeadersRead))
                {
                    resp.EnsureSuccessStatusCode();
                    var total = resp.Content.Headers.ContentLength ?? 0;
                    using var src = await resp.Content.ReadAsStreamAsync();
                    using var dst = File.Create(tmp);
                    var buf = new byte[81920]; long read = 0; int last = -1, n;
                    while ((n = await src.ReadAsync(buf)) > 0)
                    {
                        await dst.WriteAsync(buf.AsMemory(0, n));
                        read += n;
                        int pct = total > 0 ? 3 + (int)(read * 42 / total) : 20;
                        if (pct != last) { last = pct; P(pct, $"Downloading Ollama…  {read / 1048576} MB" + (total > 0 ? $" / {total / 1048576} MB" : "")); }
                    }
                }
                P(46, "Installing Ollama… (a moment)");
                var pi = new ProcessStartInfo(tmp, "/VERYSILENT /NORESTART /SUPPRESSMSGBOXES") { UseShellExecute = true };
                var proc = Process.Start(pi);
                if (proc != null) await proc.WaitForExitAsync();
                exe = FindOllamaExe();
                if (exe == null) { P(46, "", true, false, "Ollama installed but couldn't be located. Try launching it once from the Start menu, then retry."); return; }
            }

            // make sure the server is up
            P(50, "Starting Ollama…");
            if (!await OllamaUp())
            {
                try { Process.Start(new ProcessStartInfo(exe, "serve") { UseShellExecute = false, CreateNoWindow = true }); } catch { }
                for (int i = 0; i < 30 && !await OllamaUp(); i++) await Task.Delay(1000);
            }
            if (!await OllamaUp()) { P(50, "", true, false, "Ollama wouldn't start. Open the Ollama app once, then retry."); return; }

            // pull the model, streaming progress
            P(52, "Downloading the tutor model (~2 GB)…");
            var body = new { name = SetupModel, stream = true };
            using (var http = new HttpClient { Timeout = TimeSpan.FromMinutes(60) })
            using (var req = new HttpRequestMessage(HttpMethod.Post, OllamaBase + "/api/pull")
            { Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json") })
            using (var resp = await http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead))
            using (var stream = await resp.Content.ReadAsStreamAsync())
            using (var reader = new StreamReader(stream))
            {
                string line;
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    if (string.IsNullOrWhiteSpace(line)) continue;
                    try
                    {
                        var el = JsonDocument.Parse(line).RootElement;
                        var status = el.TryGetProperty("status", out var st) ? st.GetString() : "";
                        long tot = el.TryGetProperty("total", out var t) ? t.GetInt64() : 0;
                        long comp = el.TryGetProperty("completed", out var c) ? c.GetInt64() : 0;
                        int pct = tot > 0 ? 52 + (int)(comp * 45 / tot) : 55;
                        P(pct, "Model: " + status + (tot > 0 ? $"  {comp / 1048576}/{tot / 1048576} MB" : ""));
                        if (el.TryGetProperty("error", out var er)) { P(pct, "", true, false, er.GetString()); return; }
                    }
                    catch { }
                }
            }

            // verify
            P(98, "Verifying…");
            using (var http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) })
            {
                var tags = await http.GetStringAsync(OllamaBase + "/api/tags");
                if (tags.Contains(SetupModel.Split(':')[0])) P(100, "Ready", true, true);
                else P(100, "", true, false, "Model didn't verify. Try retrying the setup.");
            }
        }
        catch (Exception ex)
        {
            Reply(new { kind = "aiProgress", pct = 0, label = "", done = true, ok = false, error = ex.Message });
        }
    }

    async Task<string> ChatOnce(string model, string system, string prompt, bool noThink)
    {
        object body = noThink
            ? new { model, stream = false, think = false, keep_alive = "30m",
                    messages = new object[] { new { role = "system", content = system }, new { role = "user", content = prompt } } }
            : new { model, stream = false, keep_alive = "30m",
                    messages = new object[] { new { role = "system", content = system }, new { role = "user", content = prompt } } };
        using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(120) };
        var resp = await http.PostAsync(OllamaBase + "/api/chat",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
        var txt = await resp.Content.ReadAsStringAsync();
        if (!resp.IsSuccessStatusCode) throw new Exception("ollama " + (int)resp.StatusCode);
        return JsonDocument.Parse(txt).RootElement.GetProperty("message").GetProperty("content").GetString() ?? "";
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
