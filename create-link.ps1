$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut('C:\Users\benit\Desktop\Sauvegarder StoaViva.lnk')
$shortcut.TargetPath = 'C:\Users\benit\Desktop\testBoltCline\stoaviva\save-and-rest.bat'
$shortcut.WorkingDirectory = 'C:\Users\benit\Desktop\testBoltCline\stoaviva'
$shortcut.Save()
