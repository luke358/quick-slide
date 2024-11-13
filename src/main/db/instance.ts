import { join } from "path"
import { app } from "electron"
import isDev from 'electron-is-dev'
import { copyFileSync, existsSync, mkdirSync } from "fs"
import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

// 获取正确的数据库路径
const getDatabasePath = () => {
  if (isDev) {
    // 开发环境：使用项目根目录下的 prisma/dev.db
    return join(process.cwd(), 'prisma/dev.db')
  } else {
    // 生产环境：使用用户数据目录
    return join(app.getPath("userData"), "database.db")
  }
}

const dbPath = getDatabasePath()
const dbDir = join(dbPath, '..')

// 确保目录存在
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

// 初始化数据库文件
if (!isDev) {
  try {
    const sourceDbPath = join(process.resourcesPath, 'prisma/dev.db')
    if (!existsSync(dbPath)) {
      if (!existsSync(sourceDbPath)) {
        throw new Error('Source database file not found: ' + sourceDbPath)
      }
      copyFileSync(sourceDbPath, dbPath)
      console.log("New database file created at:", dbPath)
    } else {
      console.log("Database file exists at:", dbPath)
    }
  } catch (err) {
    console.error(`Failed handling database file:`, err)
    throw err
  }
}

// 使用单例模式
export const prisma = global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`,
      },
    },
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  })

if (isDev) {
  global.prisma = prisma
}

// 优雅关闭数据库连接
const disconnectDB = async () => {
  try {
    await prisma.$disconnect()
    console.log('Database disconnected')
  } catch (err) {
    console.error('Error disconnecting from database:', err)
    process.exit(1)
  }
}

process.on('exit', disconnectDB)
process.on('SIGINT', disconnectDB)
process.on('SIGTERM', disconnectDB)
