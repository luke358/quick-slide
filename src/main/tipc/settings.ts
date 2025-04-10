import { t } from './_instance';

let pin = false
let showing = false
export const settingsRoute = {
  togglePin: t.procedure.action(async () => {
    pin = !pin
  }),
  toggleShowing: t.procedure.action(async () => {
    showing = !showing
  })
}

