@echo off
color 0A
cls
echo ===================================
echo         DEMARRAGE STOAVIVA
echo ===================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js n'est pas installé
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

REM Se déplacer dans le répertoire du projet
cd %~dp0

REM Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo [*] Installation des dépendances...
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
)

REM Créer le dossier data s'il n'existe pas
if not exist "data" mkdir data

REM Démarrer le serveur de développement
echo [*] Démarrage du serveur...
start cmd /k "color 0A && npm run dev"

REM Attendre que le serveur soit prêt
echo [*] Attente de l'initialisation...
timeout /t 5 /nobreak > nul

REM Ouvrir le navigateur
echo [*] Ouverture du navigateur...
start http://localhost:3000

echo [*] Démarrage terminé !
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause > nul
