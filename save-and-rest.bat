@echo off
echo ===================================
echo        SAUVEGARDE STOAVIVA
echo ===================================

echo [*] Arrêt des services...
call .\stop-services.bat
timeout /t 10 /nobreak

echo [*] Création du dossier de backup...
if not exist "..\backup" mkdir "..\backup"
if not exist "..\backup\stoaviva-latest" mkdir "..\backup\stoaviva-latest"

echo [*] Sauvegarde des fichiers...
xcopy /s /e /y .\ ..\backup\stoaviva-latest\

echo [*] Sauvegarde datée...
set BACKUP_DATE=%date:~-4,4%%date:~-7,2%%date:~-10,2%
if not exist "..\backup\stoaviva-%BACKUP_DATE%" mkdir "..\backup\stoaviva-%BACKUP_DATE%"
xcopy /s /e /y .\ "..\backup\stoaviva-%BACKUP_DATE%\"

echo ===================================
echo [*] Sauvegarde terminée !
echo [*] Vous pouvez dormir tranquille :)
echo ===================================

pause
