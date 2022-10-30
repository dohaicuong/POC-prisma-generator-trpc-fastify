import { inferAsyncReturnType } from '@trpc/server'
import { PrismaClient } from '@prisma/client'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

const prisma = new PrismaClient()

export async function createContext ({}: CreateFastifyContextOptions) {
  return { prisma }
}

export type Context = inferAsyncReturnType<typeof createContext>
