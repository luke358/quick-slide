import { app, shell, BrowserWindow, ipcMain, screen, MenuItemConstructorOptions, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { store } from './store';
import { registerDatabaseIPC } from './db';

let mainWindow: BrowserWindow | null = null;
const WINDOW_WIDTH = 530;
function createWindow(): void {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: 800,
    x: screenWidth - WINDOW_WIDTH,
    y: 100,
    frame: false,
    hasShadow: false,
    transparent: true,
    show: false,
    alwaysOnTop: true,
    type: 'panel',
    skipTaskbar: true,
    fullscreenable: false,
    focusable: true,
    titleBarStyle: 'hidden',
    roundedCorners: false,  // macOS
    visualEffectState: 'active',  // macOS
    ...(process.platform === 'linux' ? { icon } : {}),
    hiddenInMissionControl: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      offscreen: false,
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    updateWindowState({ isShowing: true })
    // mainWindow?.webContents.openDevTools();
  })

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.setWindowButtonVisibility(false)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  mainWindow.webContents.on('context-menu', () => {
    mainWindow?.focus()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  startMouseTracking();

  mainWindow.webContents.on('blur', () => {
    // mainWindow?.webContents.send('window-blur')
    if (isPin || !isShowing) return;
    handleHideWindow();
  })
}

let isPin = store.get('window.isPin') as boolean
let isShowing = store.get('window.isShowing') as boolean
let hideTimeout: NodeJS.Timeout | null = null;
let mouseMoveInterval: NodeJS.Timeout | null = null;
let lastX = Infinity;
function startMouseTracking() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  // 监听鼠标移动事件
  mouseMoveInterval = setInterval(() => {
    const { x } = screen.getCursorScreenPoint();
    const deltaX = x - lastX;
    lastX = Math.min(x, lastX);

    // 鼠标靠近屏幕右侧触发窗口滑出
    // 鼠标移动超过边界50px触发
    if (deltaX >= 40 && x >= width - 2 && !isShowing && !hideTimeout) {
      mainWindow?.focus();
      mainWindow?.show();
      lastX = Infinity;
      updateWindowState({ isShowing: true })
      mainWindow?.webContents.send('window-showing')
    } else if (deltaX >= 40 && x >= width - 2 && isShowing && !hideTimeout && !isPin) {
      handleHideWindow();
    }
  }, 100);
}

async function updateWindowState(newState) {
  // 更新内存中的状态
  if ('isPin' in newState) isPin = newState.isPin
  if ('isShowing' in newState) isShowing = newState.isShowing

  // 更新存储的状态
  store.set('window', { isPin, isShowing })

  // 通知渲染进程
  mainWindow?.webContents.send('window-state-changed', { isPin, isShowing })
}

function handleHideWindow() {
  if (hideTimeout) return;  // 如果已经在隐藏过程中，直接返回

  mainWindow?.webContents.send('window-hiding')
  // isShowing = false;  // 立即设置状态
  updateWindowState({ isShowing: false })

  hideTimeout = setTimeout(() => {
    mainWindow?.hide();
    hideTimeout = null;  // 清除 timeout 引用
  }, 500)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {

  await registerDatabaseIPC()
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

  ipcMain.handle('get-window-state', () => ({
    isPin: store.get('window.isPin'),
    isShowing: store.get('window.isShowing')
  }))

  ipcMain.on('set-pin', async (_, value) => {
    await updateWindowState({ isPin: value })
  })

  ipcMain.on('set-showing', async (_, value) => {
    await updateWindowState({ isShowing: value })
    if (!value) {
      handleHideWindow();
    }
  })

  ipcMain.handle('show-context-menu', async (_, value) => {
    const defer = Promise.withResolvers<void>()
    const normalizedMenuItems = normalizeMenuItems(value.items, { sender: mainWindow?.webContents! })
    const menu = Menu.buildFromTemplate(normalizedMenuItems)
    menu.popup({
      callback: () => defer.resolve(),
    })
    return defer.promise
  })

  ipcMain.on('relaunch', () => {
    app.relaunch()
    app.exit(0)
  })

  ipcMain.on('quit', () => {
    app.quit()
  })

  ipcMain.handle('get-user-data-path', () => {
    return app.getPath('userData')
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
  if (mouseMoveInterval) clearInterval(mouseMoveInterval);
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// app.on('browser-window-blur', () => {
//   mainWindow?.webContents.send('window-blur')
//   if (isPin || !isShowing) return;
//   handleHideWindow();
// })
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


type SerializableMenuItem = Omit<MenuItemConstructorOptions, "click" | "submenu"> & {
  // id: string
  submenu?: SerializableMenuItem[]
}

function normalizeMenuItems(
  items: SerializableMenuItem[],
  context: { sender: Electron.WebContents },
  path = [] as number[],
): MenuItemConstructorOptions[] {
  return items.map((item, index) => {

    const curPath = [...path, index]
    return {
      ...item,
      click() {
        context.sender.send("menu-click", {
          id: item.id,
          path: curPath,
        })
      },
      submenu: item.submenu ? normalizeMenuItems(item.submenu, context, curPath) : undefined,
    }
  })
}
