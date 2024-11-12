import { createSettingAtom } from './helper'

export interface GeneralSettings {
  disableMouseSlideTrigger: boolean
  hiddenStatusBarIcon: boolean
  autoMute: boolean
  fasterSlideAnimation: boolean
  multiScreenFollowMouse: boolean
}

const createDefaultSettings = (): GeneralSettings => ({
  disableMouseSlideTrigger: false,
  hiddenStatusBarIcon: false,
  autoMute: false,
  fasterSlideAnimation: false,
  multiScreenFollowMouse: false,
})

export const {
  useSettingKey: useGeneralSettingKey,
  useSettingSelector: useGeneralSettingSelector,
  setSetting: setGeneralSetting,
  clearSettings: clearGeneralSettings,
  initializeDefaultSettings: initializeDefaultGeneralSettings,
  getSettings: getGeneralSettings,
  useSettingValue: useGeneralSettingValue,

  settingAtom: __GeneralSettingAtom,
} = createSettingAtom('General', createDefaultSettings)
