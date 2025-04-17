import { createEventHandlers } from "@egoist/tipc/renderer"
import { RendererHandlers } from "@shared/types"

export const handlers = window.electron
  ? createEventHandlers<RendererHandlers>({
      on: (channel, callback) => {
        if (!window.electron) return () => {}
        const remover = window.electron.ipcRenderer.on(channel, callback)
        return () => {
          remover()
        }
      },

      send: window.electron.ipcRenderer.send,
    })
  : null
