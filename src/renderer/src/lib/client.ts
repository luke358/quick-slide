import { createClient } from "@egoist/tipc/renderer"
import type { Router } from '../../../main/export'
export const tipcClient = window.electron
  ? createClient<Router>({
    ipcInvoke: window.electron.ipcRenderer.invoke,
  })
  : null
