import { useServiceStore } from "./store";

export const useActiveServiceId = () => useServiceStore(state => state.activeServiceId)
export const useServicesData = () => useServiceStore(state => state.services)

export const useServiceUsed = () => useServiceStore(state => state.serviceUsed)
export const uselastServiceUrls = () => useServiceStore(state => state.lastServiceUrls)
