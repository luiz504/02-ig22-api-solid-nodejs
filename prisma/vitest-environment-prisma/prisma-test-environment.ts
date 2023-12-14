import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

const prisma = new PrismaClient()
function generateDatabaseURL(schema: string) {
  let envURL = process.env.DATABASE_URL

  if (process.env.NODE_ENV === 'ci') {
    envURL = 'postgresql://docker:docker@localhost:5432/apisolid?schema=public'
  }

  if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'ci') {
    throw new Error('DATABASE_URL environment variable must be provided.')
  }

  const url = new URL(envURL || '')

  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()

    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
