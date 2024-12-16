import { sql } from 'drizzle-orm'
import { db } from '~/db'
import { stores } from '~/db/schema'
import { Store } from '~/db/schema/types'
import { query } from '@solidjs/router'

export const getStores = query(async () => {
  'use server'
  try {
    // Add artificial delay of 5 seconds
    // await new Promise((resolve) => setTimeout(resolve, 5000))
    const result = await db.select().from(stores).orderBy(stores.createdAt)
    return result
  } catch (error) {
    console.error('Error fetching stores:', error)
    throw new Error('Failed to fetch stores')
  }
}, 'stores')

export const getStoreById = query(async (storeId: string) => {
  'use server'
  try {
    const [result] = await db
      .select()
      .from(stores)
      .where(sql`${stores.storeId} = ${storeId}`)
    return result as Store
  } catch (error) {
    console.error('Error fetching store:', error)
    throw new Error('Failed to fetch store')
  }
}, 'store')

export const getStoreByUserId = query(async (userId: string) => {
  'use server'
  try {
    const [result] = await db
      .select()
      .from(stores)
      .where(sql`${stores.userId} = ${userId}`)
    return result as Store
  } catch (error) {
    console.error('Error fetching store by user ID:', error)
    throw new Error('Failed to fetch store')
  }
}, 'store-by-user')
