#!/usr/bin/env pwsh
# FinanceFlow Startup Script

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   FinanceFlow - Full Stack Application    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "✓ Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = Invoke-WebRequest -Uri "mongodb://localhost:27017" -ErrorAction SilentlyContinue
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MongoDB is not running. Please start MongoDB first:" -ForegroundColor Yellow
    Write-Host "   mongod" -ForegroundColor Yellow
    Write-Host ""
}

# Kill existing Node processes
Write-Host "✓ Stopping any existing Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host ""
Write-Host "✓ Starting Backend on port 3000..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\Backend" -NoNewWindow -PassThru
Write-Host "✅ Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 2

# Start Frontend
Write-Host ""
Write-Host "✓ Starting Frontend on port 5173..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot\Frontend" -NoNewWindow -PassThru
Write-Host "✅ Frontend started (PID: $($frontendProcess.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Application is now running!              ║" -ForegroundColor Green
Write-Host "╠════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  Backend:  http://localhost:3000           ║" -ForegroundColor Green
Write-Host "║  Frontend: http://localhost:5173           ║" -ForegroundColor Green
Write-Host "║  Database: MongoDB (localhost:27017)       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Cyan
