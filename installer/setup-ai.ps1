# ===========================================================================
# ACT Pattern Drill — optional AI tutor setup
# ---------------------------------------------------------------------------
# The app works fully WITHOUT this. Run this only if you want the live
# "Why this?" chat, which uses a private, offline model via Ollama.
#
# What it does:
#   1. Checks whether Ollama is installed; if not, opens the download page.
#   2. Once Ollama is present, pulls a small, fast model (qwen2.5:3b, ~2 GB).
# Nothing leaves your computer. No account, no API key, no cost.
# ===========================================================================

$ErrorActionPreference = "Stop"
Write-Host "`n  ACT Pattern Drill — optional AI tutor setup`n" -ForegroundColor Cyan

function Have-Ollama {
    if (Get-Command ollama -ErrorAction SilentlyContinue) { return $true }
    return (Test-Path "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe")
}

if (-not (Have-Ollama)) {
    Write-Host "  Ollama isn't installed yet." -ForegroundColor Yellow
    Write-Host "  Opening the download page — install it, then run this again.`n"
    Start-Process "https://ollama.com/download"
    Read-Host "  Press Enter to close"
    exit
}

Write-Host "  Ollama found. Pulling a small, fast tutor model (qwen2.5:3b, ~2 GB)..." -ForegroundColor Green
Write-Host "  This is a one-time download.`n"
try {
    & ollama pull qwen2.5:3b
    Write-Host "`n  Done! Open ACT Pattern Drill, answer a question, and click" -ForegroundColor Green
    Write-Host "  'Why this?' — the status should turn green. Ask it anything.`n"
} catch {
    Write-Host "`n  Couldn't pull the model automatically. Try manually in a terminal:" -ForegroundColor Yellow
    Write-Host "     ollama pull qwen2.5:3b`n"
}
Read-Host "  Press Enter to close"
