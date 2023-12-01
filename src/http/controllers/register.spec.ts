import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '~/app'
import { env } from '~/env'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to register', async () => {
    console.log('d', process.env.DATABASE_URL)
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
