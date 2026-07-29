# ===========================================================================
# ACT Pattern Drill — optional AI tutor setup (command-line version)
# ---------------------------------------------------------------------------
# The in-app Settings > "Set up the AI tutor" button does this with a progress
# bar and is the easy path. This script is the manual/portable equivalent:
# it DOWNLOADS and INSTALLS Ollama if needed, then pulls a small tutor model,
# then verifies. Everything stays on this computer.
# ===========================================================================

$ErrorActionPreference = "Stop"
$model = "qwen2.5:3b"
Write-Host "`n  ACT Pattern Drill — AI tutor setup`n" -ForegroundColor Cyan

function Find-Ollama {
    $p = "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
    if (Test-Path $p) { return $p }
    $c = Get-Command ollama -ErrorAction SilentlyContinue
    if ($c) { return $c.Source }
    return $null
}
function Ollama-Up {
    try { Invoke-RestMethod "http://localhost:11434/api/tags" -TimeoutSec 3 | Out-Null; return $true } catch { return $false }
}

# 1. Install Ollama if missing
$ollama = Find-Ollama
if (-not $ollama) {
    Write-Host "  Ollama not found. Downloading the installer..." -ForegroundColor Yellow
    $tmp = "$env:TEMP\OllamaSetup.exe"
    Invoke-WebRequest "https://ollama.com/download/OllamaSetup.exe" -OutFile $tmp
    Write-Host "  Installing Ollama (silent)..."
    Start-Process $tmp -ArgumentList "/VERYSILENT /NORESTART /SUPPRESSMSGBOXES" -Wait
    Start-Sleep -Seconds 3
    $ollama = Find-Ollama
    if (-not $ollama) { Write-Host "  Could not locate Ollama after install. Launch it once from the Start menu, then rerun." -ForegroundColor Red; Read-Host "  Press Enter"; exit 1 }
    Write-Host "  Ollama installed." -ForegroundColor Green
} else {
    Write-Host "  Ollama already installed." -ForegroundColor Green
}

# 2. Make sure the server is running
if (-not (Ollama-Up)) {
    Write-Host "  Starting Ollama..."
    Start-Process $ollama -ArgumentList "serve" -WindowStyle Hidden
    for ($i = 0; $i -lt 30 -and -not (Ollama-Up); $i++) { Start-Sleep -Seconds 1 }
}
if (-not (Ollama-Up)) { Write-Host "  Ollama wouldn't start. Open the Ollama app once, then rerun." -ForegroundColor Red; Read-Host "  Press Enter"; exit 1 }

# 3. Pull the model (ollama shows its own progress bar)
Write-Host "`n  Downloading the tutor model ($model, ~2 GB). One-time.`n" -ForegroundColor Cyan
& $ollama pull $model

# 4. Verify
if ((Invoke-RestMethod "http://localhost:11434/api/tags").models.name -match [regex]::Escape($model.Split(':')[0])) {
    Write-Host "`n  ✓ AI tutor ready. Open ACT Pattern Drill, answer a question, and click 'Why this?'`n" -ForegroundColor Green
} else {
    Write-Host "`n  Model didn't verify. Try:  ollama pull $model`n" -ForegroundColor Yellow
}
Read-Host "  Press Enter to close"
