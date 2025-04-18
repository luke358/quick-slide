declare global {
  var windows: {
    mainWindow: Electron.BrowserWindow | null
    overlayWindow: Electron.BrowserWindow | null
  }
}
export {}

// declare global {
//   var windows: {
//     mainWindow: Electron.BrowserWindow | null
//     shortcutsWindows: Electron.BrowserWindow | null
//     overlayWindow: Electron.BrowserWindow | null
//     aboutWindow: Electron.BrowserWindow | null
//   }
// }
// export {}
