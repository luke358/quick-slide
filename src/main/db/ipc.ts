
import { app, BrowserWindow, ipcMain } from "electron"
import { prisma } from "./instance"
import { Prisma } from "@prisma/client"
import path from "path"
import { mkdirSync, readFileSync } from "fs"
import { existsSync } from "fs"
import { download } from "electron-dl"
export async function initTestData() {
  const services: Prisma.ServicesCreateInput[] = [
    {
      serviceId: 'e174d31d-1fc9-4314-ab9e-cd8656e59f1d',
      name: 'Youtube',
      recipeId: 'youtube',
      settings: '{}',
      serviceUrl: 'https://www.youtube.com',
      defaultIconUrl: 'https://www.youtube.com/favicon.ico',
    },
    {
      serviceId: 'e174d31d-1fc9-4314-ab9e-cd8656e59f1c',
      name: 'Youtube',
      recipeId: 'youtube',
      settings: '{}',
      serviceUrl: 'https://www.discord.com',
      defaultIconUrl: 'https://www.discord.com/favicon.ico',
    },
    {
      serviceId: 'e174d31d-1fc9-4314-ab9e-cd8656e59f1f',
      name: 'Binance',
      recipeId: 'binance',
      settings: '{}',
      serviceUrl: 'https://www.binance.com/',
      defaultIconUrl: 'https://www.binance.com/favicon.ico',
    },
  ]
  const count = await prisma.services.findMany()
  if (count.length > 0) return
  await prisma.services.createMany({
    data: services
  })
}

export async function registerDatabaseIPC() {
  await initTestData()
  ipcMain.handle('db:createService', async (_, service) => {
    return await prisma.services.create({
      data: service
    })
  })

  ipcMain.handle('db:getServices', async () => {
    const services = await prisma.services.findMany()
    return services
  })
  ipcMain.handle('db:updateService', async (_, service) => {
    return await prisma.services.update({
      where: { serviceId: service.serviceId },
      data: service
    })
  })


  ipcMain.handle('download-icon', async (_, { serviceName, iconUrl }) => {
    try {
      const iconDir = path.join(app.getPath('userData'), 'icons')
      if (!existsSync(iconDir)) {
        mkdirSync(iconDir)
      }

      const iconPath = path.join(iconDir, `${serviceName}.ico`)

      const win = BrowserWindow.getFocusedWindow();
      if (!win) return null

      await download(win, iconUrl, {
        directory: iconDir,
        filename: `${serviceName}.ico`
      })

      // 读取并转换为 base64
      const iconData = readFileSync(iconPath)
      const base64 = `data:image/x-icon;base64,${iconData.toString('base64')}`

      return base64
    } catch (error) {
      console.error('Error in main process:', error)
      return null
    }
  })
}
