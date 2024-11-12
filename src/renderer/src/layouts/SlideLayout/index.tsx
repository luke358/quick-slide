import { Outlet } from "react-router-dom";
import './index.css'
import { useEffect } from "react";
import { useState } from "react";

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

  return <div className={`slide-layout ${isHiding ? 'hiding' : ''}`}>
    <Outlet />
  </div>
}
