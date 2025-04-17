import { shell } from 'electron';
import { getLinkWindow, linkWindowMap } from '../window';
import { t } from './_instance';

export const windowRoute = {
  closeLinkWindow: t.procedure.input<string>().action(async ({ input }) => {
    const linkWindow = getLinkWindow(input)
    if (!linkWindow) return
    linkWindow.close()
    linkWindowMap.delete(input)
  }),
  openExternal: t.procedure.input<string>().action(async ({ input }) => {
    shell.openExternal(input)
  })
}

