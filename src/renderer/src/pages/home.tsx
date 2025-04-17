import { ServiceView } from "@renderer/modules/webview/ServiceView";
import { HotKeyScopeMap } from "@renderer/constants/hotkeys";
import { shortcuts } from "@renderer/constants/shortcuts";
import { Sidebar } from "@renderer/modules/sidebar";
import { useActiveService, useActiveServiceId, useServicesData, useServiceUsed } from "@renderer/store/services/hooks";
import { useHotkeys } from "react-hotkeys-hook";
import AddPanel from "@renderer/components/add-panel";
import { useRemoveServiceMutation, useServices } from "@renderer/queries/services";
import { serviceActions } from "@renderer/store/services/store";

export default function Home() {
  const { isLoading } = useServices()
  const { ipcRenderer } = window.electron
  const serviceUsed = useServiceUsed()
  const services = useServicesData()
  const activeServiceId = useActiveServiceId()
  const removeServiceMutation = useRemoveServiceMutation()
  const service = useActiveService()

  useHotkeys(shortcuts.home.closeWindow.key, () => {
    ipcRenderer.send('set-showing', false);
  }, {
    scopes: HotKeyScopeMap.Home,
  })

  useHotkeys(shortcuts.home.delApp.key, () => {
    service && removeServiceMutation.mutate(service.serviceId)
  }, {
    preventDefault: true,
    scopes: HotKeyScopeMap.Home
  })

  useHotkeys(shortcuts.home.reloadApp.key, () => {
    service?.webview?.reload()
  }, {
    preventDefault: true,
    scopes: HotKeyScopeMap.Home
  })

  useHotkeys(shortcuts.home.gotoNew.key, () => {
    serviceActions.setActive(null)
  }, {
    preventDefault: true,
    scopes: HotKeyScopeMap.Home
  })

  return isLoading ? <div className="w-full h-full bg-gray-800 rounded-3xl">Loading...</div> : <div className="flex flex-row h-full rounded-2xl bg-gray-800 overflow-hidden relative">
    <Sidebar />
    <div className="flex-1 relative rounded-2xl overflow-hidden">
      {services?.map(service => <div key={service.serviceId} className="h-full w-full" style={{
        opacity: activeServiceId === service.serviceId ? 1 : 0,
        pointerEvents: activeServiceId === service.serviceId ? 'auto' : 'none',
        willChange: 'opacity'
      }}>
        {(activeServiceId === service.serviceId || serviceUsed.has(service.serviceId)) && <ServiceView service={service}
          className="absolute left-0 top-0 w-full h-full" />}
      </div>)}
      {!activeServiceId && <AddPanel />}
    </div>
  </div>
}
