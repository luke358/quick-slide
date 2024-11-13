import { Queries } from "@renderer/queries";
import { useServiceStore } from "./store";
import { useMemo } from "react";

export const useActiveServiceId = () => useServiceStore(state => state.activeServiceId)
export const useServicesData = () => {
  const { data, isLoading, error } = Queries.servicesQuery.services()
  return useMemo(() => ({
    services: data ?? [],
    isLoading,
    error
  }), [data, isLoading, error])
}

export const useServiceUsed = () => useServiceStore(state => state.serviceUsed)
