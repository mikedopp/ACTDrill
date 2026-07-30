# Repository Notes

## Dependency map

| Component | Dependency | Purpose | Failure mode |
|---|---|---|---|
| Desktop host | .NET 8 WinForms | Native Windows shell | App cannot start |
| Desktop host | WebView2 `1.0.4078.44` | Embedded UI runtime | Clear runtime message |
| Bank compiler | Esprima `3.0.6` | Parse untrusted bank syntax | Update rejected |
| Core UI | `System.Speech` and an installed Windows voice | One native WAV per read-aloud request | Drill remains usable |
| AI tutor | Ollama `localhost:11434` | Optional follow-up chat | Written guide remains |
| Installer | Inno Setup | Per-user Windows installer | Portable EXE remains |

Credentials: none.

## Data flow

`questions.js` and `notes.js` are embedded with the `wwwroot` assets. The app
extracts them to `%LOCALAPPDATA%\ACTDrill\web`; app assets and questions refresh
on app launch, while an existing extracted `notes.js` is preserved.

Browser messages use a typed request/response envelope. The host accepts messages
only from `https://actdrill.local`. External navigation is restricted to the
allowlist in `desktop\Security.cs`.

## Release gates

1. Node tests pass.
2. Desktop Release build completes with zero warnings.
3. Verification executable passes all checks.
4. ScriptForge validates the versioned PowerShell helper.
5. Valhalla style, security, build/publish, and smoke checks are reviewed.
6. Published `ACTDrill.exe --smoke` passes.
7. Installer version, assembly version, UI version, and README agree.
8. A human checks dark/light, 390px, 720×560, extra-large text, keyboard tabs,
   dialogs, and reduced motion before tagging.
