import Store from "electron-store"

type StoreData = {
  windowState: {
    isPin: boolean,
    isVisible: boolean,
    width: number,
    height: number,
    float: 'left' | 'right'
  }
}

export const store = new Store<StoreData>({ name: "db" })
