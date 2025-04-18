import { omit } from 'lodash-es';
import { Prisma, Services } from '@prisma/client';
import { t } from './_instance';
import { prisma } from '../db/_instance';
import { v4 as uuidv4 } from 'uuid'
import { Recipes } from '../../shared/types';


export const serviceRoute = {
  addService: t.procedure.input<Recipes>().action(async ({ input }) => {
    const { name, serviceUrl } = input
    const service: Prisma.ServicesCreateInput = {
      name,
      serviceId: uuidv4(),
      serviceUrl,
      recipeId: input.recipeId,
      version: input.version,
    }
    const result = await prisma.services.create({
      data: service
    })
    return result
  }),
  getServices: t.procedure.action(async () => {
    const services = await prisma.services.findMany()
    return services
  }),
  updateService: t.procedure.input<Services>().action(async ({ input }) => {
    return await prisma.services.update({
      where: { serviceId: input.serviceId },
      data: omit(input, ['recipe', 'id'])
    })
  }),
  deleteService: t.procedure.input<string>().action(async ({ input }) => {
    return await prisma.services.delete({
      where: { serviceId: input }
    })
  })
}

