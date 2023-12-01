import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'

import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'

export const app = fastify()

app.register(fastifyJwt, { secret: env.JWT_SECRET })

// Routes
app.register(usersRoutes)
app.register(gymsRoutes)

// Error Handling
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
