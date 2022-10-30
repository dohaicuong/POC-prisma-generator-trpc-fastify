import * as z from 'zod'

export const configSchema = z.object({
  routerPath: z.string().default('../trpc/routers'),
  contextPath: z.string().default('../trpc_context'),
})
