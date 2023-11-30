import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    console.log('Setup') //eslint-disable-line

    return {
      teardown() {
        console.log('Teardown') //eslint-disable-line
      },
    }
  },
}
