import { app, Menu, nativeImage, Tray } from "electron";
import { getTrayIconPath } from "./helper";
import { hideToRight, showFromRight } from "./lib/windowAnimation";

let tray: Tray | null = null

export function registerAppTray() {
  if (tray) {
    destroyAppTray()
  }
  const trayIcon = nativeImage.createFromPath(getTrayIconPath()).resize({ width: 16 })
  trayIcon.setTemplateImage(true)
  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        showFromRight()
      }
    },
    {
      label: '隐藏',
      click: () => {
        hideToRight()
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

  tray.setContextMenu(contextMenu)
  tray.setToolTip(app.getName())
}

const destroyAppTray = () => {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
