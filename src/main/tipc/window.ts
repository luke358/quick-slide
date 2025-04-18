
import { app, dialog, shell } from 'electron';
import { createAboutWindow, createShortcutsWindow, getLinkWindow, linkWindowMap } from '../window';
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
  }),
  openShortcutsWindow: t.procedure.action(async () => {
    createShortcutsWindow()
  }),
  openReleaseNotesDialog: t.procedure.action(async () => {
    dialog.showMessageBox({
      type: 'info',
      message: `Thank you for updating QuickSlide ${app.getVersion()}!`,
      detail: '- improve: add shortcuts window',
      buttons: ['OK'],
    })
  }),
  openAboutWindow: t.procedure.action(async () => {
    createAboutWindow()
  }),
}

