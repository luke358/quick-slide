
export type StoreData = {
  windowState: {
    width: number
    height: number
    float: 'left' | 'right'
  }
  preferences: {
    isPin: boolean
  }
}

export type WindowRuntime = {
  isShow: boolean
}
