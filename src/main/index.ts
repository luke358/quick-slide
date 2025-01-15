import { app, shell, BrowserWindow, ipcMain, screen, MenuItemConstructorOptions, Menu, Tray, nativeImage } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { store } from './store';
import { registerDatabaseIPC } from './db';
import { router } from './tipc';
import { registerIpcMain } from '@egoist/tipc/main';
import isDev from 'electron-is-dev';
import fse from 'fs-extra';

if (isDev) {
  app.setPath('userData', join(app.getPath('appData'), `${app.name}Dev`));
}

async function initializeIcons() {
  console.log('initializeIcons', app.getPath('userData'), app.getAppPath())
  const userIconDir = path.join(app.getPath('userData'), 'icons');
  const defaultIconsPath = isDev
    ? path.join(__dirname, '../../resources/icons')
    : path.join(process.resourcesPath, 'icons');

  if (!fse.existsSync(userIconDir) && fse.existsSync(defaultIconsPath)) {
    fse.ensureDirSync(userIconDir);
    fse.copySync(defaultIconsPath, userIconDir);
  }
}
initializeIcons()

let mainWindow: BrowserWindow | null = null;
let WINDOW_WIDTH = (store.get('window.width') || 530) as number;
let WINDOW_HEIGHT = (store.get('window.height') || 800) as number;
function createWindow(): void {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize
  const y = Math.round((screenHeight - WINDOW_HEIGHT) / 2)

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: screenWidth - WINDOW_WIDTH,
    y,
    frame: false,
    hasShadow: false,
    transparent: true,
    show: false,
    alwaysOnTop: true,
    type: 'toolbar',
    skipTaskbar: true,
    fullscreenable: false,
    focusable: true,
    titleBarStyle: 'hidden',
    roundedCorners: false,  // macOS
    ...(process.platform === 'linux' ? { icon } : {}),
    hiddenInMissionControl: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: true,
      webviewTag: true,
      plugins: true,
    }
  })

  registerIpcMain(router)

  mainWindow.on('resized', () => {
    const cursorPoint = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
    const y = Math.round((currentDisplay.workArea.height - WINDOW_HEIGHT) / 2) + currentDisplay.workArea.y
    mainWindow?.setBounds({ y }, true)
  })
  mainWindow.on('resize', () => {
    if (!mainWindow) return;
    const [width, height] = mainWindow.getSize();

    store.set('window', {
      width,
      height
    });
    WINDOW_WIDTH = width;
    WINDOW_HEIGHT = height;
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    updateWindowState({ isShowing: true })
    // isDev && mainWindow?.webContents.openDevTools();
  })

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });

  mainWindow.setAlwaysOnTop(true, 'floating', 1);

  mainWindow.setWindowButtonVisibility(false)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  mainWindow.webContents.on('context-menu', () => {
    mainWindow?.focus()
  })
  mainWindow.webContents.on('will-attach-webview', (_e, webPreferences) => {
    webPreferences.preload = join(__dirname, '../preload/webview.mjs')
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

let isPin = store.get('window.isPin') as boolean
let isShowing = store.get('window.isShowing') as boolean
let hideTimeout: NodeJS.Timeout | null = null;
let mouseMoveInterval: NodeJS.Timeout | null = null;
let lastX = Infinity;
function startMouseTracking() {
  mouseMoveInterval = setInterval(() => {
    const cursorPoint = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
    const { x } = cursorPoint;
    const deltaX = x - lastX;
    lastX = Math.min(x, lastX);

    // 计算在当前屏幕上的最大允许宽度和高度
    const maxWidth = Math.min(WINDOW_WIDTH, currentDisplay.workArea.width * 0.9);
    const maxHeight = Math.min(WINDOW_HEIGHT, currentDisplay.workArea.height * 0.9);

    // 鼠标靠近当前屏幕右侧触发窗口滑出
    if (deltaX >= 40 && x >= currentDisplay.workArea.x + currentDisplay.workArea.width - 2 && !isShowing && !hideTimeout) {
      // 如果需要调整大小
      if (WINDOW_WIDTH > maxWidth || WINDOW_HEIGHT > maxHeight) {
        mainWindow?.setSize(Math.floor(maxWidth), Math.floor(maxHeight));
        WINDOW_WIDTH = Math.floor(maxWidth);
        WINDOW_HEIGHT = Math.floor(maxHeight);

        // 保存新的尺寸
        store.set('window', {
          ...store.get('window'),
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT
        });
      }
      // 移动窗口到当前屏幕
      mainWindow?.setPosition(
        currentDisplay.workArea.x + currentDisplay.workArea.width - WINDOW_WIDTH,
        Math.round((currentDisplay.workArea.height - WINDOW_HEIGHT) / 2) + currentDisplay.workArea.y
      );
      mainWindow?.show();
      lastX = Infinity;
      updateWindowState({ isShowing: true })
      mainWindow?.webContents.send('window-showing')
    } else if (deltaX >= 40 && x >= currentDisplay.workArea.x + currentDisplay.workArea.width - 2 && isShowing && !hideTimeout) {
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
  createTray()
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

  ipcMain.handle('get-preload-path', () => {
    return `file://${join(__dirname, '../preload/webview.mjs')}`;
  });

  ipcMain.on('set-pin', async (_, value) => {
    await updateWindowState({ isPin: value ? value : !isPin })
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
      callback: () => defer.resolve()
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

app.on('browser-window-blur', () => {
  if (isPin || !isShowing) return;
  handleHideWindow();
})

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

let tray: Tray | null = null

function createTray() {
  console.log('createTray')
  // 创建托盘图标
  const defaultIconsPath = isDev
    ? path.join(__dirname, '../../resources/tray-icon.png')
    : path.join(process.resourcesPath, 'tray-icon.png');
  const icon = nativeImage.createFromPath(
    defaultIconsPath
  ).resize({ width: 16, height: 16 })

  tray = new Tray(icon)

  // 设置托盘图标的悬停提示
  tray.setToolTip('Your App Name')

  // 创建托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        mainWindow?.show();
        updateWindowState({ isShowing: true })
        mainWindow?.webContents.send('window-showing')
      }
    },
    {
      label: '隐藏',
      click: () => {
        handleHideWindow()
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  // 设置托盘的上下文菜单
  tray.setContextMenu(contextMenu)

  // 可选：点击托盘图标时显示窗口
  tray.on('click', () => {
    if (!mainWindow?.isVisible()) {
      mainWindow?.show()
      updateWindowState({ isShowing: true })
      mainWindow?.webContents.send('window-showing')
    }
  })
}
