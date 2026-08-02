# ACTDrill

ACTDrill is a free, offline Windows study app for English, Math, and
Reading. It is designed for students who work better with one short problem at
a time, immediate explanations, read-aloud support, and optional step-by-step
coaching.

The bank contains **280 original ACT-style questions across 35 patterns**. It
does not contain copied ACT questions. ACT is a trademark of ACT, Inc.; ACT,
Inc. is not affiliated with this project.

## Install

Download `ACTDrill-Setup.exe` or `ACTDrill-win-x64.zip` from
[GitHub Releases](https://github.com/mikedopp/ACTDrill/releases).

- Windows 10 or 11, x64
- Microsoft WebView2 Runtime (normally already installed)
- No account, API key, or internet connection for normal drills
- Progress is stored locally under `%LOCALAPPDATA%\ACTDrill`

The executable is not commercially code-signed, so Windows SmartScreen may
show an unrecognized-app warning. Release hashes should be checked against the
release notes.

## What it does

- Presents one English, Math, or Reading question at a time
- Explains every choice and adapts repetition toward weaker patterns
- Supports keyboard answers, single-stream native Windows read-aloud, selectable
  installed voices, spoken Math notation, adjustable type, dark/light themes, and
  screen readers
- Starts coached Math with the first small move, then works the setup,
  substitution, calculation, and answer match one visible step at a time
- Tracks local XP, mastery, streaks, and daily goals
- Links to approved official or educational practice resources
- Optionally uses a local Ollama model for follow-up explanations

The Ollama feature is optional. Prompts go only to `localhost:11434`, and the
app does not use credentials. Before the app runs a downloaded Ollama
installer, Windows must report a valid Authenticode signature from an Ollama
publisher.

## Build and verify

Requirements: .NET 8 SDK, Node.js 20+, and PowerShell 7.

```powershell
dotnet restore desktop/ACTDrill.Desktop.csproj
dotnet build desktop/ACTDrill.Desktop.csproj -c Release
dotnet run --project desktop/ACTDrill.Verification/ACTDrill.Verification.csproj -c Release
node --test tests
dotnet publish desktop/ACTDrill.Desktop.csproj -c Release -r win-x64 --self-contained `
  -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o dist
.\dist\ACTDrill.exe --smoke
```

The smoke command checks that all embedded web assets exist and recompiles the
embedded bank through the same strict data-only parser used by bank updates.
Tags matching the project version run the same gates, compile the installer,
publish the portable ZIP, and attach `SHA256SUMS.txt` automatically.

Compile `installer\ACTDrill.iss` with Inno Setup after publishing `dist\ACTDrill.exe`.
The optional manual AI helper is
`installer\actdrill_Setup-AiTutor_v1.18.0.ps1`.

## Repository map

| Path | Purpose |
|---|---|
| `wwwroot\index.html` | Accessible application shell |
| `wwwroot\styles.css` | Responsive Arctic Steel presentation |
| `wwwroot\app.js` | Drill, coaching, accessibility, and local state logic |
| `wwwroot\coaching.js` | Universal Math worked-start step generation |
| `wwwroot\speech.js` | Native WAV playback, spoken Math normalization, and voice selection |
| `desktop\NativeSpeechService.cs` | Windows speech-to-WAV renderer used by the desktop host |
| `questions.js` | Canonical question bank; 280 questions / 35 patterns |
| `notes.js` | Optional personal encouragement notes |
| `desktop\` | .NET 8 WinForms/WebView2 host and security boundary |
| `desktop\ACTDrill.Verification\` | Executable security/content checks |
| `tests\` | Node content and release-consistency tests |
| `installer\` | Inno Setup definition and signed-download AI helper |

The desktop build embeds `wwwroot`, `questions.js`, and `notes.js`. For local
editing, a complete `web` folder beside `ACTDrill.exe` can override the embedded
assets; it must contain `index.html`, `styles.css`, `coaching.js`, `speech.js`,
`app.js`, `questions.js`, and `notes.js`. The extracted `notes.js` is preserved
across app upgrades.

## Question-bank updates

The Progress tab can download the public
[actdrill-bank](https://github.com/mikedopp/actdrill-bank) copy. The desktop
host does not execute that source directly. It:

1. limits the download to 2 MB;
2. parses it as JavaScript syntax;
3. accepts only the specific data declarations/appends used by the bank;
4. validates IDs, subjects, choices, correct-answer counts, and size limits;
5. regenerates trusted JavaScript; and
6. replaces the live file atomically while retaining `.previous`.

Executable expressions, computed properties, prototype keys, duplicate IDs,
unknown patterns, malformed choices, and oversized content are rejected. The
current bank remains untouched when validation fails.

## Personal notes

Edit `notes.js` before publishing to tailor “The Corner” messages. Do not put
private data, credentials, or copyrighted ACT items in public builds.

## Design and product decisions

- [PRODUCT.md](PRODUCT.md) defines the user, purpose, voice, and constraints.
- [DESIGN.md](DESIGN.md) defines interaction and accessibility rules.
- [REPO_NOTES.md](REPO_NOTES.md) records dependencies, data flow, and release
  gates.
