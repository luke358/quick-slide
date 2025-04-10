import { app } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import fse from "fs-extra";

export function initializeIcons() {
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
