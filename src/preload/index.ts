import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 获取状态
  getWindowState: () => ipcRenderer.invoke('get-window-state'),

  // 设置状态
  setPin: (value) => ipcRenderer.send('set-pin', value),
  setShowing: (value) => ipcRenderer.send('set-showing', value),

  // 监听状态变化
  onWindowStateChange: (callback) => {
    ipcRenderer.on('window-state-changed', (_, state) => callback(state))
  },

  // 监听窗口隐藏
  onWindowHiding: (callback) => {
    ipcRenderer.on('window-hiding', callback)
  },
  onWindowShowing: (callback) => {
    ipcRenderer.on('window-showing', callback)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
