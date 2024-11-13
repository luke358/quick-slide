import { serviceActions } from "@renderer/store/services/store"
import { useQuery } from "@tanstack/react-query"

export const servicesQuery = {
  services: () => {
    return useQuery({
      queryKey: ['services'],
      queryFn: () => serviceActions.fetchServices()
    })
  }
}
