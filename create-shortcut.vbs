Set oWS = WScript.CreateObject("WScript.Shell")
strDesktop = oWS.SpecialFolders("Desktop")
Set oLink = oWS.CreateShortcut(strDesktop & "\StoaViva.lnk")
oLink.TargetPath = oWS.CurrentDirectory & "\start-stoaviva.bat"
oLink.WorkingDirectory = oWS.CurrentDirectory
oLink.IconLocation = oWS.CurrentDirectory & "\public\favicon.ico"
oLink.Save
