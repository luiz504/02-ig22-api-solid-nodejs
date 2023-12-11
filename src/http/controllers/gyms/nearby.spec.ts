import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '~/app'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

describe('Search nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to list nearby gyms', async () => {
    // Prepare
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'JavaScript Gym',
        description: 'Flex your brain with this.',
        phone: '62999999999',
        latitude: -16.645611303825483,
        longitude: -49.485043181845164,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Typescript Gym',
        description: 'Flex your brain with this.',
        phone: '62999999999',
        latitude: -16.686367573674858,
        longitude: -49.15481552288677,
      })

    // Act

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: -16.64753600805867, longitude: -49.4969813432063 })
      .set('Authorization', 'Bearer ' + token)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
    ])
  })
})
