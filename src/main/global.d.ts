declare global {
  var windows: {
    mainWindow: Electron.BrowserWindow | null
    overlayWindow: Electron.BrowserWindow | null
  }
}
export {}
