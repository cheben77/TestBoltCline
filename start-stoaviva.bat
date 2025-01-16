@echo off
cd %~dp0
echo Démarrage de StoaViva...
start cmd /k "npm run dev"
timeout /t 5
start http://localhost:3000
