import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png?asset'
// import { registerDatabaseIPC } from './db';
import { router } from './tipc';
import { registerIpcMain } from '@egoist/tipc/main';
import isDev from 'electron-is-dev';
import { initializeIcons } from './init';
import { registerAppTray } from './tray';
import { createMainWindow } from './window';
import { startMouseTracking } from './lib/windowAnimation';
if (isDev) {
  app.setPath('userData', join(app.getPath('appData'), `${app.name}Dev`));
}

function bootstrap() {
  initializeIcons()

  app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.luke358')

    app.dock.hide(); // 隐藏 Dock 图标
    registerAppTray()

    createMainWindow()

    // await registerDatabaseIPC()
    registerIpcMain(router)

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.dock.hide(); // 隐藏 Dock 图标

    startMouseTracking();

    ipcMain.on('ping', () => console.log('pong'))

  })
}

bootstrap()

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
