import fastify from 'fastify'

import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)
app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error) //eslint-disable-line 
  }

  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: `Validation error.`, issues: error.format() })
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal Server Error.' })
})
