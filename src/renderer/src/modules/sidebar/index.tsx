import { FC, useCallback, useEffect, useState } from 'react';
import { PinIcon, ArrowRightIcon, MoreHorizontalIcon, PinOff } from 'lucide-react';
import { useShowContextMenu } from '@renderer/atoms/context-menu';
import { ServiceColumn } from './ServiceColumn';
import { shortcuts } from '@renderer/constants/shortcuts';
import { useHotkeys } from 'react-hotkeys-hook';
import { HotKeyScopeMap } from '@renderer/constants/hotkeys';

export const Sidebar: FC = () => {
  const { ipcRenderer } = window.electron;

  const [windowState, setWindowState] = useState({ isPin: false, isShowing: true })

  useHotkeys(shortcuts.home.pinWindow.key, () => {
    ipcRenderer.send('set-pin', !windowState.isPin);
  }, {
    scopes: HotKeyScopeMap.Home,
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
                label: 'Pin QuickSlide',
                checked: windowState.isPin,
                shortcut: "Meta+P",
                click: () => {
                  ipcRenderer.send('set-pin', !windowState.isPin);
                }
              },
              // {
              //   type: "text",
              //   label: 'Faster Slide Animation',
              // },
              // {
              //   type: "text",
              //   label: 'Multi-Screen Follow Mouse',
              // },
              {
                type: "separator",
              },
              {
                type: "text",
                label: 'Clear Cache',
                shortcut: "Meta+C",
              },
              {
                type: "text",
                label: 'Clear Cookies',
                shortcut: "Meta+D",
              },
              {
                type: 'text',
                label: 'Reset QuickSlide',
              },
            ],
          },
          {
            type: "separator",
          },
          {
            type: "text",
            label: 'Relaunch QuickSlide',
            click: () => {
              ipcRenderer.send('relaunch')
            },
          },
          {
            type: "text",
            label: 'Quit QuickSlide',
            click: () => {
              ipcRenderer.send('quit')
            },
          },
        ],
        e,
      )
    },
    [showContextMenu, windowState],
  )
  useEffect(() => {
    // 初始化状态
    async function initState() {
      const state = await window.api.getWindowState()
      setWindowState(state)
    }
    initState()

    // 监听状态变化
    window.api.onWindowStateChange((newState) => {
      setWindowState(newState)
    })

  }, [])

  return <div className="w-8 h-full text-white flex flex-col bg-gray-800 pt-4" onContextMenu={handleContextMenu}>
    <div className="flex flex-col gap-3 items-center w-full">
      <ArrowRightIcon className="w-4 h-4" onClick={() => {
        ipcRenderer.send('set-showing', false);
      }} />
      {windowState.isPin ? <PinOff className="w-4 h-4" onClick={() => {
        ipcRenderer.send('set-pin', false);
      }} /> : <PinIcon className="w-4 h-4" onClick={() => {
        ipcRenderer.send('set-pin', true);
      }} />}
      <div onClick={handleContextMenu}>
        <MoreHorizontalIcon className="w-4 h-4" />
      </div>
    </div>
    <ServiceColumn />
  </div>;
};
