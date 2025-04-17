import { useServiceStore } from "./store";

export const useActiveServiceId = () => useServiceStore(state => state.activeServiceId)
export const useActiveService = () => useServiceStore(state => state.services.find(item => item.serviceId === state.activeServiceId))
export const useServicesData = () => useServiceStore(state => state.services)

export const useServiceUsed = () => useServiceStore(state => state.serviceUsed)
export const useLastServiceUrls = () => useServiceStore(state => state.lastServiceUrls)
