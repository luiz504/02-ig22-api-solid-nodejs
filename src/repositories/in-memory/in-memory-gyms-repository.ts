import { Gym, Prisma } from '@prisma/client'

import { GymsRepository } from '../gym-repository'
import { randomUUID } from 'crypto'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const user: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(user)
    return user
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    return gym || null
  }
}
