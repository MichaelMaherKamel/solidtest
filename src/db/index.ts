// ~/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '~/config/env'

// The connection string is now guaranteed to be valid by our env validation
const client = postgres(env.DATABASE_URL)

export const db = drizzle(client, { schema })
