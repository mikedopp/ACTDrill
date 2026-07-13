using System.Diagnostics;
using System.Reflection;
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
    readonly WebView2 _web = new();

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

            var webDir = ResolveWebDir(dataDir);

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

            _web.CoreWebView2.SetVirtualHostNameToFolderMapping(
                "actdrill.local", webDir, CoreWebView2HostResourceAccessKind.Allow);
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
