import path from "path";
import isDev from "electron-is-dev";
export const getTrayIconPath = () => {
  const defaultIconsPath = isDev
    ? path.join(__dirname, '../../resources/tray-icon.png')
    : path.join(process.resourcesPath, 'tray-icon.png');
  return defaultIconsPath
}
