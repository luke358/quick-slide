import { Services } from "@prisma/client";
import { IRecipe } from "../recipe/types";
export type ElectronWebView = Electron.WebviewTag

// 定义运行时状态的 key
export const RUNTIME_STATE_KEYS = [
  'webview',
  'timer',
  'lastPoll',
  'isMediaPlaying',
  'isHibernating',
  'isLoading',
  'isError',
  'shareWithWebview'
] as const

// 使用 typeof 和 typeof 来创建运行时状态 key 的类型
export type RuntimeStateKey = typeof RUNTIME_STATE_KEYS[number]


export interface RuntimeState {
  webview: ElectronWebView | null
  timer: NodeJS.Timeout | null
  lastPoll: number
  isMediaPlaying: boolean
  isHibernating: boolean
  isLoading: boolean
  isError: boolean
  shareWithWebview: {
    id: string
    spellcheckerLanguage: string
    isDarkModeEnabled: boolean
  }
}
export interface IService extends Services, RuntimeState {
  recipe: IRecipe;
}

export interface ServiceState {
  services: IService[];
  activeServiceId: string | null;
  serviceUsed: Set<string>;
}
