import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'

import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  const mockedUserData = {
    name: 'John Doe',
    email: 'jdoe@example.com',
    password: '123456',
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('should be able to register', async () => {
    const { user } = await sut.execute({
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
    const { user } = await sut.execute({
      ...mockedUserData,
    })

    const isPasswordCorrectlyHashed = await compare(
      mockedUserData.password,
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      ...mockedUserData,
    })

    await expect(() => sut.execute(mockedUserData)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
