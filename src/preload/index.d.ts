import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getWindowState: () => Promise<WindowState>
      setPin: (value: boolean) => void
      setShowing: (value: boolean) => void
      onWindowStateChange: (callback: (state: WindowState) => void) => () => void
      onWindowHiding: (callback: () => void) => () => void
      onWindowShowing: (callback: () => void) => () => void
      // onWindowBlur: (callback: () => void) => () => void
    }
  }
}
