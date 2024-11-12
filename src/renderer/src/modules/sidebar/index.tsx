import { FC, useCallback, useEffect, useState } from 'react';
import { PinIcon, ArrowRightIcon, MoreHorizontalIcon, PinOff } from 'lucide-react';
import { useShowContextMenu } from '@renderer/atoms/context-menu';
import { ServiceColumn } from './ServiceColumn';
// import { useShowContextMenu } from '@renderer/atoms/context-menu';
export const Sidebar: FC = () => {
  const { ipcRenderer } = window.electron;

  const [windowState, setWindowState] = useState({ isPin: false, isShowing: true })

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
                type: "checkbox",
                label: 'Pin SlideWindow',
                checked: windowState.isPin,
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
              },
              {
                type: "text",
                label: 'Clear Cookies',
              },
              {
                type: 'text',
                label: 'Reset SlideWindow',
              },
            ],
          },
          {
            type: "separator",
          },
          {
            type: "text",
            label: 'Relaunch SlideWindow',
            click: () => {
              ipcRenderer.send('relaunch')
            },
          },
          {
            type: "text",
            label: 'Quit SlideWindow',
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

  return <div className="w-8 h-full text-white flex flex-col bg-gray-800 py-4" onContextMenu={handleContextMenu}>
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
