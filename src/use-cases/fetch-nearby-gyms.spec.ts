import { beforeEach, describe, expect, it } from 'vitest'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository

let sut: FetchNearbyGymsUseCase
describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby Gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -16.645611303825483,
      longitude: -49.485043181845164,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -16.686367573674858,
      longitude: -49.15481552288677,
    })

    const { gyms } = await sut.execute({
      userLatitude: -16.64753600805867,
      userLongitude: -49.4969813432063,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
