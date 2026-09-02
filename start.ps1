# AgriFlow Full-Stack Startup Script
# ====================================
# Starts Backend (Node.js), AI Microservice (Python FastAPI), and Frontend (Vite) concurrently.

Write-Host ""
Write-Host "  ___          _ ___  _              " -ForegroundColor Green
Write-Host " / _ \__ _ _ (_) __|| |_____ __ _   " -ForegroundColor Green
Write-Host "| (_) | || | | | (__| / / _ \ V  V / " -ForegroundColor Green
Write-Host " \__\_\__, |_|_|\___|_\_\___/\_/\_/  " -ForegroundColor Green
Write-Host "      |___/                           " -ForegroundColor Green
Write-Host ""
Write-Host " Smart India Hackathon 2026 - PS 26032 (DoCA)" -ForegroundColor Cyan
Write-Host " AgriFlow - Smart Procurement Queue Platform  " -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$serverDir = Join-Path $rootDir "server"
$clientDir = Join-Path $rootDir "client"
$mlDir = Join-Path $rootDir "ml"

# Check Node.js
$nodePath = "$env:LOCALAPPDATA\Programs\nodejs;$env:PATH"
$env:PATH = $nodePath

Write-Host "[1/3] Starting Backend API + Socket.IO Server (Port 5000)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($dir, $path)
    $env:PATH = $path
    Set-Location $dir
    node server.js
} -ArgumentList $serverDir, $nodePath

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Python AI/ML FastAPI Microservice (Port 8000)..." -ForegroundColor Yellow
$mlJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    python -m uvicorn ml.api.main:app --host 127.0.0.1 --port 8000
} -ArgumentList $rootDir

Start-Sleep -Seconds 2

Write-Host "[3/3] Starting Frontend Vite Dev Server (Port 5173)..." -ForegroundColor Yellow
$clientJob = Start-Job -ScriptBlock {
    param($dir, $path)
    $env:PATH = $path
    Set-Location $dir
    npm run dev
} -ArgumentList $clientDir, $nodePath

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  AgriFlow is running! Open the following in your browser:       " -ForegroundColor Green
Write-Host ""
Write-Host "  Farmer Portal:       http://localhost:5173                    " -ForegroundColor Cyan
Write-Host "  Officer Desk:        http://localhost:5173/officer             " -ForegroundColor Cyan
Write-Host "  Centre Admin:        http://localhost:5173/admin               " -ForegroundColor Cyan
Write-Host "  District Analytics:  http://localhost:5173/analytics           " -ForegroundColor Cyan
Write-Host "  Hero SIH Pitch:      http://localhost:5173/hero-demo           " -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend API:         http://localhost:5000/api                 " -ForegroundColor DarkGray
Write-Host "  AI Microservice:     http://127.0.0.1:8000/docs                " -ForegroundColor DarkGray
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all services." -ForegroundColor Red

try {
    while ($true) {
        Start-Sleep -Seconds 5
        $bStatus = (Get-Job -Id $backendJob.Id).State
        $mStatus = (Get-Job -Id $mlJob.Id).State
        $cStatus = (Get-Job -Id $clientJob.Id).State
        if ($bStatus -ne 'Running' -or $mStatus -ne 'Running' -or $cStatus -ne 'Running') {
            Write-Host "[!] A service stopped unexpectedly. Check logs." -ForegroundColor Red
            break
        }
    }
} finally {
    Stop-Job -Id $backendJob.Id, $mlJob.Id, $clientJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $backendJob.Id, $mlJob.Id, $clientJob.Id -ErrorAction SilentlyContinue
    Write-Host "All AgriFlow services stopped." -ForegroundColor Yellow
}
