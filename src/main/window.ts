import { BrowserWindow, BrowserWindowConstructorOptions, screen, shell } from "electron";
import icon from '../../resources/icon.png?asset'
import { join } from "path";
import { is } from "@electron-toolkit/utils";
import { store } from "./store";
import { BOUNDARY_GAP } from "./constants";
import { hideToRight } from "./lib/windowAnimation";
import { addClickOutsideListener } from 'mouse-click-outside'
import { platform } from "os";

const windows = {
  mainWindow: null as BrowserWindow | null,
  overlayWindow: null as BrowserWindow | null,
  shortcutsWindows: null as BrowserWindow | null,
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
  const cursorPoint = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
  const windowState = store.get('windowState') || {}
  const { width = 530, height = 800 } = windowState

  // 使用当前显示器的工作区域计算初始位置
  const x = currentDisplay.workArea.x + currentDisplay.workArea.width - width - BOUNDARY_GAP;
  const y = currentDisplay.workArea.y + Math.round((currentDisplay.workArea.height - height) / 2);

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
      sandbox: false,
    }
  })

  mainWindow.webContents.on('will-attach-webview', (_e, webPreferences) => {
    webPreferences.preload = join(__dirname, '../preload/webview.mjs')
  })

  mainWindow.webContents.on("did-attach-webview", (_, contents) => {
    contents.setWindowOpenHandler((details) => {
      createLinkViewWindow(details.url)
      return { action: 'deny' }
    })
  })

  if (platform() === 'darwin') {
    addClickOutsideListener(() => {
      const preferences = store.get('preferences') || {}
      if (preferences.isPin) return
      hideToRight()
    })
  } else {
    mainWindow.on('blur', () => {
      const preferences = store.get('preferences') || {}
      if (preferences.isPin) return
      hideToRight()
    })
  }

  mainWindow.on('resize', () => {
    if (!mainWindow) return;
    const [width, height] = mainWindow.getSize();
    store.set('windowState', {
      ...windowState,
      width,
      height,
    });
  });
  mainWindow.on('resized', () => {
    const cursorPoint = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
    const [width, height] = mainWindow.getSize();

    // 使用当前显示器的实际坐标
    const x = currentDisplay.workArea.x + currentDisplay.workArea.width - width - BOUNDARY_GAP;
    const y = currentDisplay.workArea.y + Math.round((currentDisplay.workArea.height - height) / 2);

    mainWindow.setBounds({ x, y }, true)
  });

  windows.mainWindow = mainWindow

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

export const linkWindowMap = new Map<string, BrowserWindow>()
export function getLinkWindow(url: string) {
  return linkWindowMap.get(url)
}
export function createLinkViewWindow(url: string) {

  if (getLinkWindow(url)) {
    getLinkWindow(url)?.focus()
    return
  }
  const cursorPoint = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);

  const width = 800;
  const height = 600;

  const x = currentDisplay.workArea.x + Math.round((currentDisplay.workArea.width - width) / 2);
  const y = currentDisplay.workArea.y + Math.round((currentDisplay.workArea.height - height) / 2);

  const linkViewWindow = createWindow({
    width,
    height,
    x,
    y,
    titleBarStyle: 'hidden',
    transparent: true,
    roundedCorners: false,  // macOS
    ...(process.platform === 'linux' ? { icon } : {}),
    hiddenInMissionControl: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: true,
      webviewTag: true,
    }
  });
  linkViewWindow.setAlwaysOnTop(true, 'floating', 1);

  const _url = encodeURIComponent(url)

  linkWindowMap.set(_url, linkViewWindow)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    linkViewWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/link-view?url=${_url}`)
  } else {
    linkViewWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'link-view',
      query: {
        url: _url,
      },
    })
  }
}


export function createShortcutsWindow() {

  if (windows.shortcutsWindows) {
    windows.shortcutsWindows.show()
    return
  }

  const cursorPoint = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);

  const width = 400;
  const height = 350;

  const x = currentDisplay.workArea.x + Math.round((currentDisplay.workArea.width - width) / 2);
  const y = currentDisplay.workArea.y + Math.round((currentDisplay.workArea.height - height) / 2);

  const shortcutsWindow = createWindow({
    width,
    height,
    x,
    y,
    titleBarStyle: 'hidden',
    transparent: true,
    roundedCorners: false,  // macOS
    ...(process.platform === 'linux' ? { icon } : {}),
    hiddenInMissionControl: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: true,
      webviewTag: true,
    }
  });
  shortcutsWindow.setAlwaysOnTop(true, 'floating', 1);

  shortcutsWindow.on('blur', () => {
    shortcutsWindow.hide()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    shortcutsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/shortcuts`)
  } else {
    shortcutsWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'shortcuts',
    })
  }
}
