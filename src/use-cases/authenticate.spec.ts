import { describe, expect, it } from 'vitest'

import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  const mockedUserData = {
    name: 'John Doe',
    email: 'jdoe@example.com',
    password: '123456',
  }
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: mockedUserData.name,
      email: mockedUserData.email,
      password_hash: await hash(mockedUserData.password, 6),
    })

    const { user } = await sut.execute({
      email: mockedUserData.email,
      password: mockedUserData.password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await expect(() =>
      sut.execute({
        email: mockedUserData.email,
        password: mockedUserData.password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: mockedUserData.name,
      email: mockedUserData.email,
      password_hash: await hash(mockedUserData.password, 6),
    })

    await expect(() =>
      sut.execute({
        email: mockedUserData.email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
