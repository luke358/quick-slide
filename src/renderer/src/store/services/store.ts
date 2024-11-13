// import { cleanseJSObject } from "@renderer/lib/jsUtils";
import { Services } from "@prisma/client";
import { createZustandStore } from "../utils/helper";
import { ElectronWebView, IService, RUNTIME_STATE_KEYS, RuntimeState, ServiceState } from "./types";
// import ms from 'ms';

export const useServiceStore = createZustandStore<ServiceState>("service")(() => ({
  active: 'Twitter',
  services: [],
  serviceUsed: new Set<string>(),
  activeServiceId: null,
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


  setActive(id: string) {
    set((state) => ({ activeServiceId: id, serviceUsed: new Set(state.serviceUsed).add(id) }));
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

  addService(service: IService) {
    // set(state => {
    //   const services = new Map(state.services);
    //   services.set(service.id, service);
    //   return { services };
    // });
  }

  removeService(id: string) {
    // set(state => {
    //   const services = new Map(state.services);
    //   services.delete(id);
    //   return { services };
    // });
  }

  updateService<K extends keyof Services>(service: IService, key: K, value: Services[K]) {
    // TODO: 修改数据库

    set((state) => ({ services: state.services.map(s => s.serviceId === service.serviceId ? { ...s, [key]: value } : s) }))
  }
  updateRuntimeState<K extends keyof RuntimeState>(service: IService, key: K, value: RuntimeState[K]) {
    set((state) => ({ services: state.services.map(s => s.serviceId === service.serviceId ? { ...s, [key]: value } : s) }))
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
  lastPoll: 0,
  isMediaPlaying: false,
  isHibernating: false,
  isLoading: true,
  isError: false,
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
