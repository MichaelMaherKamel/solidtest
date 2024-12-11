import { query } from '@solidjs/router'
import { db } from '~/db'
import { users } from '~/db/schema'
import { desc, eq } from 'drizzle-orm'

export const getUsers = query(async () => {
  'use server'
  try {
    const result = await db.select().from(users).orderBy(desc(users.emailVerified))
    return result
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}, 'users')

export const getUserById = query(async (userId: string) => {
  'use server'
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId))

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Failed to fetch user')
  }
}, 'user')
