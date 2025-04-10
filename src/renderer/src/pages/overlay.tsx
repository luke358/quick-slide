
import { tipcClient } from "@renderer/lib/client"
import { useCallback } from "react"

export default function Overlay() {


  const hide = useCallback(() => {
    tipcClient?.hideToRight()
  }, [])
  return (
    <div onClick={hide} className='w-full h-full bg-transparent'></div>
  )
}
