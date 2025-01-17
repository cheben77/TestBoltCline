$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("C:\Users\benit\Desktop\Sauvegarder StoaViva.lnk")
$Shortcut.TargetPath = "C:\Users\benit\Desktop\testBoltCline\stoaviva\save-and-rest.bat"
$Shortcut.WorkingDirectory = "C:\Users\benit\Desktop\testBoltCline\stoaviva"
$Shortcut.Description = "Sauvegarde StoaViva et arrête les services"
$Shortcut.IconLocation = "%SystemRoot%\System32\SHELL32.dll,147"
$Shortcut.Save()
