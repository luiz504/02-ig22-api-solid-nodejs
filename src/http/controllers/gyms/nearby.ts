import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymInUseCase } from '~/use-cases/factories/make-fetch-nearby-gym-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine(
      (value) => {
        return Math.abs(value) <= 90
      },
      { message: 'Invalid latitude value.' },
    ),
    longitude: z.coerce.number().refine(
      (value) => {
        return Math.abs(value) <= 180
      },
      { message: 'Invalid longitude value.' },
    ),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const fetchNearbyGymUseCase = makeFetchNearbyGymInUseCase()
  const { gyms } = await fetchNearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
