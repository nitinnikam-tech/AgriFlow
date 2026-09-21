@echo off
title AgriFlow Local Demo Startup
color 0A

echo ========================================================
echo     ___          _ ___  _              
echo    / _ \__ _ _ (_) __^|^| ^|_____ __ _   
echo   ^| (_) ^| ^|^| ^| ^| ^| (__^| / / _ \ V  V / 
echo    \__\_\__, ^|_^|_^|\___^|_\_\___/\_/\_/  
echo         ^|___/                           
echo.
echo  Smart India Hackathon 2026 - PS 26032 (DoCA)
echo  AgriFlow - Smart Procurement Queue Platform  
echo ========================================================
echo.
echo [1/3] Starting Backend API (Port 5000)...
start "AgriFlow Backend" cmd /c "cd server && npm start"
timeout /t 3 >nul

echo [2/3] Starting ML Service (Port 8000)...
start "AgriFlow ML Service" cmd /c "cd ml && python -m uvicorn api.main:app --host 127.0.0.1 --port 8000"
timeout /t 3 >nul

echo [3/3] Starting Frontend (Port 5173)...
start "AgriFlow Frontend" cmd /c "cd client && npm run dev"
timeout /t 3 >nul

echo.
echo ========================================================
echo  All services have been launched in separate windows!
echo.
echo  Access the application at:
echo  http://localhost:5173/
echo.
echo  Close this window to finish, or close individual
echo  service windows to stop them.
echo ========================================================
