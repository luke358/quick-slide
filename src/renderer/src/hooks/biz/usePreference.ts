import { tipcClient } from "@renderer/lib/client"
import { StoreData } from "@shared/types"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { useCallback } from "react"

const preferencesAtom = atom<StoreData['preferences']>({
  isPin: false,
})

preferencesAtom.onMount = (setAtom) => {
  tipcClient?.getPreferences().then((preferences) => {
    setAtom(preferences)
  })
}

export const usePreferencesValue = () => useAtomValue(preferencesAtom)!

export const useSetPreferences = () => {
  const setPreferencesAtom = useSetAtom(preferencesAtom)
  return useCallback(
    (value: StoreData['preferences']) => {
      setPreferencesAtom(value)
      tipcClient?.setPreferences(value)
    },
    [setPreferencesAtom],
  )
}
