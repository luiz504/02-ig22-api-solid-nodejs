import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '~/repositories/prisma/prisma-user-repository'
import { AuthenticateUseCase } from '~/use-cases/authenticate'
import { InvalidCredentialsError } from '~/use-cases/errors/invalid-credentials-error'
import { UserAlreadyExistsError } from '~/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '~/use-cases/register'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()

    const authenticateUseCase = new AuthenticateUseCase(usersRepository)
    await authenticateUseCase.execute({ email, password })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
