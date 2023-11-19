import { hash } from 'bcryptjs'
import { prisma } from '~/lib/prisma'

import { UsersRepository } from '~/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseDTO {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({ name, email, password }: RegisterUseCaseDTO) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    await this.usersRepository.create({ name, email, password_hash })
  }
}
