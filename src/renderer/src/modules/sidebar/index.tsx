import { FC, useCallback } from 'react';
import { PinIcon, ArrowRightIcon, MoreHorizontalIcon, PinOff } from 'lucide-react';
import { useShowContextMenu } from '@renderer/atoms/context-menu';
import { ServiceColumn } from './ServiceColumn';
import { shortcuts } from '@renderer/constants/shortcuts';
import { useHotkeys } from 'react-hotkeys-hook';
import { HotKeyScopeMap } from '@renderer/constants/hotkeys';
import { tipcClient } from '@renderer/lib/client';
import { usePreferencesValue, useSetPreferences } from '@renderer/hooks/biz/usePreference';
import { useSetWindowRuntime, useWindowRuntimeValue } from '@renderer/hooks/biz/useWindowRuntime';

export const Sidebar: FC = () => {
  const windowRuntime = useWindowRuntimeValue()
  const setWindowRuntime = useSetWindowRuntime()

  const preferences = usePreferencesValue()
  const serPreferences = useSetPreferences()

  const hideWindow = () => {
    tipcClient?.hideToRight()
    setWindowRuntime({
      ...windowRuntime,
      isShow: false
    })
  }

  const togglePin = () => {
    serPreferences({
      ...preferences,
      isPin: !preferences.isPin
    })
  }


  useHotkeys(shortcuts.home.pinWindow.key, () => {
    togglePin()
  }, {
    scopes: HotKeyScopeMap.Home,
    useKey: true
  })

  const showContextMenu = useShowContextMenu()

  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = useCallback(
    async (e) => {
      e.preventDefault()
      await showContextMenu(
        [
          {
            type: "text",
            label: 'Perferences',
            submenu: [
              {
                type: "text",
                label: 'Disable Mouse Slide Triggering',
                click: () => {
                  // togglePin()
                }
              },
              {
                type: "text",
                label: 'Pin QuickSlide',
                checked: preferences.isPin,
                shortcut: "Meta+P",
                click: () => {
                  togglePin()
                }
              },
              { type: "separator" },
              {
                type: "text",
                checked: true,
                label: 'Start at Login',
                click: () => {
                  // togglePin()
                }
              },
              {
                type: "text",
                label: 'Auto Mute',
                checked: true,
                click: () => {
                  // togglePin()
                }
              },
              {
                type: "text",
                checked: true,
                label: 'Multi-Screen FollowMouse',
                click: () => {
                  // togglePin()
                }
              },
              { type: "separator" },
              {
                type: "text",
                label: 'Clear Cache',
                click: () => {
                  // tipcClient?.openShortcutsWindow()
                },
              },
              {
                type: "text",
                label: 'Clear Cookies',
                click: () => {
                  // tipcClient?.openShortcutsWindow()
                },
              },
              {
                type: "text",
                label: 'Clear Reset QuickSlide',
              },
              { type: "separator" },
              {
                type: "text",
                label: 'No Update',
              },
              {
                type: 'text',
                label: 'Keyboard Shortcuts',
                click: () => {
                  tipcClient?.openShortcutsWindow()
                },
              },
              {
                type: "text",
                label: 'Release Notes',
                click: () => {
                  tipcClient?.openReleaseNotesDialog()
                },
              },
              {
                type: "text",
                label: 'About',
                click: () => {
                  tipcClient?.openAboutWindow()
                }
              }
            ],
          },
          {
            type: "separator",
          },
          {
            type: "text",
            label: 'Relaunch QuickSlide',
            click: () => {
              tipcClient?.relaunch()
            },
          },
          {
            type: "text",
            label: 'Quit QuickSlide',
            click: () => {
              tipcClient?.quit()
            },
          },
        ],
        e,
      )
    },
    [showContextMenu, preferences],
  )


  return <div className="w-8 h-full text-white flex flex-col bg-gray-800 pt-4" onContextMenu={handleContextMenu}>
    <div className="flex flex-col gap-3 items-center w-full">
      <ArrowRightIcon className="w-4 h-4" onClick={() => {
        hideWindow()
      }} />
      {preferences.isPin ? <PinOff className="w-4 h-4" onClick={() => {
        togglePin()
      }} /> : <PinIcon className="w-4 h-4" onClick={() => {
        togglePin()
      }} />}
      <div onClick={handleContextMenu}>
        <MoreHorizontalIcon className="w-4 h-4" />
      </div>
    </div>
    <ServiceColumn />
  </div>;
};
