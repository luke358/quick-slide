import { Outlet } from "react-router-dom";
import './index.css'
import { useEffect } from "react";
import { useState } from "react";

export default function SlideLayout() {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    window.api.onWindowHiding(() => {
      setIsHiding(true);
    })
    window.api.onWindowShowing(() => {
      setIsHiding(false);
    })
  }, [])

  return <div className={`slide-layout ${isHiding ? 'hiding' : ''}`}>
    <Outlet />
  </div>
}
