import path from 'path'
import { app, BrowserWindow } from 'electron'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      // preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('../src/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // MacOS
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  // Quit only for non-macos platforms
  if (process.platform !== 'darwin') app.quit()
})
