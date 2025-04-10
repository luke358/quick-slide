import { BrowserWindow, BrowserWindowConstructorOptions, screen, shell } from "electron";
import icon from '../../resources/icon.png?asset'
import { join } from "path";
import { is } from "@electron-toolkit/utils";
import { store } from "./store";
import { BOUNDARY_GAP } from "./constants";

const windows = {
  mainWindow: null as BrowserWindow | null,
  overlayWindow: null as BrowserWindow | null,
}
globalThis["windows"] = windows

export function createWindow(options: BrowserWindowConstructorOptions) {
  const window = new BrowserWindow(options)
  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  return window
}

export function createMainWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize
  const windowState = store.get('windowState') || {}
  const { width = 530, height = 800 } = windowState
  const x = screenWidth - width - BOUNDARY_GAP;
  const y = Math.round((screenHeight - height) / 2)

  const overlayWindow = createWindow({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
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
      nodeIntegration: true,
    }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    overlayWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/overlay`)
  } else {
    overlayWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'overlay'
    })
  }

  windows.overlayWindow = overlayWindow

  const mainWindow = createWindow({
    width,
    height,
    x,
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
  mainWindow.on('resize', () => {
    if (!mainWindow) return;
    const [width, height] = mainWindow.getSize();

    store.set('windowState', {
      ...windowState,
      width,
      height,
    });
  });

  windows.mainWindow = mainWindow
  mainWindow.webContents.openDevTools()

  mainWindow.on('resized', () => {
    const cursorPoint = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
    const y = Math.round((currentDisplay.workArea.height - height) / 2) + currentDisplay.workArea.y
    mainWindow?.setBounds({ y }, true)
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    // isDev && mainWindow?.webContents.openDevTools();
  })


  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });

  mainWindow.setAlwaysOnTop(true, 'floating', 1);

  mainWindow.setWindowButtonVisibility(false)

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


  return mainWindow
}
