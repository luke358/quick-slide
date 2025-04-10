import { StoreData } from '../shared/types';
import Store from "electron-store"

export const store = new Store<StoreData>({
  name: "db", defaults: {
    windowState: {
      width: 530,
      height: 800,
      float: 'right'
    },
    preferences: {
      isPin: false
    }
  }
})

export const windowRuntime = {
  isShow: true
}
