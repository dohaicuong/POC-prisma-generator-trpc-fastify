import { EnvValue, generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger, parseEnvValue } from '@prisma/sdk'
import path from 'path'
import { configSchema } from './configSchema'
import { GENERATOR_NAME } from './constants'
// import { genEnum } from './helpers/genEnum'
import { writeFileSafely } from './utils/writeFileSafely'

const { version } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    const outputDir = parseEnvValue(options.generator.output as EnvValue);
    const results = configSchema.safeParse(options.generator.config)
    if (!results.success) throw new Error('Invalid options passed')
    const config = results.data
    logger.info(`${GENERATOR_NAME}:2`)
    
    logger.info({
      config: {
        outputDir,
        ...config
      }
    })

    const serverLocation = path.join(outputDir, `server.ts`)
    const server = `
    import fastify from 'fastify'
    import cors from '@fastify/cors'
    
    import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
    import { appRouter } from '${config.routerPath}'
    import { createContext } from '${config.contextPath}'
    
    export const server = fastify({ maxParamLength: 5000 })
      .register(cors)
      .register(fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: { router: appRouter, createContext },
      })
    `
    await writeFileSafely(serverLocation, server)

    const indexLocation = path.join(outputDir, `index.ts`)
    const index = `
    import { server } from './server'

    server
      .listen({ host: '0.0.0.0', port: 4000 })
      .then(url => console.log(\`Server started at \${url}\`))
      .catch(error => {
        server.log.error(error)
        process.exit(1)
      })
    `
    await writeFileSafely(indexLocation, index)
  },
})