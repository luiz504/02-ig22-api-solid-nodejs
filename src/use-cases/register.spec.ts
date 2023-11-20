import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'

import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  const mockedUserData = {
    name: 'John Doe',
    email: 'jdoe@example.com',
    password: '123456',
  }
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      ...mockedUserData,
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: mockedUserData.name,
        email: mockedUserData.email,
      }),
    )
  })
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      ...mockedUserData,
    })

    const isPasswordCorrectlyHashed = await compare(
      mockedUserData.password,
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({
      ...mockedUserData,
    })

    await expect(() =>
      registerUseCase.execute(mockedUserData),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
