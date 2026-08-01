; ===========================================================================
; ACTDrill — Inno Setup script
; Builds a per-user installer (no admin/UAC needed) that installs the app,
; adds Start-menu + optional desktop shortcuts, and optionally launches the
; AI-tutor setup helper afterward.
;
; Compile with:  ISCC.exe installer\ACTDrill.iss
; (from the repo root, after building dist\ACTDrill.exe)
; Output:        installer\Output\ACTDrill-Setup.exe
; ===========================================================================

#define AppName "ACTDrill"
#define AppVersion "1.16.0"
#define AppPublisher "Mike Dopp"
#define AppExe "ACTDrill.exe"
#define AppUrl "https://github.com/mikedopp/ACTDrill"

[Setup]
AppId={{7B0E2C4A-3D6F-4A21-9E5B-ACTDRILL0001}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
AppSupportURL={#AppUrl}
; Per-user install → no administrator prompt
PrivilegesRequired=lowest
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
OutputDir=Output
OutputBaseFilename=ACTDrill-Setup
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
; the app is 64-bit self-contained
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayIcon={app}\{#AppExe}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Shortcuts:"
Name: "aitutor"; Description: "Set up the optional AI tutor now (needs Ollama; downloads a ~2 GB model)"; GroupDescription: "Optional AI tutor (private & offline):"; Flags: unchecked

[Files]
; the whole app is a single self-contained exe (built into ..\dist)
Source: "..\dist\{#AppExe}"; DestDir: "{app}"; Flags: ignoreversion
; helper to enable the optional local AI later
Source: "actdrill_Setup-AiTutor_v1.16.0.ps1"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\README.md"; DestDir: "{app}"; Flags: ignoreversion isreadme

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExe}"
Name: "{group}\Enable AI tutor"; Filename: "pwsh.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\actdrill_Setup-AiTutor_v1.16.0.ps1"""; Comment: "Set up the optional private AI tutor (Ollama)"
Name: "{group}\Uninstall {#AppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExe}"; Tasks: desktopicon

[Run]
; if the user opted in, run the AI setup helper (visible window) after install
Filename: "pwsh.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\actdrill_Setup-AiTutor_v1.16.0.ps1"""; Description: "Set up the AI tutor"; Flags: postinstall skipifsilent; Tasks: aitutor
; offer to launch the app
Filename: "{app}\{#AppExe}"; Description: "Launch {#AppName} now"; Flags: postinstall nowait skipifsilent

[UninstallDelete]
; app writes progress + extracted web assets here; leave user data unless they remove it manually
; (intentionally NOT deleting {localappdata}\ACTDrill so progress survives reinstalls)
