Set objShell = CreateObject("WScript.Shell")
strDesktop = objShell.SpecialFolders("Desktop")

Set oShellLink = objShell.CreateShortcut(strDesktop & "\Sauvegarder StoaViva.lnk")
oShellLink.TargetPath = "C:\Users\benit\Desktop\testBoltCline\stoaviva\save-and-rest.bat"
oShellLink.WorkingDirectory = "C:\Users\benit\Desktop\testBoltCline\stoaviva"
oShellLink.Description = "Sauvegarde StoaViva et arrête les services"
oShellLink.IconLocation = "%SystemRoot%\System32\SHELL32.dll,147"
oShellLink.Save
