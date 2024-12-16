import { useQuery } from "@tanstack/react-query"
import { serviceActions, useServiceStore } from "./store"

export const useAllServices = () => {

  const { isLoading, isError } = useQuery({
    queryKey: ['allServices'],
    queryFn: () => serviceActions.fetchAllServices(),
  })

  return {
    isLoading,
    isError,
    allServices: useServiceStore(state => state.allServices)
  }
}

