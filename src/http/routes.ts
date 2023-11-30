import { FastifyInstance } from 'fastify'

import { profile, authenticate, register } from './controllers'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  //* * Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
