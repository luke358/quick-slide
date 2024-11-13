
import { ipcMain } from "electron"
import { prisma } from "./instance"
import { Prisma } from "@prisma/client"

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
}
