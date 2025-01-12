import { BrowserWindow } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { t } from './_instance';
import { app } from 'electron';
import path from 'path';
import { readFile } from 'fs/promises';

export const recipeRouter = {
  getRecipeIcon: t.procedure.input<{ icon: string, recipeName: string }>().action(async ({ input }) => {
    const { icon, recipeName } = input
    try {
      const iconDir = path.join(app.getPath('userData'), 'icons')
      if (!existsSync(iconDir)) {
        mkdirSync(iconDir)
      }
      const iconPath = path.join(iconDir, `${recipeName}.ico`)

      const win = BrowserWindow.getFocusedWindow();
      if (!win) return null
      if (existsSync(iconPath)) {
        const iconData = await readFile(iconPath)
        const base64 = `data:image/x-icon;base64,${iconData.toString('base64')}`
        return base64
      }
      console.log('download', iconDir, iconPath)
      // await download(win, icon, {
      //   directory: iconDir,
      //   filename: `${recipeName}.ico`,
      //   saveAs: false,
      //   showBadge: false,
      //   showProgressBar: false
      // })
      const response = await fetch(icon);
      const buffer = Buffer.from(await response.arrayBuffer());
      writeFileSync(path.join(iconDir, `${recipeName}.ico`), buffer);
      return `data:image/x-icon;base64,${buffer.toString('base64')}`

    } catch (error) {
      console.error('Error in main process:', error)
      return null
    }
  }),
}
