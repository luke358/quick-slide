import { tipcClient } from "@renderer/lib/client";
import { serviceActions } from "@renderer/store/services/store";
import { ExternalLink, MoveDownRight, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function LinkView() {
  const [searchParams] = useSearchParams()
  const url = searchParams.get('url') || ''
  console.log('url', searchParams.get('url'))
  const closeWindow = async () => {
    await tipcClient?.closeLinkWindow(encodeURIComponent(url))
  }
  const openExternalLink = async () => {
    console.log('openExternalLink')
    await tipcClient?.openExternal(url)
    // window.electron.ipcRenderer.invoke('open-external-link')
    closeWindow()
  }

  const addService = () => {
    // serviceActions.addService({
    //   name: 'test',
    //   url: url,
    //   icon: 'addService({
    //   name: 'test',
    //   url: url,
    //   icon: 'URL_ADDRESS.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
    //   type: 'link'
    // })
    // window.electron.ipcRenderer.invoke('add-service')
    // active service
    closeWindow()
  }

  const MENU_LIST = [
    {
      label: '关闭',
      icon: X,
      onClick: closeWindow
    },
    {
      label: '打开外部链接',
      icon: ExternalLink,
      onClick: openExternalLink
    },
    {
      label: '添加服务',
      icon: MoveDownRight,
      onClick: addService
    },

  ]
  return (
    <div className="flex flex-col w-full h-full bg-gray-800 rounded-lg overflow-hidden">
      {/* @ts-ignore */}
      <div className="h-[30px] " style={{ "app-region": "drag" }}>
        <div className="flex items-center text-white h-full space-x-3 pl-3">
          {/* @ts-ignore */}
          {MENU_LIST.map((menu, index) => <menu.icon key={index} size={18} onClick={menu.onClick} style={{ "app-region": "no-drag" }} />)}
        </div>
      </div>
      <div className="w-full flex-1">
        <webview
          className="w-full h-full" src={url} />
      </div>
    </div>
  )
}
