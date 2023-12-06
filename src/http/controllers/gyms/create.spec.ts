import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '~/app'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a gym', async () => {
    // Prepare
    const { token } = await createAndAuthenticateUser(app)

    // Act

    const mockedGymData = {
      title: 'Javascript Gym',
      description: 'Flex your brain with this.',
      phone: '62999999999',
      latitude: -16.6576901,
      longitude: -49.4899701,
    }

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', 'Bearer ' + token)
      .send({
        ...mockedGymData,
      })

    expect(response.statusCode).toEqual(201)
  })
})
