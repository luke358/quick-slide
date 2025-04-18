import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { Plugin } from 'vite'
import license from './license.json'
import { readFileSync } from 'fs'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          webview: resolve(__dirname, 'src/preload/webview.ts')
        }
      }
    },
    define: {
      DEBUG: process.env.DEBUG === "true",
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared')
      }
    },
    plugins: [injectLicensePlugin(), react()]
  },
})

function injectLicensePlugin(): Plugin {
  return {
    name: 'inject-license',
    async transform(code, id) {
      if (id.includes('about')) {
        let content = ``
        for await (const [key, value] of Object.entries(license)) {
          if (!value.licenseFile) continue
          const licenseContent = readFileSync(value.licenseFile, 'utf-8')
            .replace(/`/g, '\`')
            .replace(/'/g, "\'")
            .replace(/"/g, '\"')

          content += JSON.stringify(
            `\n${key}\n${(value as any)?.repository || ''}\n${licenseContent}\n\n`
          ).slice(1, -1)
        }

        return {
          code: code.replace('__LICENSE__', content)
        }
      }
      return null
    }
  }
}
