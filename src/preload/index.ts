import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const { ipcRenderer } = electronAPI
// Custom APIs for renderer
const api = {
  // 获取状态
  getWindowState: () => ipcRenderer.invoke('get-window-state'),

  // 设置状态
  setPin: (value) => ipcRenderer.send('set-pin', value),
  setShowing: (value) => ipcRenderer.send('set-showing', value),

  // 监听状态变化
  onWindowStateChange: (callback) => {
    return ipcRenderer.on('window-state-changed', (_, state) => callback(state))
  },

  // 监听窗口隐藏
  onWindowHiding: (callback) => {
    return ipcRenderer.on('window-hiding', callback)
  },
  onWindowShowing: (callback) => {
    return ipcRenderer.on('window-showing', callback)
  },
  onWindowBlur: (callback) => {
    return ipcRenderer.on('window-blur', callback)
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
