import { Recipes, Prisma } from '@prisma/client';
import { t } from './_instance';
import { prisma } from '../db/_instance';
import { v4 as uuidv4 } from 'uuid'

export const serviceRouter = {
  addService: t.procedure.input<Recipes>().action(async ({ input }) => {
    const { name, serviceUrl } = input
    const service: Prisma.ServicesCreateInput = {
      name,
      serviceId: uuidv4(),
      serviceUrl,
      settings: '{}',
      recipe: {
        connect: {
          id: input.id
        }
      }
    }
    const result = await prisma.services.create({
      data: service
    })
    return result
  })
}

