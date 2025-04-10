import { StoreData } from '../../shared/types';
import { store, windowRuntime } from '../store';
import { t } from './_instance';

export const settingsRoute = {
  getPreferences: t.procedure.action(async () => {
    return store.get('preferences')
  }),
  setPreferences: t.procedure.input<StoreData['preferences']>().action(async ({ input }) => {
    store.set('preferences', input)
  }),
  getWindowRuntime: t.procedure.action(async () => {
    return windowRuntime
  }),
  setWindowRuntime: t.procedure.input<typeof windowRuntime>().action(async ({ input }) => {
    Object.assign(windowRuntime, input)
  }),
}

