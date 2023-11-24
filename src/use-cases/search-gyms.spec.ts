import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository'

import { SearchGymsUseCase } from './search-gyms'

let gymRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymRepository)
  })
  it('should be able to search for  gyms', async () => {
    await gymRepository.create({
      title: 'Javascript Gym',
      latitude: 0,
      longitude: 0,
    })

    await gymRepository.create({
      title: 'Typescript Gym',
      latitude: 20,
      longitude: 20,
    })

    const { gyms } = await sut.execute({
      query: 'Java',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })

  it('should be able to fetch paginated check-in history', async () => {
    const userId = 'user-01'

    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        id: `gym-${i}`,
        title: `Javascript Gym ${i}`,
        latitude: i,
        longitude: i,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ id: 'gym-21', title: 'Javascript Gym 21' }),
      expect.objectContaining({ id: 'gym-22', title: 'Javascript Gym 22' }),
    ])
  })
})
