import fastify from 'fastify'
import cors from '@fastify/cors'

import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter } from '../trpc/routers'
import { createContext } from '../trpc_context'

export const server = fastify({ maxParamLength: 5000 })
  .register(cors)
  .register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  })
