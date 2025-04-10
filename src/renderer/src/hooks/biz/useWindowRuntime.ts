import { tipcClient } from "@renderer/lib/client"
import { WindowRuntime } from "@shared/types"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { useCallback } from "react"

const windowRuntimeAtom = atom<WindowRuntime>({
  isShow: true
})

windowRuntimeAtom.onMount = (setAtom) => {
  tipcClient?.getWindowRuntime().then((windowRuntime) => {
    setAtom(windowRuntime)
  })
}

export const useWindowRuntimeValue = () => useAtomValue(windowRuntimeAtom)!

export const useSetWindowRuntime = () => {
  const setWindowRuntimeAtom = useSetAtom(windowRuntimeAtom)
  return useCallback(
    (value: WindowRuntime) => {
      console.log('useSetWindowRuntime', value)
      setWindowRuntimeAtom(value)
      tipcClient?.setWindowRuntime(value)
    },
    [setWindowRuntimeAtom],
  )
}
