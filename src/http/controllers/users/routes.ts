import { FastifyInstance } from 'fastify'

import { profile, authenticate, register } from '.'
import { verifyJWT } from '~/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  //* * Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
