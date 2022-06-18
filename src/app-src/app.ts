import { promises as fs, createReadStream } from 'fs'
import path from 'path'
import { app, session, BrowserWindow, ipcMain, IpcMainEvent, BrowserWindowConstructorOptions } from 'electron'
// @ts-ignore
import XMLHttpRequest from 'xhr2'
import { initElmModule } from 'src/utils/elm'
import { mergeDeepRight } from 'ramda'

if (process.env.ELECTRON_IS_DEV) {
  console.log('Ready to reload on changes...')
  // To force dev mode
  Object.assign(process.env, { ELECTRON_IS_DEV: process.env.ELECTRON_IS_DEV })

  try {
    require('electron-reloader')(module, {
      watchRenderer: true,
      debug: false,
    })
  } catch { }
}

// Polyfill for elm/http
global.XMLHttpRequest = XMLHttpRequest

const HOST = 'ulmus-app'
const SCHEME = 'http'
const ORIGIN = `${SCHEME}://${HOST}`

type App = any

type Attr = { type: string, value: any }

type WindowConfig = { id?: string, path?: string, attributes?: Attr[] }

const globalWindowMap = new Map<string, BrowserWindow>()
const windowIdMap = new Map<number, string>()

const match = <Val, Key extends string>(
  key: Key,
  pattern: { [k in Key]: () => Val } & { _?: () => Val }
): Val => (pattern[key] || pattern._)()

const configureWindow = (window: BrowserWindow, attrs: Attr[] = []) => {
  attrs.forEach(({ type, value }: any) => {
    match<any, string>(type, {
      Width: () => window.setBounds({ width: value }),
      Height: () => window.setBounds({ height: value }),
      Icon: () => window.setIcon(value),
      Resizable: () => window.setResizable(value),
      Fullscreen: () => window.setFullScreen(value),
      _: () => console.error(`Can't update ${type} attribute`),
    })
  })
}

const getDerivedAttributes = (attrs: Attr[] = []): BrowserWindowConstructorOptions => {
  const defaultConfig = {}

  if (!attrs) return defaultConfig

  return attrs.reduce((config: BrowserWindowConstructorOptions, { type, value }: any = {}) => {
    return mergeDeepRight(config, match<any, string>(type, {
      Width: () => ({ width: value }),
      Height: () => ({ height: value }),
      Icon: () => ({ icon: value }),
      Resizable: () => ({ resizable: value }),
      Frameless: () => ({ frame: false }),
      Transparent: () => ({ transparent: true }),
      Fullscreen: () => ({ fullscreen: value }),
      DisableDevtools: () => ({ webPreferences: { devTools: false } }),
    }))
  }, defaultConfig)
}

const createWindow = (app: App) => async (config: WindowConfig) => {
  const derivedCfg = getDerivedAttributes(config.attributes)

  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    ...derivedCfg,
    webPreferences: {
      ...derivedCfg.webPreferences,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  if (config.id) {
    const bwId = win.id
    globalWindowMap.set(config.id, win)
    windowIdMap.set(bwId, config.id)

    win.once('closed', () => {
      globalWindowMap.delete(config.id || '')
      windowIdMap.delete(bwId)
    })

    const eventMapping = {
      onWindowReadyToShow: (fn: any) => win.once('ready-to-show', () => fn(config.id)),
      onWindowClosed: (fn: any) => win.once('closed', () => fn(config.id)),
      onBeforeWindowClose: (fn: any) => win.once('close', () => fn(config.id)),
    }

    Object.entries(eventMapping).forEach(([port, addListener]) => {
      if (app.ports[port])
        addListener((x: any) => app.ports[port].send(x))
    })
  }

  await win.loadURL(`${ORIGIN}/${config.path?.replace(/^\/*/g, '') || ''}`)

  win.webContents.openDevTools()
}

const initProcess = async () => {
  const app: App = await initElmModule()

  app.ports.createWindowPort?.subscribe?.(createWindow(app))
  app.ports.updateWindowAttributesPort?.subscribe?.(([windowId, attrs]: [string, Attr[]]) => {
    const win = globalWindowMap.get(windowId)

    if (win) {
      configureWindow(win, attrs)
    }
  })

  // IPC messages
  app.ports.send?.subscribe(([windowId, msg]: any) => {
    const window = globalWindowMap.get(windowId)
    window?.webContents.send('from-main', msg)
  })
  ipcMain.on('to-main', (event: IpcMainEvent, msg: any) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return

    const windowId = windowIdMap.get(win.id)

    if (app.ports.receive) {
      app.ports.receive.send([windowId, msg])
    } else {
      console.error('Main process is not listening for messages')
    }
  })
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
