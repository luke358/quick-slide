
import { app, BrowserWindow, ipcMain } from "electron"
import { prisma } from "./instance"
import { Prisma } from "@prisma/client"
import path from "path"
import { mkdirSync, readFileSync } from "fs"
import { existsSync } from "fs"
import { download } from "electron-dl"
import { v4 as uuidv4 } from 'uuid'

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
      name: 'Discord',
      recipeId: 'discord',
      settings: '{}',
      serviceUrl: 'https://www.discord.com/app',
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
    {
      name: 'Google Maps',
      serviceUrl: 'https://www.google.com/maps',
      recipeId: 'google-maps',
      settings: '{}',
      serviceId: uuidv4(),
    },
    {
      name: 'Google',
      serviceUrl: 'https://www.google.com',
      recipeId: 'google',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'ChatGPT',
      serviceUrl: 'https://www.chatgpt.com',
      recipeId: 'chatgpt',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Github',
      serviceUrl: 'https://www.github.com',
      recipeId: 'github',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Twitter',
      serviceUrl: 'https://www.twitter.com',
      recipeId: 'twitter',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Discord',
      serviceUrl: 'https://www.discord.com',
      recipeId: 'discord',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Youtube',
      serviceUrl: 'https://www.youtube.com',
      recipeId: 'youtube',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Slack',
      serviceUrl: 'https://www.slack.com',
      recipeId: 'slack',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Notion',
      serviceUrl: 'https://www.notion.com',
      recipeId: 'notion',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Spotify',
      serviceUrl: 'https://www.spotify.com',
      recipeId: 'spotify',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Gmail',
      serviceUrl: 'https://www.gmail.com',
      recipeId: 'gmail',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Google Docs',
      serviceUrl: 'https://www.google.com/docs',
      recipeId: 'google-docs',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Google Calendar',
      serviceUrl: 'https://www.google.com/calendar',
      recipeId: 'google-calendar',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Google Meet',
      serviceUrl: 'https://www.google.com/meet',
      recipeId: 'google-meet',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Google Keep',
      serviceUrl: 'https://www.google.com/keep',
      recipeId: 'google-keep',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Apple Notes',
      serviceUrl: 'https://www.apple.com/notes',
      recipeId: 'apple-notes',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Evernote',
      serviceUrl: 'https://www.evernote.com',
      recipeId: 'evernote',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Telegram',
      serviceUrl: 'https://www.telegram.com',
      recipeId: 'telegram',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'WhatsApp',
      serviceUrl: 'https://www.whatsapp.com',
      recipeId: 'whatsapp',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Google Translate',
      serviceUrl: 'https://www.google.com/translate',
      recipeId: 'google-translate',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Google Drive',
      serviceUrl: 'https://www.google.com/drive',
      recipeId: 'google-drive',
      serviceId: uuidv4(),
      settings: '{}',
    },
    {
      name: 'Trello',
      serviceUrl: 'https://www.trello.com',
      recipeId: 'trello',
      serviceId: uuidv4(),
      settings: '{}',
    }
  ]
  const count = await prisma.services.findMany()
  if (count.length > 0) return
  await prisma.services.createMany({
    data: services
  })

  const preloadServices: Prisma.ServiceCreateInput[] = [
    {
      name: 'Google Maps',
      serviceUrl: 'https://www.google.com/maps',
      recipeId: 'google-maps',
    },
    {
      name: 'Google',
      serviceUrl: 'https://www.google.com',
      recipeId: 'google',
    },
    {
      name: 'ChatGPT',
      serviceUrl: 'https://www.chatgpt.com',
      recipeId: 'chatgpt',
    },
    {
      name: 'Github',
      serviceUrl: 'https://www.github.com',
      recipeId: 'github',
    },
    {
      name: 'Twitter',
      serviceUrl: 'https://www.twitter.com',
      recipeId: 'twitter',
    },
    {
      name: 'Discord',
      serviceUrl: 'https://www.discord.com',
      recipeId: 'discord',
    },
    {
      name: 'Youtube',
      serviceUrl: 'https://www.youtube.com',
      recipeId: 'youtube',
    },
    {
      name: 'Slack',
      serviceUrl: 'https://www.slack.com',
      recipeId: 'slack',
    },
    {
      name: 'Notion',
      serviceUrl: 'https://www.notion.com',
      recipeId: 'notion',
    },
    {
      name: 'Spotify',
      serviceUrl: 'https://www.spotify.com',
      recipeId: 'spotify',
    },
    {
      name: 'Gmail',
      serviceUrl: 'https://www.gmail.com',
      recipeId: 'gmail',
    },
    {
      name: 'Google Docs',
      serviceUrl: 'https://www.google.com/docs',
      recipeId: 'google-docs',
    },
    {
      name: 'Google Calendar',
      serviceUrl: 'https://www.google.com/calendar',
      recipeId: 'google-calendar',
    },
    {
      name: 'Google Meet',
      serviceUrl: 'https://www.google.com/meet',
      recipeId: 'google-meet',
    },
    {
      name: 'Google Keep',
      serviceUrl: 'https://www.google.com/keep',
      recipeId: 'google-keep',
    },
    {
      name: 'Apple Notes',
      serviceUrl: 'https://www.apple.com/notes',
      recipeId: 'apple-notes',
    },
    {
      name: 'Evernote',
      serviceUrl: 'https://www.evernote.com',
      recipeId: 'evernote',
    },
    {
      name: 'Telegram',
      serviceUrl: 'https://www.telegram.com',
      recipeId: 'telegram',
    },
    {
      name: 'WhatsApp',
      serviceUrl: 'https://www.whatsapp.com',
      recipeId: 'whatsapp',
    },
    {
      name: 'Google Translate',
      serviceUrl: 'https://www.google.com/translate',
      recipeId: 'google-translate',
    },
    {
      name: 'Google Drive',
      serviceUrl: 'https://www.google.com/drive',
      recipeId: 'google-drive',
    },
    {
      name: 'Trello',
      serviceUrl: 'https://www.trello.com',
      recipeId: 'trello',
    }
  ]
  const preloadServicesCount = await prisma.service.findMany()
  if (preloadServicesCount.length > 0) return
  await prisma.service.createMany({
    data: preloadServices
  })
}

export async function registerDatabaseIPC() {

  ipcMain.handle('db:fetchAllServices', async () => {
    const services = await prisma.service.findMany()
    return services
  })
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

  ipcMain.handle('db:deleteService', async (_, serviceId) => {
    return await prisma.services.delete({
      where: { serviceId }
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
