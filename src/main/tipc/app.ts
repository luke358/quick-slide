import { t } from './_instance';
import { app } from 'electron';
import { hideToRight, showFromRight } from '../lib/windowAnimation';
export const appRoute = {
  quit: t.procedure.action(async () => {
    app.quit()
  }),
  relaunch: t.procedure.action(async () => {
    app.relaunch()
  }),
  hideToRight: t.procedure.action(async () => {
    hideToRight()
  }),
  showFromRight: t.procedure.action(async () => {
    showFromRight()
  })
}

