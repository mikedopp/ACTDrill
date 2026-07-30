using System.Speech.Synthesis;
using System.Text.RegularExpressions;

namespace ACTDrill.Desktop;

internal sealed record NativeVoiceOption(string Id, string Name, string Culture);

internal sealed record NativeSpeechAudio(byte[] WaveBytes, string VoiceName);

internal static partial class NativeSpeechService
{
    private const int MaxSpeechCharacters = 20_000;

    internal static IReadOnlyList<NativeVoiceOption> GetVoices()
    {
        using var synthesizer = new SpeechSynthesizer();
        return synthesizer
            .GetInstalledVoices()
            .Where(voice => voice.Enabled)
            .Select(voice => voice.VoiceInfo)
            .OrderBy(info => info.Culture.TwoLetterISOLanguageName == "en" ? 0 : 1)
            .ThenBy(info => info.Name, StringComparer.CurrentCultureIgnoreCase)
            .Select(info => new NativeVoiceOption(
                "native:" + info.Name,
                info.Name,
                info.Culture.Name))
            .ToArray();
    }

    internal static Task<NativeSpeechAudio> SynthesizeAsync(
        string text,
        string? requestedVoice,
        int rate)
    {
        var completion = new TaskCompletionSource<NativeSpeechAudio>(
            TaskCreationOptions.RunContinuationsAsynchronously);
        var thread = new Thread(() =>
        {
            try
            {
                completion.SetResult(Synthesize(text, requestedVoice, rate));
            }
            catch (Exception ex)
            {
                completion.SetException(ex);
            }
        })
        {
            IsBackground = true,
            Name = "ACTDrill native speech"
        };
        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();
        return completion.Task;
    }

    internal static NativeSpeechAudio Synthesize(
        string text,
        string? requestedVoice,
        int rate)
    {
        var normalized = Whitespace().Replace(text ?? string.Empty, " ").Trim();
        if (normalized.Length == 0)
        {
            throw new InvalidDataException("Speech text is empty.");
        }
        if (normalized.Length > MaxSpeechCharacters)
        {
            throw new InvalidDataException("Speech text is too long.");
        }

        using var synthesizer = new SpeechSynthesizer
        {
            Rate = Math.Clamp(rate, -10, 10),
            Volume = 100
        };

        var installed = synthesizer
            .GetInstalledVoices()
            .Where(voice => voice.Enabled)
            .Select(voice => voice.VoiceInfo.Name)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        if (!string.IsNullOrWhiteSpace(requestedVoice) &&
            installed.Contains(requestedVoice))
        {
            synthesizer.SelectVoice(requestedVoice);
        }

        using var wave = new MemoryStream();
        synthesizer.SetOutputToWaveStream(wave);
        synthesizer.Speak(normalized);
        synthesizer.SetOutputToNull();

        var bytes = wave.ToArray();
        if (bytes.Length <= 44 ||
            bytes[0] != (byte)'R' ||
            bytes[1] != (byte)'I' ||
            bytes[2] != (byte)'F' ||
            bytes[3] != (byte)'F')
        {
            throw new InvalidDataException("Windows did not produce valid speech audio.");
        }
        return new NativeSpeechAudio(bytes, synthesizer.Voice.Name);
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex Whitespace();
}
