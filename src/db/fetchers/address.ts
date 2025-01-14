// ~/db/fetchers/address.ts
import { query } from '@solidjs/router'
import { eq, and, isNull } from 'drizzle-orm'
import { db } from '~/db'
import { addresses, type Address } from '~/db/schema'
import { getCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { getSession } from '~/db/actions/auth'

const ADDRESS_COOKIE = 'address-session'

export const getAddress = query(async (): Promise<Address | null> => {
  'use server'
  try {
    const session = await getSession()

    if (session?.user?.id) {
      // For authenticated users, get address by userId
      const [address] = await db.select().from(addresses).where(eq(addresses.userId, session.user.id))
      return address || null
    }

    // For guests, get address by sessionId and ensure userId is null
    const event = getRequestEvent()!.nativeEvent
    const sessionId = getCookie(event, ADDRESS_COOKIE)

    if (!sessionId) {
      return null
    }

    const [address] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.sessionId, sessionId), isNull(addresses.userId)))

    return address || null
  } catch (error) {
    console.error('Error fetching address:', error)
    throw new Error('Failed to fetch address')
  }
}, 'address')
