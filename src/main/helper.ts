import { fileURLToPath } from 'node:url';
import path from "path";
import isDev from "electron-is-dev";

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export const getTrayIconPath = () => {
  const defaultIconsPath = isDev
    ? path.join(__dirname, '../../resources/tray-icon.png')
    : path.join(process.resourcesPath, 'tray-icon.png');
  return defaultIconsPath
}

export const getIconPath = () => {
  const defaultIconsPath = isDev
    ? path.join(__dirname, '../../resources/icon.png')
    : path.join(process.resourcesPath, 'icon.png');
  return defaultIconsPath
}
