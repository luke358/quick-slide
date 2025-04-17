import { tipcClient } from "@renderer/lib/client"
import { queryClient } from "@renderer/lib/query-client"
import { getServices } from "@renderer/store/services/getter"
import { serviceActions } from "@renderer/store/services/store"
import { IService, Recipes } from "@shared/types"
import { useMutation, useQuery } from "@tanstack/react-query"

export const servicesQuery = {
  services: {
    queryKey: ['services'],
    queryFn: () => serviceActions.fetchServices()
  },
}

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => serviceActions.fetchServices()
  })
}

export const useAddServiceMutation = () => {
  return useMutation({
    mutationFn: async (recipe: Recipes) => {
      const result = await tipcClient?.addService(recipe)
      console.log('Add service', result)
      if (!result) {
        throw new Error('Failed to add service')
      }
      return result
    },
    onSuccess: (service) => {
      console.log('Service added', service)
      queryClient.invalidateQueries({ queryKey: ['services'] })
      service && serviceActions.setActive(service.serviceId)
    }
  })
}

export const useRemoveServiceMutation = () => {
  return useMutation({
    mutationFn: async (serviceId: string) => {
      await serviceActions.removeService(serviceId)
      return serviceId
    },
    onSuccess: (serviceId) => {
      console.log('Service removed', serviceId)
      const services = getServices()
      let index = services.findIndex(service => service.serviceId === serviceId)
      queryClient.invalidateQueries({ queryKey: ['services'] })
      index = Math.max(index - 1, 0)
      serviceActions.setActive(services[index]?.serviceId)
    }
  })
}

export const useUpdateSettingsMutation = () => {
  return useMutation({
    mutationFn: async ({ service, key, value }: {
      service: IService;
      key: keyof IService['settings'];
      value: IService['settings'][keyof IService['settings']];
    }) => {
      await serviceActions.updateSettings(service, key, value)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    }
  })
}
