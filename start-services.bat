@echo off
echo Démarrage des services...

REM Vérifier si Ollama est installé
if not exist "C:\Program Files\Ollama\ollama.exe" (
    echo Ollama n'est pas installé. Veuillez l'installer depuis https://ollama.ai/download
    pause
    exit /b 1
)

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

REM Attendre que le serveur Ollama soit prêt
:WAIT_OLLAMA
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo En attente d'Ollama...
    timeout /t 2 /nobreak >nul
    goto WAIT_OLLAMA
)

REM Vérifier et télécharger les modèles nécessaires
echo Vérification des modèles...

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

REM Vérifier si Node.js est installé
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo Installation des dépendances...
    call npm install
)

REM Démarrer l'application Next.js
echo.
echo Démarrage de l'application...
start "Next.js" cmd /c "npm run dev"

REM Attendre que le serveur Next.js soit prêt
:WAIT_NEXTJS
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo En attente du serveur Next.js...
    timeout /t 2 /nobreak >nul
    goto WAIT_NEXTJS
)

echo.
echo Tous les services sont démarrés !
echo L'application est accessible sur http://localhost:3000
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
