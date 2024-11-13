import { Outlet } from "react-router-dom";
import './index.css'
import { useEffect } from "react";
import { useState } from "react";

const { ipcRenderer } = window.electron
export default function SlideLayout() {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const handleHiding = () => {
      setIsHiding(true);
    }
    const handleShowing = () => {
      setIsHiding(false);
    }
    const offHiding = window.api.onWindowHiding(handleHiding)
    const offShowing = window.api.onWindowShowing(handleShowing)
    return () => {
      offHiding()
      offShowing()
    }
  }, [])

  return <div className={`flex slide-layout ${isHiding ? 'hiding' : ''}`}>
    <div className="flex-1">
      <Outlet />
    </div>
    <div className="slide-layout-mask w-[10px] bg-transparent" onClick={() => {
      ipcRenderer.send('set-showing', false);
    }}></div>
  </div>
}
