import { createZustandStore } from "../utils/helper";
import ms from "ms";
import { persist } from 'zustand/middleware'
import { debounce, omit } from "lodash-es";
import { WebviewTag } from "electron";
import { Services } from "@prisma/client";
import { tipcClient } from "@renderer/lib/client";
import { IService, Recipes, RUNTIME_STATE_KEYS, RuntimeState, ServiceState } from "@shared/types";
import { recipeActions } from "../recipe/store";
import { queryClient } from "@renderer/lib/query-client";
import { produce } from "immer";

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
    return service?.settings.isHibernateEnabled && !service?.isMediaPlaying
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
    const recipes = await queryClient.fetchQuery({ queryKey: ['recipes'], queryFn: recipeActions.fetchRecipes })
    const services = await tipcClient?.getServices() || []
    const mergedServices = mergeServiceData(services, get().services, recipes)
    console.log(mergedServices, 'mergedServices')

    const activeServiceId = get().activeServiceId ? get().activeServiceId : services?.[0]?.serviceId
    if (activeServiceId) {
      set((state) => ({ services: mergedServices, activeServiceId, serviceUsed: new Set(state.serviceUsed).add(activeServiceId) }))
    } else {
      set(() => ({ services: mergedServices, activeServiceId: null, serviceUsed: new Set() }))
    }
    return mergedServices
  }

  async removeService(serviceId: string) {
    const services = get().services.filter(service => service.serviceId !== serviceId)
    if (!services) return;

    await tipcClient?.deleteService(serviceId)

    set(produce((state) => {
      delete state.lastServiceUrls[serviceId]
      state.services = services

      if (state.activeServiceId === serviceId) {
        state.activeServiceId = services[0]?.serviceId
      }
    }))
  }

  async updateSettings<K extends keyof IService['settings']>(service: IService, key: K, value: IService['settings'][K]) {
    const settingData: IService['settings'] = {
      ...service.settings,
      [key]: value
    }
    await tipcClient?.updateService({ ...omit(service, RUNTIME_STATE_KEYS), settings: JSON.stringify(settingData) })

    if (key === 'isMuted') {
      service.webview?.setAudioMuted(value)
    }
  }

  // async updateService<K extends keyof Services>(service: IService, key: K, value: Services[K]) {
  //   const serviceData: Services = {
  //     ...omit(service, ...RUNTIME_STATE_KEYS),
  //     [key]: value
  //   }
  //   await tipcClient?.updateService(serviceData)
  //   set((state) => ({ services: state.services.map(s => s.serviceId === service.serviceId ? { ...s, [key]: value } : s) }))
  // }
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
        case 'hello':
          break;
      }
    })
  }

  updateLastServiceUrls(service: IService, url?: string) {
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

const emptyRecipe: Recipes = {
  recipeId: '',
  name: '',
  icon: '',
  category: [],
  version: '',
  serviceUrl: '',
}

export const mergeServiceData = (newServices: Services[], existingServices: IService[], recipes?: Recipes[]): IService[] => {
  return newServices.map(newService => {
    const existingService = existingServices.find(s => s.serviceId === newService.serviceId)
    const recipe = recipes?.find(r => r.recipeId === newService.recipeId)
    console.log(newService.settings)
    if (!existingService) {
      return {
        ...newService,
        settings: JSON.parse(newService.settings) as IService['settings'],
        ...getDefaultRuntimeState(newService.serviceId),
        recipe: recipe || emptyRecipe,
      }
    }

    return {
      ...newService,
      settings: JSON.parse(newService.settings),
      recipe: recipe || emptyRecipe,
      webview: existingService.webview,
      timer: existingService.timer,
      lastPoll: existingService.lastPoll,
      isMediaPlaying: existingService.isMediaPlaying,
      isHibernating: existingService.isHibernating,
      isLoading: existingService.isLoading,
      isError: existingService.isError,
      lastHibernated: existingService.lastHibernated,
      lastUsed: existingService.lastUsed,
      shareWithWebview: existingService.shareWithWebview
    }
  })
}
