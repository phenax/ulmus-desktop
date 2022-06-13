import { promises as fs, createReadStream } from 'fs'
import path from 'path'
import { app, session, BrowserWindow } from 'electron'

const HOST = 'ulmus-app'
const SCHEME = 'http'
const ORIGIN = `${SCHEME}://${HOST}`
const ulmusUrl = (p: string = '') => `${ORIGIN}/${p}`

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      // preload: path.join(__dirname, 'preload.js')
    }
  })

  await mainWindow.loadURL(ulmusUrl())

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

const initializeProtocol = () => {
  const publicDirectory = path.join(__dirname, '../dist/')

  session.defaultSession.protocol.interceptStreamProtocol('http', async (request, callback) => {
    const url = new URL(request.url)

    if (url.origin === ORIGIN) {
      const indexPath = path.join(publicDirectory, 'index.html');
      const filePath = path.join(publicDirectory, decodeURIComponent(url.pathname))
      const stat = await fs.stat(filePath)

      if (stat.isFile()) {
        callback(createReadStream(filePath))
      } else {
        callback(createReadStream(indexPath))
      }
    } else {
      // TODO: Load in as http stream (with validation?)
      callback({ error: -6 })
    }
  })
}

app.whenReady().then(() => {
  initializeProtocol()

  createWindow()
  app.on('activate', () => {
    // MacOS
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // Quit only for non-macos platforms
  if (process.platform !== 'darwin') app.quit()
})
