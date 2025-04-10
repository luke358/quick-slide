import { Outlet } from "react-router-dom";
import './index.css'
import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";

const { ipcRenderer } = window.electron
export default function SlideLayout() {
  // const [isHiding, setIsHiding] = useState(false);
  const slideLayoutRef = useRef<HTMLDivElement>(null);

  // const hide = useCallback((event: MouseEvent) => {
  //   // // 检查鼠标是否真的离开了窗口，而不是移动到 webview
  //   // const relatedTarget = event.relatedTarget as HTMLElement;

  //   // // 如果移动到的目标是 webview，则不触发隐藏
  //   // if (relatedTarget?.tagName?.toLowerCase() === 'webview') {
  //   //   return;
  //   // }

  //   // // 检查鼠标是否移动到窗口外
  //   // const { clientX } = event;
  //   // const { innerWidth } = window;

  //   // if (clientX >= innerWidth - 1) {
  //   //   console.log('hide', event);
  //   //   tipcClient?.hideToRight();
  //   // }
  // }, [])
  // useEffect(() => {
  //   const slideLayout = slideLayoutRef.current
  //   console.log('slideLayout', slideLayout)
  //   slideLayout?.addEventListener('mouseleave', hide, {
  //     capture: true
  //   })
  //   const handleHiding = () => {
  //     setIsHiding(true);
  //   }
  //   const handleShowing = () => {
  //     setIsHiding(false);
  //   }
  //   const offHiding = window.api.onWindowHiding(handleHiding)
  //   const offShowing = window.api.onWindowShowing(handleShowing)
  //   return () => {
  //     offHiding()
  //     offShowing()
  //     slideLayout?.removeEventListener('mouseleave', hide, {
  //       capture: true
  //     })
  //   }
  // }, [])

  return <div ref={slideLayoutRef} className={`flex slide-layout`}>
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
}
