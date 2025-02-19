import { createZustandStore } from "../utils/helper";
import { IService, RUNTIME_STATE_KEYS, RuntimeState, ServiceState } from "./types";
import ms from "ms";
import { persist } from 'zustand/middleware'
import { debounce, omit } from "lodash-es";
import { WebviewTag } from "electron";
import { Services } from "@prisma/client";

const initialState = {
  services: [],
  serviceUsed: new Set<string>(),
  activeServiceId: null,
  lastServiceUrls: {}
};

export const useServiceStore = createZustandStore<ServiceState>("service")(persist(
  (_) => initialState, {
  name: 'service',
  partialize: (state) => ({
    lastServiceUrls: state.lastServiceUrls
  })
}))

const get = useServiceStore.getState;
const set = useServiceStore.setState;

class ServiceActions {

  // Actions
  // addService: (service: IService) => void;
  // removeService: (id: string) => void;
  // setActive: (id: string) => void;
  // initializeRecipe: (id: string) => void;
  // startPolling: (id: string) => void;
  // stopPolling: (id: string) => void;

  constructor() {
    this.serviceMaintenanceTick()
  }

  toggleMute(serviceId: string) {
    const service = this._one(serviceId);
    if (!service) return;
    this.updateService(service, 'isMuted', !service.isMuted)
    service.webview?.setAudioMuted(!service.isMuted)
  }
  setActive(id: string | null) {
    if (!id) {
      set(() => ({ activeServiceId: null }))
      return;
    }
    const activeServiceId = get().activeServiceId;
    set((state) => ({
      activeServiceId: id, serviceUsed: new Set(state.serviceUsed).add(id),
      services: state.services.
        map(service => service.serviceId === id ?
          { ...service, lastUsed: Date.now() } :
          service.serviceId === activeServiceId ?
            { ...service, lastUsed: Date.now() } :
            service)
    }));
  }

  _one(id: string): IService {
    return get().services.find(service => service.serviceId === id) as IService;
  }
  awake({ serviceId }: { serviceId: string }) {
    set((state) => ({ services: state.services.map(service => service.serviceId === serviceId ? { ...service, lastHibernated: null, isHibernating: false, lastUsed: Date.now() } : service) }))
  }
  canHibernate(service: IService) {
    return service?.isHibernateEnabled && !service?.isMediaPlaying
  }
  hibernate({ serviceId }: { serviceId: string }) {
    const service = this._one(serviceId);
    if (!this.canHibernate(service)) return;
    set((state) => ({ services: state.services.map(service => service.serviceId === serviceId ? { ...service, lastHibernated: Date.now(), isHibernating: true } : service) }))
  }

  teardown() {
    this.serviceMaintenanceTick.cancel()
  }

  _serviceMaintenanceTicker() {
    this._serviceMaintenance();
    this.serviceMaintenanceTick();
  }

  serviceMaintenanceTick = debounce(this._serviceMaintenanceTicker, ms('10s'))

  _serviceMaintenance() {
    for (const service of get().services) {
      if (service.serviceId !== get().activeServiceId) {
        if (
          !service.lastHibernated
          && Date.now() - service.lastUsed
          > ms('10s')
        ) {
          // If service is stale, hibernate it.
          this.hibernate({ serviceId: service.serviceId })
        }
      }
    }
  }

  // Fetch

  async fetchServices() {
    const services = await window.electron.ipcRenderer.invoke('db:getServices') as IService[]
    const mergedServices = mergeServiceData(services, get().services)
    const activeServiceId = get().activeServiceId ? get().activeServiceId : services?.[0]?.serviceId
    if (activeServiceId) {
      set((state) => ({ services: mergedServices, activeServiceId, serviceUsed: new Set(state.serviceUsed).add(activeServiceId) }))
    } else {
      set(() => ({ services: mergedServices, activeServiceId: null, serviceUsed: new Set() }))
    }
    return mergedServices
  }

  addService(_service: IService) {
    // set(state => {
    //   const services = new Map(state.services);
    //   services.set(service.id, service);
    //   return { services };
    // });
  }

  async removeService(serviceId: string) {
    const services = get().services.filter(service => service.serviceId !== serviceId)
    if (!services) return;
    const lastServiceUrls = { ...get().lastServiceUrls };
    delete lastServiceUrls[serviceId]
    await window.electron.ipcRenderer.invoke('db:deleteService', serviceId)
    if (get().activeServiceId === serviceId) {
      set(() => ({ activeServiceId: services[0]?.serviceId, lastServiceUrls }))
    }
    set(() => ({ services, lastServiceUrls }))
  }

  updateService<K extends keyof Services>(service: IService, key: K, value: Services[K]) {
    // TODO: 修改数据库
    window.electron.ipcRenderer.invoke('db:updateService', { ...omit(service, ...RUNTIME_STATE_KEYS, 'id'), [key]: value })
    set((state) => ({ services: state.services.map(s => s.serviceId === service.serviceId ? { ...s, [key]: value } : s) }))
  }
  updateRuntimeState<K extends keyof RuntimeState>(service: IService, key: K, value: RuntimeState[K]) {
    set((state) => ({ services: state.services.map(s => s.serviceId === service.serviceId ? { ...s, [key]: value } : s) }))
    if (key === 'webview') {
      setTimeout(() => this._initializeWebviewEvents(service, value as WebviewTag))
    }
  }

  _initializeWebviewEvents(_service: IService, webview: WebviewTag) {

    webview?.addEventListener('ipc-message', (e) => {
      switch (e.channel) {
        case 'webview-keydown':
          const key = parseInt(e.args[0])
          if (key > 0 && key <= 9 && key <= get().services.length) {
            this.setActive(get().services[key - 1].serviceId)
          }
          break;
      }
    })
  }

  updatelastServiceUrls(service: IService, url?: string) {
    if (!url) {
      set((state) => {
        const lastServiceUrls = state.lastServiceUrls
        delete lastServiceUrls[service.serviceId]
        return lastServiceUrls
      })
    } else {
      set((state) => ({ lastServiceUrls: { ...state.lastServiceUrls, [service.serviceId]: url } }))

    }
  }


  // initializeRecipe(id: string) {
  //   const service = get().services.get(id);
  //   if (service?.webview) {
  //     const shareWithWebview = cleanseJSObject(service.shareWithWebview);

  //     service.webview.send('initialize-recipe', {
  //       ...shareWithWebview,
  //       franzVersion: '1.1.1',
  //     }, service.recipe);
  //   }
  // }

  // startPolling(id: string) {
  //   const service = get().services.get(id);
  //   if (!service) return;

  //   if (service.timer !== null) {
  //     clearTimeout(service.timer);
  //   }

  //   const delay = ms('2s');
  //   const loop = () => {
  //     if (!service.webview) return;

  //     service.webview.send('poll');

  //     service.timer = setTimeout(loop, delay);
  //     service.lastPoll = Date.now();
  //   };

  //   loop();
  // }

  // stopPolling(id: string) {
  //   const service = get().services.get(id);
  //   if (service?.timer) {
  //     clearTimeout(service.timer);
  //     service.timer = null;
  //   }
  // }
}

export const serviceActions = new ServiceActions();


const getDefaultRuntimeState = (serviceId: string): RuntimeState => ({
  webview: null,
  timer: null,
  lastPoll: Date.now(),
  isMediaPlaying: false,
  isHibernating: false,
  isLoading: true,
  isError: false,
  lastHibernated: null,
  lastUsed: Date.now(),
  shareWithWebview: {
    id: serviceId,
    spellcheckerLanguage: '',
    isDarkModeEnabled: false
  }
})

export const mergeServiceData = (newServices: IService[], existingServices: IService[]): IService[] => {
  return newServices.map(newService => {
    const existingService = existingServices.find(s => s.serviceId === newService.serviceId)
    if (!existingService) {
      return {
        ...newService,
        ...getDefaultRuntimeState(newService.serviceId)
      }
    }

    return {
      ...newService,
      webview: existingService.webview,
      timer: existingService.timer,
      lastPoll: existingService.lastPoll,
      isMediaPlaying: existingService.isMediaPlaying,
      isHibernating: existingService.isHibernating,
      isLoading: existingService.isLoading,
      isError: existingService.isError,
      shareWithWebview: existingService.shareWithWebview
    }
  })
}
