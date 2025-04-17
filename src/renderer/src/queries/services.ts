import { tipcClient } from "@renderer/lib/client"
import { queryClient } from "@renderer/lib/query-client"
import { serviceActions } from "@renderer/store/services/store"
import { IService, Recipes } from "@shared/types"
import { useMutation, useQuery } from "@tanstack/react-query"

export const servicesQuery = {
  services: () => {
    return useQuery({
      queryKey: ['services'],
      queryFn: () => serviceActions.fetchServices()
    })
  },
  addService: () => {
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
  },
  removeService: () => {
    return useMutation({
      mutationFn: async (serviceId: string) => {
        await serviceActions.removeService(serviceId)
      },
      onSuccess: (serviceId) => {
        console.log('Service removed', serviceId)
        queryClient.invalidateQueries({ queryKey: ['services'] })
        serviceActions.setActive(null)
      }
    })
  },
  updateSettings: () => {
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
  // updateService: () => {
  //   return useMutation({
  //     mutationFn: async (service: IService, key, ) => {
  //       await serviceActions.updateService(service)
  //     },
  //     onSuccess: (service) => {
  //       console.log('Service updated', service)
  //       queryClient.invalidateQueries({ queryKey: ['services'] })
  //     }
  //   })
  // }
}

