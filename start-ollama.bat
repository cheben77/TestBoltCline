@echo off
echo Démarrage d'Ollama...

REM Vérifier si Ollama est déjà en cours d'exécution
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Ollama est déjà en cours d'exécution
) else (
    echo Lancement d'Ollama...
    start "" "C:\Program Files\Ollama\ollama.exe" serve
    timeout /t 5 /nobreak
    echo Ollama a été démarré
)

REM Vérifier si le modèle llama3.1:8b est disponible
curl -s http://localhost:11434/api/tags | findstr "llama3.1:8b" >nul
if errorlevel 1 (
    echo Téléchargement du modèle llama3.1:8b...
    curl -X POST http://localhost:11434/api/pull -d "{\"name\":\"llama3.1:8b\"}"
)

REM Vérifier si le modèle qwen2.5:14b est disponible
curl -s http://localhost:11434/api/tags | findstr "qwen2.5:14b" >nul
if errorlevel 1 (
    echo Téléchargement du modèle qwen2.5:14b...
    curl -X POST http://localhost:11434/api/pull -d "{\"name\":\"qwen2.5:14b\"}"
)

echo.
echo Démarrage de l'application...
cd /d "%~dp0"
npm run dev
