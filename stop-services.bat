@echo off
echo Arrêt des services...

REM Arrêter le serveur Next.js
echo Arrêt du serveur Next.js...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    taskkill /F /PID %%a 2>nul
)

REM Arrêter Ollama
echo Arrêt d'Ollama...
taskkill /F /IM ollama.exe 2>nul

echo.
echo Tous les services ont été arrêtés.
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
