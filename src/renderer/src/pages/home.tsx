import { ServiceView } from "@renderer/components/ServiceView";
import { HotKeyScopeMap } from "@renderer/constants/hotkeys";
import { shortcuts } from "@renderer/constants/shortcuts";
import { Sidebar } from "@renderer/modules/sidebar";
import { useHotkeys } from "react-hotkeys-hook";

export default function Home() {
  const { ipcRenderer } = window.electron

  useHotkeys(shortcuts.home.closeWindow.key, () => {
    ipcRenderer.send('set-showing', false);
  }, {
    scopes: HotKeyScopeMap.Home,
  })

  return <div className="flex flex-row h-full">
    <Sidebar />
    <div className="flex-1">
      <ServiceView />
    </div>
  </div>
}
