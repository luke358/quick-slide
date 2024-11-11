import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'


let mainWindow: BrowserWindow | null = null;
const WINDOW_WIDTH = 300;
function createWindow(): void {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: 600,
    x: screenWidth - WINDOW_WIDTH + 10,
    y: -10,
    frame: false,
    hasShadow: false,
    transparent: true,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreenable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      offscreen: false,
      contextIsolation: true,
      nodeIntegration: false,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    // mainWindow?.webContents.openDevTools();
  })

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');


  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  startMouseTracking();
}

let isPin = false;
let isShowing = true;
let hideTimeout: NodeJS.Timeout | null = null;

function startMouseTracking() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  // 监听鼠标移动事件
  setInterval(() => {
    const { x } = screen.getCursorScreenPoint();
    // 鼠标靠近屏幕右侧触发窗口滑出
    if (x >= width - 2 && !isShowing && !hideTimeout) {
      mainWindow?.focus();
      mainWindow?.show();
      isShowing = true;
      mainWindow?.webContents.send('window-showing')
    }
  }, 200);

  // pin 状态不触发隐藏
  mainWindow?.on('blur', () => {
    if (isPin || !isShowing) return;
    handleHideWindow();
  })

}

function handleHideWindow() {
  if (hideTimeout) return;  // 如果已经在隐藏过程中，直接返回

  mainWindow?.webContents.send('window-hiding')
  isShowing = false;  // 立即设置状态

  hideTimeout = setTimeout(() => {
    mainWindow?.hide();
    hideTimeout = null;  // 清除 timeout 引用
  }, 300)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  app.dock.hide(); // 隐藏 Dock 图标

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('hide-window', () => {
    handleHideWindow();
  })

  ipcMain.on('pin-window', () => {
    isPin = true;
  })

  ipcMain.on('unpin-window', () => {
    isPin = false;
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
