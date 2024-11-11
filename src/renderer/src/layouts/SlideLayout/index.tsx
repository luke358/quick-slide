import { Outlet } from "react-router-dom";
import './index.css'
import { useEffect } from "react";
import { useState } from "react";

export default function SlideLayout() {
  const { ipcRenderer } = window.electron;

  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {

    const handleShowing = () => {
      setIsHiding(false);
    };

    const handleHiding = () => {
      setIsHiding(true);
    };

    const removeShowing = ipcRenderer.on('window-showing', handleShowing);
    const removeHiding = ipcRenderer.on('window-hiding', handleHiding);

    return () => {
      removeShowing();
      removeHiding();
    };
  }, []);

  return <div className={`slide-layout ${isHiding ? 'hiding' : ''}`}>
    <Outlet />
  </div>
}
