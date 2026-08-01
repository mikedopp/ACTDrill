#Requires -Version 7.0
<#
.SYNOPSIS
    Installs and verifies the optional local ACTDrill AI tutor.

.DESCRIPTION
    Script:  actdrill_Setup-AiTutor_v1.16.0.ps1
    Project: ACTDrill
    Version: 1.16.0
    Stage:   Release
    Updated: 2026-07-29
    Author:  Mike Dopp

    Downloads Ollama only when it is absent, validates the Windows publisher
    signature before execution, starts the local service, pulls qwen2.5:3b,
    and verifies the model through the local API. No credentials are used.
#>

[Diagnostics.CodeAnalysis.SuppressMessageAttribute(
    'PSAvoidUsingWriteHost',
    '',
    Justification = 'Interactive installer status is intentional and is not pipeline output.'
)]
param()

#region Configuration
$ScriptVersion = '1.16.0'
$ErrorActionPreference = 'Stop'
$ModelName = 'qwen2.5:3b'
$OllamaUri = 'https://ollama.com/download/OllamaSetup.exe'
$OllamaApi = 'http://localhost:11434'
$ExpectedPublisher = 'Ollama'
#endregion Configuration

#region Dependencies
# Windows PowerShell dependency: Get-AuthenticodeSignature
# Runtime dependency: Ollama (installed by this script after explicit consent)
# Network dependencies: ollama.com and localhost:11434
$ScriptRoot = if ($PSScriptRoot) {
    $PSScriptRoot
}
elseif ($null -ne $psEditor -and $psEditor.GetEditorContext().CurrentFile.Path) {
    Split-Path -Parent $psEditor.GetEditorContext().CurrentFile.Path
}
else {
    (Get-Location).Path
}
Write-Verbose "Script root: $ScriptRoot"
#endregion Dependencies

#region Functions
function Show-RabbitProgress {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string] $Label,

        [Parameter(Mandatory)]
        [ValidateRange(0, 100)]
        [int] $Percent,

        [ValidateRange(8, 60)]
        [int] $TrackWidth = 22,

        [switch] $Final
    )

    $travel = [Math]::Max(0, [Math]::Min($TrackWidth, [Math]::Round($TrackWidth * $Percent / 100)))
    $track = ('━' * $travel) + ('┄' * ($TrackWidth - $travel))
    $color = if ($Final) { "`e[32m" } else { "`e[36m" }
    $line = "$color`r  🐰$track🥕  $Percent%  $Label`e[0m"
    Write-Host $line -NoNewline
    if ($Final) {
        Write-Host
    }
}

function Get-OllamaPath {
    [CmdletBinding()]
    param()

    $localPath = Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'
    if (Test-Path -LiteralPath $localPath -PathType Leaf) {
        return $localPath
    }

    $command = Get-Command -Name 'ollama' -CommandType Application -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }
    return $null
}

function Test-OllamaApi {
    [CmdletBinding()]
    param()

    try {
        Invoke-RestMethod -Uri "$OllamaApi/api/tags" -TimeoutSec 3 -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Assert-TrustedOllamaInstaller {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string] $LiteralPath
    )

    $signature = Get-AuthenticodeSignature -LiteralPath $LiteralPath
    if ($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid) {
        throw "Ollama installer signature is not valid: $($signature.StatusMessage)"
    }
    if ($null -eq $signature.SignerCertificate -or
        $signature.SignerCertificate.Subject -notlike "*$ExpectedPublisher*") {
        throw "Ollama installer publisher is not '$ExpectedPublisher'."
    }
}
#endregion Functions

#region Main
$temporaryInstaller = Join-Path ([System.IO.Path]::GetTempPath()) (
    'ACTDrill-{0}-OllamaSetup.exe' -f [guid]::NewGuid().ToString('N')
)

try {
    Write-Host "`n  ACTDrill $ScriptVersion — optional AI tutor setup" -ForegroundColor Cyan
    Write-Host '  Credentials: none. Model and prompts remain on this computer.' -ForegroundColor DarkGray

    $ollamaPath = Get-OllamaPath
    if (-not $ollamaPath) {
        $choice = Read-Host '  Download and install signed Ollama from ollama.com? [y/N]'
        if ($choice -notmatch '^(?i:y|yes)$') {
            Write-Host '  No changes made.' -ForegroundColor Yellow
            exit 0
        }

        Write-Progress -Activity 'ACTDrill AI tutor' -Status 'Downloading Ollama' -PercentComplete 10
        Show-RabbitProgress -Label 'Downloading signed Ollama installer' -Percent 10
        Invoke-WebRequest -Uri $OllamaUri -OutFile $temporaryInstaller -UseBasicParsing

        Write-Progress -Activity 'ACTDrill AI tutor' -Status 'Verifying publisher signature' -PercentComplete 35
        Show-RabbitProgress -Label 'Verifying publisher signature' -Percent 35
        Assert-TrustedOllamaInstaller -LiteralPath $temporaryInstaller

        Write-Progress -Activity 'ACTDrill AI tutor' -Status 'Installing Ollama' -PercentComplete 45
        Show-RabbitProgress -Label 'Installing Ollama' -Percent 45
        $installer = Start-Process -FilePath $temporaryInstaller `
            -ArgumentList '/VERYSILENT /NORESTART /SUPPRESSMSGBOXES' `
            -Wait -PassThru
        if ($installer.ExitCode -ne 0) {
            throw "Ollama installer returned exit code $($installer.ExitCode)."
        }

        $ollamaPath = Get-OllamaPath
        if (-not $ollamaPath) {
            throw 'Ollama installed but could not be located. Launch it once, then retry.'
        }
    }

    if (-not (Test-OllamaApi)) {
        Write-Progress -Activity 'ACTDrill AI tutor' -Status 'Starting Ollama' -PercentComplete 55
        Show-RabbitProgress -Label 'Starting local Ollama service' -Percent 55
        Start-Process -FilePath $ollamaPath -ArgumentList 'serve' -WindowStyle Hidden
        for ($attempt = 0; $attempt -lt 30 -and -not (Test-OllamaApi); $attempt++) {
            Start-Sleep -Seconds 1
        }
    }
    if (-not (Test-OllamaApi)) {
        throw 'Ollama did not start. Open the Ollama app once, then retry.'
    }

    Write-Progress -Activity 'ACTDrill AI tutor' -Status "Pulling $ModelName" -PercentComplete 65
    Show-RabbitProgress -Label "Pulling $ModelName (~2 GB)" -Percent 65
    & $ollamaPath pull $ModelName
    if ($LASTEXITCODE -ne 0) {
        throw "Ollama pull returned exit code $LASTEXITCODE."
    }

    Write-Progress -Activity 'ACTDrill AI tutor' -Status 'Verifying model' -PercentComplete 95
    Show-RabbitProgress -Label 'Verifying local model' -Percent 95
    $tags = Invoke-RestMethod -Uri "$OllamaApi/api/tags" -TimeoutSec 5
    $modelFamily = $ModelName.Split(':')[0]
    if ($tags.models.name -notmatch [regex]::Escape($modelFamily)) {
        throw "Model '$ModelName' was not returned by the local Ollama API."
    }

    Write-Progress -Activity 'ACTDrill AI tutor' -Completed
    Show-RabbitProgress -Label 'AI tutor ready' -Percent 100 -Final
    Write-Host "  Open ACTDrill and choose 'Why this?' after an answer.`n" -ForegroundColor Green
}
catch {
    Write-Progress -Activity 'ACTDrill AI tutor' -Completed
    Write-Host "`n  Setup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    if (Test-Path -LiteralPath $temporaryInstaller -PathType Leaf) {
        Remove-Item -LiteralPath $temporaryInstaller -Force
    }
}
#endregion Main
