import { atomWithStorage, selectAtom } from 'jotai/utils'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { createAtomHooks } from '@renderer/lib/jotai'
import { useRefValue } from '@renderer/hooks/common'
import { getStorageNS } from '@renderer/lib/ns'
// import {
//   createSettingBuilder,
//   SettingItem,
// } from '@renderer/modules/settings/setting-builder'
// // import { EventBus } from "@renderer/lib/event-bus"

declare module '@renderer/lib/event-bus' {
  interface CustomEvent {
    SETTING_CHANGE_EVENT: {
      updated: number
      payload: Record<string, any>
      key: string
    }
  }
}

export const createSettingAtom = <T extends object>(
  settingKey: string,
  createDefaultSettings: () => T,
) => {
  const atom = atomWithStorage(
    getStorageNS(settingKey),
    createDefaultSettings(),
    undefined,
    {
      getOnInit: true,
    },
  )

  const [, , useSettingValue, , getSettings, setSettings] =
    createAtomHooks(atom)

  const initializeDefaultSettings = () => {
    const currentSettings = getSettings()
    const defaultSettings = createDefaultSettings()
    if (typeof currentSettings !== 'object') setSettings(defaultSettings)
    const newSettings = { ...defaultSettings, ...currentSettings }
    setSettings(newSettings)
  }

  const useSettingKey = <T extends keyof ReturnType<typeof getSettings>>(
    key: T,
  ) => useAtomValue(useMemo(() => selectAtom(atom, s => s[key]), [key]))

  const useSettingSelector = <
    T extends keyof ReturnType<typeof getSettings>,
    S extends ReturnType<typeof getSettings>,
    R = S[T],
  >(
    selector: (s: S) => R,
  ): R => {
    const stableSelector = useRefValue(selector)

    return useAtomValue(
      // @ts-expect-error: TypeScript cannot infer the type of `selectAtom` correctly here, but it's safe to ignore
      useMemo(() => selectAtom(atom, stableSelector.current), [stableSelector]),
    )
  }

  const setSetting = <K extends keyof ReturnType<typeof getSettings>>(
    key: K,
    value: ReturnType<typeof getSettings>[K],
  ) => {
    const updated = Date.now()
    setSettings({
      ...getSettings(),
      [key]: value,

      updated,
    })

    // maybe need
    // EventBus.dispatch("SETTING_CHANGE_EVENT", {
    //   payload: { [key]: value },
    //   updated,
    //   key: settingKey,
    // })
  }

  const clearSettings = () => {
    setSettings(createDefaultSettings())
  }

  Object.defineProperty(useSettingValue, 'select', {
    value: useSettingSelector,
  })

  return {
    useSettingKey,
    useSettingSelector,
    setSetting,
    clearSettings,
    initializeDefaultSettings,

    useSettingValue,
    getSettings,

    settingAtom: atom,
  } as {
    useSettingKey: typeof useSettingKey
    useSettingSelector: typeof useSettingSelector
    setSetting: typeof setSetting
    clearSettings: typeof clearSettings
    initializeDefaultSettings: typeof initializeDefaultSettings
    useSettingValue: typeof useSettingValue & {
      select: <T extends keyof ReturnType<() => T>>(key: T) => Awaited<T[T]>
    }
    getSettings: typeof getSettings
    settingAtom: typeof atom
  }
}

// export const createDefineSettingItem =
//   <T>(
//     _getSetting: () => T,
//     setSetting: (key: any, value: Partial<T>) => void,
//   ) =>
//   <K extends keyof T>(
//     key: K,
//     options: {
//       label: string
//       description?: string | JSX.Element
//       onChange?: (value: T[K]) => void
//       hide?: boolean
//     } & Omit<
//       SettingItem<any>,
//       'onChange' | 'description' | 'label' | 'hide' | 'key'
//     >,
//   ): any => {
//     const { label, description, onChange, hide, ...rest } = options

//     return {
//       key,
//       label,
//       description,
//       onChange: (value: any) => {
//         if (onChange) return onChange(value as any)
//         setSetting(key, value as any)
//       },
//       disabled: hide,
//       ...rest,
//     } as SettingItem<any>
//   }

// export const createSetting = <T extends object>(
//   useSetting: () => T,
//   setSetting: (key: any, value: Partial<T>) => void,
// ) => {
//   const SettingBuilder = createSettingBuilder(useSetting)
//   const defineSettingItem = createDefineSettingItem(useSetting, setSetting)
//   return {
//     SettingBuilder,
//     defineSettingItem,
//   }
// }
