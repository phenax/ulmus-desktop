import { promises as fs, createReadStream } from 'fs'
import path from 'path'
import { app, session, BrowserWindow, ipcMain } from 'electron'
// @ts-ignore
import XMLHttpRequest from 'xhr2'

// Polyfill for elm/http
global.XMLHttpRequest = XMLHttpRequest

const HOST = 'ulmus-app'
const SCHEME = 'http'
const ORIGIN = `${SCHEME}://${HOST}`

type WindowConfig = { path?: string }

const createWindow = async (w: WindowConfig) => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  await mainWindow.loadURL(`${ORIGIN}/${w.path?.replace(/^\/*/g, '') || ''}`)
}

const initApi = (app: any) => {
  // Window api
  app.ports.createWindow?.subscribe?.(createWindow)
}

const getHooks = async () => {
  const defaultHooks = { getFlags: () => ({}), setup() { } }

  if (process.env.JS_MODULE) {
    const jsMod = await import(process.env.JS_MODULE)
    return { ...defaultHooks, ...jsMod.default }
  }

  return defaultHooks
}

const initProcess = async () => {
  const hooks = await getHooks()

  const { Elm } = await import(process.env.MAIN as string)
  const Main: any = Object.values(Elm).find((m: any) => typeof m.init === 'function')

  const app = Main.init({
    flags: await hooks.getFlags(),
  })

  initApi(app)

  // IPC messages
  app.ports.send?.subscribe((msg: any) => ipcMain.emit('from-main', msg))
  ipcMain.on('to-main', (event: any, msg: any) => {
    if (app.ports.receive) {
      app.ports.receive.send(msg)
    } else {
      console.error('Main process is not listening for messages')
    }
  })

  hooks.setup(app)
};

const initializeProtocol = () => {
  const publicDir = process.env.PUBLIC_DIR as string

  session.defaultSession.protocol.interceptStreamProtocol('http', async (request, callback) => {
    const url = new URL(request.url)

    if (url.origin === ORIGIN) {
      const indexPath = path.join(publicDir, 'index.html');
      const filePath = path.join(publicDir, decodeURIComponent(url.pathname))
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

app.whenReady().then(async () => {
  initializeProtocol()
  await initProcess()

  app.on('activate', () => {
    // For macOS
    if (BrowserWindow.getAllWindows().length === 0) createWindow({ path: '/' })
  })
})

app.on('window-all-closed', () => {
  // Quit only for non-macos platforms
  if (process.platform !== 'darwin') app.quit()
})
