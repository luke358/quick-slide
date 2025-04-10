import { Outlet } from "react-router-dom";
import './index.css'
import { useRef } from "react";

export default function SlideLayout() {
  const slideLayoutRef = useRef<HTMLDivElement>(null);

  return <div ref={slideLayoutRef} className={`flex slide-layout`}>
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
}
