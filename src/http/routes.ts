import { FastifyInstance } from 'fastify'

import { profile, authenticate, register } from './controllers'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  //* * Authenticated */
  app.get('/me', profile)
}
