import { getOS, OS } from "@renderer/lib/utils"


export const shortcutConfigs = {
  home: {
    closeWindow: {
      name: "keys.home.closeWindow",
      key: "Escape",
    },
    pinWindow: {
      name: "keys.home.pinWindow",
      key: "Meta+P",
    },
    nextApp: {
      name: "keys.home.nextApp",
      key: "Meta+]",
    },
    prevApp: {
      name: "keys.home.prevApp",
      key: "Meta+[",
    },
    delApp: {
      name: "keys.home.delApp",
      key: "Meta+shift+W"
    },
    reloadApp: {
      name: "keys.home.reloadApp",
      key: "Meta+R"
    },
    gotoNew: {
      name: "keys.home.gotoNew",
      key: "Meta+N"
    }
  }
} as const

function transformShortcuts<T extends Shortcuts>(configs: T) {
  const result = configs

  for (const category in configs) {
    for (const shortcutKey in configs[category]) {
      const config = configs[category][shortcutKey]
      result[category]![shortcutKey]!.key = transformShortcut(config!.key)
    }
  }

  return result
}
type ShortcutConfig = {
  name: string;
  key: string;
}
type Shortcuts = {
  [category: string]: {
    [shortcut: string]: ShortcutConfig;
  };
}
export const shortcuts = transformShortcuts(shortcutConfigs)

export const shortcutsType: { [key in keyof typeof shortcuts] } = {
  home: "keys.type.feeds",
}



export function transformShortcut(shortcut: string, platform: OS = getOS()): string {
  if (platform === "Windows") {
    return shortcut.replace("Meta", "Ctrl").replace("meta", "ctrl")
  }
  return shortcut
}
