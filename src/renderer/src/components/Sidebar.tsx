import { FC, useEffect, useState } from 'react';
import { PinIcon, ArrowRightIcon, MoreHorizontalIcon, PinOff } from 'lucide-react';
export const Sidebar: FC = () => {
  const { ipcRenderer } = window.electron;

  const [windowState, setWindowState] = useState({ isPin: false, isShowing: true })

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

  return <div className="w-8 h-full text-white flex flex-col bg-gray-800">
    <div className="flex flex-col gap-3 items-center w-full h-full py-2">
      <ArrowRightIcon className="w-4 h-4" onClick={() => {
        ipcRenderer.send('set-showing', false);
      }} />
      {windowState.isPin ? <PinOff className="w-4 h-4" onClick={() => {
        ipcRenderer.send('set-pin', false);
      }} /> : <PinIcon className="w-4 h-4" onClick={() => {
        ipcRenderer.send('set-pin', true);
      }} />}
      <MoreHorizontalIcon className="w-4 h-4" />
    </div>
  </div>;
};
