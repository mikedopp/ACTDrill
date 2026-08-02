using System.Security.Cryptography;
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
    static int Main(string[] args)
    {
        if (args.Contains("--smoke", StringComparer.OrdinalIgnoreCase))
        {
            return RunSmokeCheck();
        }

        ApplicationConfiguration.Initialize();
        Application.Run(new MainForm());
        return 0;
    }

    private static int RunSmokeCheck()
    {
        try
        {
            var names = Assembly.GetExecutingAssembly().GetManifestResourceNames();
            foreach (var required in new[] { "index.html", "styles.css", "coaching.js", "speech.js", "app.js", "questions.js", "beyond-questions.js", "notes.js" })
            {
                if (!names.Any(name => name.EndsWith(required, StringComparison.OrdinalIgnoreCase)))
                {
                    throw new InvalidDataException($"Missing embedded asset: {required}");
                }
            }

            // ".web.questions.js" — not just "questions.js", which now also matches
            // beyond-questions.js and would make Single() throw
            var bankResource = names.Single(name =>
                name.EndsWith(".web.questions.js", StringComparison.OrdinalIgnoreCase));
            using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(bankResource)
                ?? throw new InvalidDataException("Question bank resource could not be opened.");
            using var reader = new StreamReader(stream, Encoding.UTF8);
            var bank = QuestionBankCompiler.Compile(reader.ReadToEnd());
            var voice = NativeSpeechService.GetVoices().FirstOrDefault()
                ?? throw new InvalidDataException("No enabled Windows speech voice was found.");
            var speech = NativeSpeechService.Synthesize(
                "ACTDrill native speech check.",
                voice.Name,
                0);
            Console.WriteLine(
                $"ACTDrill smoke PASS: {bank.Version}, {bank.PatternCount} patterns, " +
                $"{bank.QuestionCount} questions, native voice {speech.VoiceName}, " +
                $"{speech.WaveBytes.Length} WAV bytes.");
            return 0;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("ACTDrill smoke FAIL: " + ex.Message);
            return 1;
        }
    }
}

internal sealed class MainForm : Form
{
    private const string BankUrl =
        "https://raw.githubusercontent.com/mikedopp/actdrill-bank/main/questions.js";
    private const string OllamaBase = "http://localhost:11434";
    private const string OllamaSetupUrl = "https://ollama.com/download/OllamaSetup.exe";
    private const string SetupModel = "qwen2.5:3b";
    private const long MaxBankBytes = 2 * 1024 * 1024;
    private const string UpdateManifestUrl =
        "https://raw.githubusercontent.com/mikedopp/actdrill-bank/main/latest.json";
    private const long MaxInstallerBytes = 250L * 1024 * 1024;
    private const int MaxManifestChars = 8192;

    private readonly WebView2 _web = new();
    private readonly SemaphoreSlim _aiSetupGate = new(1, 1);
    private string _webDir = string.Empty;
    private string _model = string.Empty;

    internal MainForm()
    {
        Text = "ACTDrill";
        Width = 1000;
        Height = 800;
        MinimumSize = new Size(720, 560);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(11, 14, 20);

        _web.Dock = DockStyle.Fill;
        _web.DefaultBackgroundColor = Color.FromArgb(11, 14, 20);
        Controls.Add(_web);

        Load += async (_, _) => await InitAsync();
    }

    private async Task InitAsync()
    {
        try
        {
            var dataDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "ACTDrill");
            Directory.CreateDirectory(dataDir);
            _webDir = ResolveWebDir(dataDir);

            var env = await CoreWebView2Environment.CreateAsync(null, dataDir);
            await _web.EnsureCoreWebView2Async(env);

            var core = _web.CoreWebView2;
            core.Settings.AreDefaultContextMenusEnabled = false;
            core.Settings.AreDevToolsEnabled = false;
            core.Settings.IsStatusBarEnabled = false;
            core.Settings.IsZoomControlEnabled = true;
            core.NewWindowRequested += OnNewWindowRequested;
            core.NavigationStarting += OnNavigationStarting;
            core.WebMessageReceived += OnWebMessage;
            core.SetVirtualHostNameToFolderMapping(
                "actdrill.local",
                _webDir,
                CoreWebView2HostResourceAccessKind.DenyCors);
            core.Navigate("https://actdrill.local/index.html");
        }
        catch (WebView2RuntimeNotFoundException)
        {
            MessageBox.Show(
                "This app needs the Microsoft WebView2 Runtime, which is usually preinstalled with Windows.\n\n" +
                "Download it from Microsoft Edge WebView2.",
                "ACTDrill",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
            Close();
        }
        catch (Exception ex)
        {
            MessageBox.Show(ex.Message, "ACTDrill", MessageBoxButtons.OK, MessageBoxIcon.Error);
            Close();
        }
    }

    private void OnNewWindowRequested(object? sender, CoreWebView2NewWindowRequestedEventArgs e)
    {
        e.Handled = true;
        OpenApprovedExternalLink(e.Uri);
    }

    private void OnNavigationStarting(object? sender, CoreWebView2NavigationStartingEventArgs e)
    {
        if (Uri.TryCreate(e.Uri, UriKind.Absolute, out var uri) &&
            uri.Scheme == Uri.UriSchemeHttps &&
            uri.Host.Equals("actdrill.local", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        e.Cancel = true;
        OpenApprovedExternalLink(e.Uri);
    }

    private static void OpenApprovedExternalLink(string? value)
    {
        if (!ExternalNavigationPolicy.TryAllow(value, out var uri) || uri is null)
        {
            MessageBox.Show(
                "That link was blocked because it is not an approved ACTDrill resource.",
                "ACTDrill",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
            return;
        }

        Process.Start(new ProcessStartInfo(uri.AbsoluteUri) { UseShellExecute = true });
    }

    private async void OnWebMessage(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        if (!Uri.TryCreate(e.Source, UriKind.Absolute, out var source) ||
            source.Scheme != Uri.UriSchemeHttps ||
            !source.Host.Equals("actdrill.local", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        string json;
        try
        {
            json = e.TryGetWebMessageAsString();
        }
        catch
        {
            return;
        }

        BridgeRequest? request;
        try
        {
            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;
            request = new BridgeRequest(
                root.GetProperty("type").GetString() ?? string.Empty,
                root.GetProperty("id").GetString() ?? string.Empty,
                root.GetProperty("method").GetString() ?? string.Empty,
                root.TryGetProperty("params", out var parameters)
                    ? parameters.Clone()
                    : JsonDocument.Parse("{}").RootElement.Clone());
        }
        catch
        {
            return;
        }

        if (request.Type != BridgeProtocol.RequestType ||
            string.IsNullOrWhiteSpace(request.Id) ||
            string.IsNullOrWhiteSpace(request.Method))
        {
            return;
        }

        try
        {
            switch (request.Method)
            {
                case "updateBank":
                    await UpdateBankAsync(request.Id);
                    break;
                case "ollamaPing":
                    await OllamaPingAsync(request.Id);
                    break;
                case "ollamaChat":
                    await OllamaChatAsync(request.Id, request.Params);
                    break;
                case "ollamaWarm":
                    await OllamaWarmAsync(request.Id);
                    break;
                case "aiSetup":
                    await AiSetupAsync(request.Id);
                    break;
                case "speechVoices":
                    SpeechVoices(request.Id);
                    break;
                case "speechSynthesize":
                    await SpeechSynthesizeAsync(request.Id, request.Params);
                    break;
                case "ollamaStart":
                    await OllamaStartAsync(request.Id);
                    break;
                case "appUpdateCheck":
                    await AppUpdateCheckAsync(request.Id);
                    break;
                case "appUpdateInstall":
                    await AppUpdateInstallAsync(request.Id);
                    break;
                default:
                    ReplyResponse(request.Id, false, error: "Unsupported desktop request.");
                    break;
            }
        }
        catch (Exception ex)
        {
            ReplyResponse(request.Id, false, error: ex.Message);
        }
    }

    private void ReplyResponse(string id, bool ok, object? result = null, string? error = null) =>
        PostMessage(new
        {
            type = BridgeProtocol.ResponseType,
            id,
            ok,
            result,
            error
        });

    private void ReplyEvent(string method, object payload) =>
        PostMessage(new
        {
            type = BridgeProtocol.EventType,
            method,
            payload
        });

    private void PostMessage(object payload)
    {
        if (!_web.IsDisposed && _web.CoreWebView2 is not null)
        {
            _web.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(payload));
        }
    }

    private void SpeechVoices(string id)
    {
        var voices = NativeSpeechService.GetVoices();
        ReplyResponse(id, true, new
        {
            renderer = "native-wave",
            voices
        });
    }

    private async Task SpeechSynthesizeAsync(string id, JsonElement parameters)
    {
        var text = parameters.TryGetProperty("text", out var textElement) &&
                   textElement.ValueKind == JsonValueKind.String
            ? textElement.GetString() ?? string.Empty
            : string.Empty;
        var voice = parameters.TryGetProperty("voice", out var voiceElement) &&
                    voiceElement.ValueKind == JsonValueKind.String
            ? voiceElement.GetString()
            : null;
        var rate = parameters.TryGetProperty("rate", out var rateElement) &&
                   rateElement.ValueKind == JsonValueKind.Number &&
                   rateElement.TryGetInt32(out var parsedRate)
            ? parsedRate
            : 0;

        var speech = await NativeSpeechService.SynthesizeAsync(text, voice, rate);
        ReplyResponse(id, true, new
        {
            renderer = "native-wave",
            voice = speech.VoiceName,
            mimeType = "audio/wav",
            audioBase64 = Convert.ToBase64String(speech.WaveBytes)
        });
    }

    private async Task UpdateBankAsync(string id)
    {
        var destination = Path.Combine(_webDir, "questions.js");
        var temporary = destination + "." + Guid.NewGuid().ToString("N") + ".tmp";
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
            using var response = await http.GetAsync(
                BankUrl,
                HttpCompletionOption.ResponseHeadersRead);
            response.EnsureSuccessStatusCode();
            if (response.Content.Headers.ContentLength > MaxBankBytes)
            {
                throw new InvalidDataException("Question bank exceeds the 2 MB safety limit.");
            }

            await using var source = await response.Content.ReadAsStreamAsync();
            using var memory = new MemoryStream();
            var buffer = new byte[64 * 1024];
            int count;
            while ((count = await source.ReadAsync(buffer)) > 0)
            {
                if (memory.Length + count > MaxBankBytes)
                {
                    throw new InvalidDataException("Question bank exceeds the 2 MB safety limit.");
                }
                await memory.WriteAsync(buffer.AsMemory(0, count));
            }

            var downloaded = Encoding.UTF8.GetString(memory.ToArray());
            var compiled = QuestionBankCompiler.Compile(downloaded);
            if (File.Exists(destination))
            {
                var current = QuestionBankCompiler.Compile(
                    await File.ReadAllTextAsync(destination, Encoding.UTF8));
                var currentDate = BankDate(current.Version);
                var downloadedDate = BankDate(compiled.Version);
                if (currentDate is not null &&
                    downloadedDate is not null &&
                    downloadedDate < currentDate)
                {
                    throw new InvalidDataException(
                        $"Downloaded bank {compiled.Version} is older than installed bank {current.Version}.");
                }
            }
            await File.WriteAllTextAsync(
                temporary,
                compiled.JavaScript,
                new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

            if (File.Exists(destination))
            {
                File.Copy(destination, destination + ".previous", overwrite: true);
            }
            File.Move(temporary, destination, overwrite: true);

            ReplyResponse(id, true, new
            {
                version = compiled.Version,
                patterns = compiled.PatternCount,
                questions = compiled.QuestionCount
            });
        }
        catch (Exception ex)
        {
            ReplyResponse(
                id,
                false,
                error: "The update was rejected; the current bank is unchanged. " + ex.Message);
        }
        finally
        {
            if (File.Exists(temporary))
            {
                File.Delete(temporary);
            }
        }
    }

    private async Task OllamaPingAsync(string id)
    {
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(4) };
            var json = await http.GetStringAsync(OllamaBase + "/api/tags");
            using var document = JsonDocument.Parse(json);
            var names = document.RootElement.GetProperty("models")
                .EnumerateArray()
                .Select(model => model.TryGetProperty("name", out var name)
                    ? name.GetString() ?? string.Empty
                    : string.Empty)
                .Where(name => name.Length > 0)
                .ToList();

            _model =
                names.FirstOrDefault(name => name.Contains("qwen3", StringComparison.OrdinalIgnoreCase)) ??
                names.FirstOrDefault(name => name.Contains("qwen", StringComparison.OrdinalIgnoreCase)) ??
                names.FirstOrDefault(name =>
                    !name.Contains("embed", StringComparison.OrdinalIgnoreCase) &&
                    !name.Contains("vl", StringComparison.OrdinalIgnoreCase)) ??
                names.FirstOrDefault() ??
                string.Empty;

            ReplyResponse(id, true, new
            {
                running = true,
                ready = _model.Length > 0,
                installed = true,
                model = _model,
                models = names
            });
            if (_model.Length > 0)
            {
                _ = WarmAsync(_model);
            }
        }
        catch
        {
            // nothing answered on the port. "Installed but not running" is a completely
            // different problem from "never installed", and the student needs to be told which.
            ReplyResponse(id, true, new
            {
                running = false,
                ready = false,
                installed = FindOllamaExe() is not null,
                model = string.Empty,
                models = Array.Empty<string>()
            });
        }
    }

    private static async Task<bool> WarmAsync(string model)
    {
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(180) };
            var body = new
            {
                model,
                stream = false,
                think = false,
                keep_alive = "30m",
                messages = new object[] { new { role = "user", content = "hi" } }
            };
            var response = await http.PostAsync(
                OllamaBase + "/api/chat",
                new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false; // best-effort warmup
        }
    }

    // Awaited warm: loads the model into memory and reports when it is genuinely ready.
    private async Task OllamaWarmAsync(string id)
    {
        if (_model.Length == 0)
        {
            ReplyResponse(id, true, new { ready = false, model = string.Empty });
            return;
        }
        var ready = await WarmAsync(_model);
        ReplyResponse(id, true, new { ready, model = _model });
    }

    private async Task OllamaChatAsync(string id, JsonElement parameters)
    {
        try
        {
            var model = parameters.GetProperty("model").GetString() ?? _model;
            var system = parameters.TryGetProperty("system", out var systemElement)
                ? systemElement.GetString() ?? string.Empty
                : string.Empty;
            var prompt = parameters.GetProperty("prompt").GetString() ?? string.Empty;
            if (model.Length == 0 || prompt.Length == 0 || prompt.Length > 20_000)
            {
                throw new InvalidDataException("Tutor request is missing a model or valid prompt.");
            }

            string content;
            try
            {
                content = await ChatOnce(model, system, prompt, noThink: true);
            }
            catch
            {
                content = await ChatOnce(model, system, prompt, noThink: false);
            }
            content = Regex.Replace(content, "(?s)<think>.*?</think>", string.Empty).Trim();
            ReplyResponse(id, true, new { text = content });
        }
        catch (Exception ex)
        {
            ReplyResponse(id, false, error: ex.Message);
        }
    }

    private async Task AiSetupAsync(string id)
    {
        if (!await _aiSetupGate.WaitAsync(0))
        {
            ReplyResponse(id, false, error: "AI setup is already running.");
            return;
        }

        var temporaryInstaller = Path.Combine(
            Path.GetTempPath(),
            "ACTDrill-" + Guid.NewGuid().ToString("N") + "-OllamaSetup.exe");

        void Progress(int percent, string label) =>
            ReplyEvent("aiSetupProgress", new { percent, label });

        try
        {
            Progress(2, "Checking for Ollama…");
            var executable = FindOllamaExe();
            if (executable is null)
            {
                await DownloadWithProgressAsync(
                    OllamaSetupUrl,
                    temporaryInstaller,
                    (read, total) =>
                    {
                        var percent = total > 0 ? 3 + (int)(read * 40 / total) : 20;
                        Progress(
                            percent,
                            "Downloading Ollama… " + read / 1_048_576 +
                            (total > 0 ? $" / {total / 1_048_576} MB" : " MB"));
                    });

                Progress(44, "Verifying Ollama publisher…");
                AuthenticodeVerifier.VerifyTrustedPublisher(temporaryInstaller, "Ollama");

                Progress(47, "Installing Ollama…");
                using var installer = Process.Start(new ProcessStartInfo(
                    temporaryInstaller,
                    "/VERYSILENT /NORESTART /SUPPRESSMSGBOXES")
                {
                    UseShellExecute = true
                });
                if (installer is null)
                {
                    throw new InvalidOperationException("Ollama installer could not be started.");
                }
                await installer.WaitForExitAsync();
                if (installer.ExitCode != 0)
                {
                    throw new InvalidOperationException(
                        $"Ollama installer returned exit code {installer.ExitCode}.");
                }

                executable = FindOllamaExe()
                    ?? throw new InvalidOperationException(
                        "Ollama installed but could not be located. Launch it once, then retry.");
            }

            Progress(50, "Starting Ollama…");
            if (!await OllamaUpAsync())
            {
                Process.Start(new ProcessStartInfo(executable, "serve")
                {
                    UseShellExecute = false,
                    CreateNoWindow = true
                });
                for (var attempt = 0; attempt < 30 && !await OllamaUpAsync(); attempt++)
                {
                    await Task.Delay(1000);
                }
            }
            if (!await OllamaUpAsync())
            {
                throw new InvalidOperationException(
                    "Ollama did not start. Open the Ollama app once, then retry.");
            }

            Progress(52, "Downloading the tutor model (~2 GB)…");
            await PullModelAsync(Progress);

            Progress(98, "Verifying the tutor model…");
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
            var tags = await http.GetStringAsync(OllamaBase + "/api/tags");
            if (!tags.Contains(SetupModel.Split(':')[0], StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("The tutor model did not verify.");
            }

            Progress(100, "Tutor ready");
            ReplyResponse(id, true, new { model = SetupModel });
        }
        catch (Exception ex)
        {
            ReplyResponse(id, false, error: ex.Message);
        }
        finally
        {
            if (File.Exists(temporaryInstaller))
            {
                File.Delete(temporaryInstaller);
            }
            _aiSetupGate.Release();
        }
    }

    /// <summary>
    /// Ollama is installed but nothing is listening — the usual reason the tutor looks
    /// "lost". Start the installed server and wait for the port to actually answer.
    /// </summary>
    private async Task OllamaStartAsync(string id)
    {
        var executable = FindOllamaExe();
        if (executable is null)
        {
            ReplyResponse(id, false, error: "Ollama isn't installed on this PC yet — use Set up the AI tutor.");
            return;
        }

        try
        {
            // the tray app starts the server and keeps it running between sessions;
            // fall back to `ollama serve` if only the CLI is present
            var trayApp = Path.Combine(Path.GetDirectoryName(executable) ?? string.Empty, "ollama app.exe");
            var start = File.Exists(trayApp)
                ? new ProcessStartInfo(trayApp) { UseShellExecute = true }
                : new ProcessStartInfo(executable, "serve") { UseShellExecute = false, CreateNoWindow = true };
            Process.Start(start);
        }
        catch (Exception ex)
        {
            ReplyResponse(id, false, error: "Could not start Ollama: " + ex.Message);
            return;
        }

        using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(3) };
        for (var attempt = 0; attempt < 20; attempt++)
        {
            await Task.Delay(1000);
            try
            {
                await http.GetStringAsync(OllamaBase + "/api/tags");
                ReplyResponse(id, true, new { started = true });
                return;
            }
            catch
            {
                // still coming up
            }
        }

        ReplyResponse(id, false, error: "Ollama was started but didn't answer within 20 seconds.");
    }

    // ---------- app updates ----------
    // The manifest lives beside the public question bank; it names the version, the download,
    // and the checksum. Nothing about an update is taken from the page.
    private sealed record UpdateManifest(string Version, string Url, string Sha256, string Notes);

    private static string CurrentVersion() =>
        Assembly.GetExecutingAssembly().GetName().Version is { } version
            ? $"{version.Major}.{version.Minor}.{version.Build}"
            : "0.0.0";

    private static bool IsNewer(string latest, string current) =>
        Version.TryParse(latest, out var newVersion) &&
        Version.TryParse(current, out var currentVersion) &&
        newVersion > currentVersion;

    private static async Task<UpdateManifest> FetchUpdateManifestAsync()
    {
        using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(20) };
        var json = await http.GetStringAsync(UpdateManifestUrl);
        if (json.Length > MaxManifestChars)
        {
            throw new InvalidDataException("The update manifest is not a manifest.");
        }

        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        return new UpdateManifest(
            root.TryGetProperty("version", out var v) ? v.GetString() ?? string.Empty : string.Empty,
            root.TryGetProperty("url", out var u) ? u.GetString() ?? string.Empty : string.Empty,
            root.TryGetProperty("sha256", out var s) ? s.GetString() ?? string.Empty : string.Empty,
            root.TryGetProperty("notes", out var n) ? n.GetString() ?? string.Empty : string.Empty);
    }

    private async Task AppUpdateCheckAsync(string id)
    {
        var current = CurrentVersion();
        try
        {
            var manifest = await FetchUpdateManifestAsync();
            ReplyResponse(id, true, new
            {
                current,
                latest = manifest.Version,
                newer = IsNewer(manifest.Version, current),
                notes = manifest.Notes,
                installable = UpdateDownloadPolicy.TryAllow(manifest.Url, out _) &&
                              manifest.Sha256.Length == 64
            });
        }
        catch (Exception ex)
        {
            ReplyResponse(id, false, error: "Could not check for updates: " + ex.Message);
        }
    }

    private async Task AppUpdateInstallAsync(string id)
    {
        var file = Path.Combine(
            Path.GetTempPath(),
            "ACTDrill-" + Guid.NewGuid().ToString("N") + "-Setup.exe");

        void Progress(int percent, string label) =>
            ReplyEvent("appUpdateProgress", new { percent, label });

        try
        {
            Progress(2, "Reading the update details…");
            var manifest = await FetchUpdateManifestAsync();
            if (!IsNewer(manifest.Version, CurrentVersion()))
            {
                throw new InvalidOperationException("This copy is already up to date.");
            }

            if (!UpdateDownloadPolicy.TryAllow(manifest.Url, out var uri) || uri is null)
            {
                throw new InvalidDataException("The update is not hosted where updates are allowed to come from.");
            }

            if (manifest.Sha256.Length != 64)
            {
                throw new InvalidDataException("The update has no usable checksum, so it will not be run.");
            }

            await DownloadWithProgressAsync(uri.ToString(), file, (read, total) =>
            {
                if (read > MaxInstallerBytes)
                {
                    throw new InvalidDataException("The update exceeds the size limit.");
                }

                var percent = total > 0 ? 4 + (int)(read * 86 / total) : 40;
                Progress(
                    percent,
                    $"Downloading {manifest.Version}… {read / 1_048_576}" +
                    (total > 0 ? $" / {total / 1_048_576} MB" : " MB"));
            });

            Progress(92, "Checking the download…");
            string actual;
            await using (var stream = File.OpenRead(file))
            {
                actual = Convert.ToHexString(await SHA256.HashDataAsync(stream));
            }

            if (!actual.Equals(manifest.Sha256, StringComparison.OrdinalIgnoreCase))
            {
                TryDelete(file);
                throw new InvalidDataException("The download did not match the published checksum. It was deleted.");
            }

            Progress(97, "Starting the installer…");
            using var installer = Process.Start(new ProcessStartInfo(file) { UseShellExecute = true });
            if (installer is null)
            {
                throw new InvalidOperationException("The installer did not start.");
            }

            Progress(100, "Installer running — ACTDrill will close so it can be replaced.");
            ReplyResponse(id, true, new { started = true, version = manifest.Version });
            // the installer replaces this executable, so step out of its way
            BeginInvoke(new Action(async () =>
            {
                await Task.Delay(1500);
                Close();
            }));
        }
        catch (Exception ex)
        {
            TryDelete(file);
            ReplyResponse(id, false, error: ex.Message);
        }
    }

    private static void TryDelete(string path)
    {
        try { if (File.Exists(path)) File.Delete(path); }
        catch { /* a leftover temp file is not worth failing an update over */ }
    }

    private static async Task DownloadWithProgressAsync(
        string url,
        string destination,
        Action<long, long> report)
    {
        using var http = new HttpClient { Timeout = TimeSpan.FromMinutes(20) };
        using var response = await http.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
        response.EnsureSuccessStatusCode();
        var total = response.Content.Headers.ContentLength ?? 0;
        await using var source = await response.Content.ReadAsStreamAsync();
        await using var output = File.Create(destination);
        var buffer = new byte[80 * 1024];
        long read = 0;
        int count;
        while ((count = await source.ReadAsync(buffer)) > 0)
        {
            await output.WriteAsync(buffer.AsMemory(0, count));
            read += count;
            report(read, total);
        }
    }

    private static async Task PullModelAsync(Action<int, string> progress)
    {
        var body = new { name = SetupModel, stream = true };
        using var http = new HttpClient { Timeout = TimeSpan.FromMinutes(60) };
        using var request = new HttpRequestMessage(HttpMethod.Post, OllamaBase + "/api/pull")
        {
            Content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json")
        };
        using var response = await http.SendAsync(
            request,
            HttpCompletionOption.ResponseHeadersRead);
        response.EnsureSuccessStatusCode();
        await using var stream = await response.Content.ReadAsStreamAsync();
        using var reader = new StreamReader(stream);
        string? line;
        while ((line = await reader.ReadLineAsync()) is not null)
        {
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }

            using var document = JsonDocument.Parse(line);
            var element = document.RootElement;
            if (element.TryGetProperty("error", out var error))
            {
                throw new InvalidOperationException(error.GetString());
            }
            var status = element.TryGetProperty("status", out var statusElement)
                ? statusElement.GetString() ?? "working"
                : "working";
            var total = element.TryGetProperty("total", out var totalElement)
                ? totalElement.GetInt64()
                : 0;
            var completed = element.TryGetProperty("completed", out var completedElement)
                ? completedElement.GetInt64()
                : 0;
            var percent = total > 0 ? 52 + (int)(completed * 45 / total) : 55;
            progress(
                percent,
                "Model: " + status +
                (total > 0 ? $" {completed / 1_048_576}/{total / 1_048_576} MB" : string.Empty));
        }
    }

    private static string? FindOllamaExe()
    {
        var local = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "Programs",
            "Ollama",
            "ollama.exe");
        if (File.Exists(local))
        {
            return local;
        }

        foreach (var directory in (Environment.GetEnvironmentVariable("PATH") ?? string.Empty)
                     .Split(';', StringSplitOptions.RemoveEmptyEntries))
        {
            try
            {
                var candidate = Path.Combine(directory.Trim(), "ollama.exe");
                if (File.Exists(candidate))
                {
                    return candidate;
                }
            }
            catch
            {
                // Ignore malformed PATH entries.
            }
        }
        return null;
    }

    private static async Task<bool> OllamaUpAsync()
    {
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(3) };
            await http.GetStringAsync(OllamaBase + "/api/tags");
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static async Task<string> ChatOnce(
        string model,
        string system,
        string prompt,
        bool noThink)
    {
        object body = noThink
            ? new
            {
                model,
                stream = false,
                think = false,
                keep_alive = "30m",
                messages = new object[]
                {
                    new { role = "system", content = system },
                    new { role = "user", content = prompt }
                }
            }
            : new
            {
                model,
                stream = false,
                keep_alive = "30m",
                messages = new object[]
                {
                    new { role = "system", content = system },
                    new { role = "user", content = prompt }
                }
            };

        using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(120) };
        using var response = await http.PostAsync(
            OllamaBase + "/api/chat",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
        var text = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException("Ollama returned HTTP " + (int)response.StatusCode + ".");
        }
        return JsonDocument.Parse(text)
            .RootElement.GetProperty("message")
            .GetProperty("content")
            .GetString() ?? string.Empty;
    }

    internal static string ResolveWebDir(string dataDir)
    {
        var beside = Path.Combine(AppContext.BaseDirectory, "web");
        if (HasRequiredAssets(beside))
        {
            return beside;
        }

        var target = Path.Combine(dataDir, "web");
        Directory.CreateDirectory(target);

        var assembly = Assembly.GetExecutingAssembly();
        foreach (var resource in assembly.GetManifestResourceNames())
        {
            // match the full ".web.<file>" suffix: a bare EndsWith("questions.js") also
            // matches beyond-questions.js, which would extract it over the real bank
            var file = new[] { "index.html", "styles.css", "coaching.js", "speech.js", "app.js", "questions.js", "beyond-questions.js", "notes.js" }
                .FirstOrDefault(name =>
                    resource.EndsWith(".web." + name, StringComparison.OrdinalIgnoreCase));
            if (file is null)
            {
                continue;
            }

            var destination = Path.Combine(target, file);
            if (file == "notes.js" && File.Exists(destination))
            {
                continue;
            }

            using var source = assembly.GetManifestResourceStream(resource)
                ?? throw new InvalidDataException($"Embedded asset '{file}' could not be opened.");
            using var output = File.Create(destination);
            source.CopyTo(output);
        }

        if (!HasRequiredAssets(target))
        {
            throw new InvalidDataException("The embedded web application is incomplete.");
        }
        return target;
    }

    private static bool HasRequiredAssets(string directory) =>
        new[] { "index.html", "styles.css", "coaching.js", "speech.js", "app.js", "questions.js", "beyond-questions.js", "notes.js" }
            .All(file => File.Exists(Path.Combine(directory, file)));

    private static DateOnly? BankDate(string version)
    {
        var match = Regex.Match(version, @"\b\d{4}-\d{2}-\d{2}\b");
        return match.Success && DateOnly.TryParse(match.Value, out var date) ? date : null;
    }
}
