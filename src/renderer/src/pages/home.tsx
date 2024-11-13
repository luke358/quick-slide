import { ServiceView } from "@renderer/components/ServiceView";
import { HotKeyScopeMap } from "@renderer/constants/hotkeys";
import { shortcuts } from "@renderer/constants/shortcuts";
import { Sidebar } from "@renderer/modules/sidebar";
import { useActiveServiceId, useServiceUsed, useServicesData } from "@renderer/store/services/hooks";
import { useHotkeys } from "react-hotkeys-hook";

export default function Home() {
  const { ipcRenderer } = window.electron
  const serviceUsed = useServiceUsed()
  const { isLoading, services } = useServicesData()
  const activeServiceId = useActiveServiceId()

  useHotkeys(shortcuts.home.closeWindow.key, () => {
    ipcRenderer.send('set-showing', false);
  }, {
    scopes: HotKeyScopeMap.Home,
  })

  return isLoading ? <div className="w-full h-full bg-white">Loading...</div> : <div className="flex flex-row h-full bg-white">
    <Sidebar />
    <div className="flex-1 relative">
      {services.map(service => <div key={service.serviceId} className="h-full w-full" style={{
        opacity: activeServiceId === service.serviceId ? 1 : 0,
        pointerEvents: activeServiceId === service.serviceId ? 'auto' : 'none',
        willChange: 'opacity'
      }}>
        {(activeServiceId === service.serviceId || serviceUsed.has(service.serviceId)) && <ServiceView service={service}
          className="absolute left-0 top-0 w-full h-full" />}
      </div>)}
    </div>
  </div>
}
