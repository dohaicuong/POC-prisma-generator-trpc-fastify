import { server } from './server'

server
  .listen({ host: '0.0.0.0', port: 4000 })
  .then((url) => console.log(`Server started at ${url}`))
  .catch((error) => {
    server.log.error(error)
    process.exit(1)
  })
