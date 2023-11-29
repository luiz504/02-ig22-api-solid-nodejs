import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()
  const user = request.user
  console.log('user', user) //eslint-disable-line 
  return reply.status(200).send()
}
