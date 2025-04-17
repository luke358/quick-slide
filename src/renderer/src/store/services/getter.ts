import { useServiceStore } from "./store"

const get = useServiceStore.getState
export const getServices = () => {
  return get().services
}
