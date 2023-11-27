import { Gym, Prisma } from '@prisma/client'
export interface FindManyNearbyParams {
  longitude: number
  latitude: number
}
export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
  searchManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  findById(id: string): Promise<Gym | null>
}
