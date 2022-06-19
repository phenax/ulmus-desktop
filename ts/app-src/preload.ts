import { contextBridge, ipcRenderer } from 'electron'

const DEBUG = true

const debug = <Args extends any[]>(name: string, fn: (...a: Args) => any) => (...args: Args) => {
  if (DEBUG)
    console.log('[DEBUG]', name, ...args)

  return fn(...args)
}

contextBridge.exposeInMainWorld('$ulmus', {
  send: debug("to main", (msg: any) => ipcRenderer.send('to-main', msg)),
  receive: (fn: (msg: any) => void) =>
    ipcRenderer.on('from-main', debug('from-main', (_ev: any, m: any) => fn(m))),
})

