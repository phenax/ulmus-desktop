import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('$ulmus', {
  send: (msg: any) => ipcRenderer.send('to-main', msg),
  receive: (fn: (msg: any) => void) => ipcRenderer.on('from-main', fn),
})

