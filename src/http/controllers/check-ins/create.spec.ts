import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '~/app'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'
import { prisma } from '~/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a check-in', async () => {
    // Prepare
    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -16.6576901,
        longitude: -49.4899701,
      },
    })
    const { token } = await createAndAuthenticateUser(app)

    // Act
    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        latitude: -16.6576901,
        longitude: -49.4899701,
      })

    expect(response.statusCode).toEqual(201)
  })
})
