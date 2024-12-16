import { createZustandStore } from "../utils/helper"
import { ServiceState } from "./types"
import { produce } from 'immer'

const initialState = {
  allServices: [],
}

export const useServiceStore = createZustandStore<ServiceState>("service")(() => initialState)

const set = useServiceStore.setState
class ServiceActions {

  async fetchAllServices() {
    const services = await window.electron.ipcRenderer.invoke('db:fetchAllServices')
    set(state => produce(state, draft => {
      draft.allServices = services
    }))
    return services
  }
}

export const serviceActions = new ServiceActions()
