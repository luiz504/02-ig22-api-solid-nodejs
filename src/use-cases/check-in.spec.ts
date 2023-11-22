import { beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { afterEach } from 'node:test'

import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Neo Gym',
      description: null,
      phone: null,
      latitude: -16.6576901,
      longitude: -49.4899701,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mockedCheckInData = {
    gymId: 'gym-01',
    userId: 'user-01',
    userLatitude: -16.6576901,
    userLongitude: -49.4899701,
  }

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      ...mockedCheckInData,
    })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.gym_id).toBe('gym-01')
    expect(checkIn.user_id).toBe('user-01')
  })

  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 10, 21, 8, 0, 0))

    await sut.execute({
      ...mockedCheckInData,
    })

    await expect(() =>
      sut.execute({
        ...mockedCheckInData,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 10, 21, 8, 0, 0))

    await sut.execute({
      ...mockedCheckInData,
    })

    vi.setSystemTime(new Date(2023, 10, 23, 8, 0, 0))

    const { checkIn } = await sut.execute({
      ...mockedCheckInData,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it("should be able to check-in if the gym does't exists", async () => {
    await expect(() =>
      sut.execute({
        ...mockedCheckInData,
        gymId: 'gym-nonexistent',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to check-in on a distant gym', async () => {
    // Prepare
    gymsRepository.items.push({
      id: 'gym-02',
      description: '',
      latitude: new Decimal(-16.6450338),
      longitude: new Decimal(-49.4814243),
      phone: '',
      title: 'Neo Gym',
    })

    // Act
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -16.6576901,
        userLongitude: -49.4899701,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
