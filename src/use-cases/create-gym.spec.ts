import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  const mockedGymData = {
    title: 'Top Gym',
    description: null,
    phone: null,
    latitude: -16.6576901,
    longitude: -49.4899701,
  }

  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymRepository)
  })
  it('should be able to create a Gym', async () => {
    const { gym } = await sut.execute({
      ...mockedGymData,
    })

    expect(gym).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: mockedGymData.title,
        description: mockedGymData.description,
        phone: mockedGymData.phone,
      }),
    )
  })
})
