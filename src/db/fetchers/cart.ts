import { query } from '@solidjs/router'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { carts, type Cart } from '~/db/schema'
import { getCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'

type CartResponse = Cart | { items: never[] }

export const getCart = query(async (): Promise<CartResponse> => {
  'use server'
  try {
    const event = getRequestEvent()!.nativeEvent
    const sessionId = getCookie(event, 'cart-session')

    if (!sessionId) {
      return { items: [] } // Return empty cart if no session ID is found
    }

    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))
    return cart || { items: [] } // Return empty cart if no cart is found
  } catch (error) {
    console.error('Error fetching cart:', error)
    throw new Error('Failed to fetch cart')
  }
}, 'cart')

// Optional: Get multiple carts (for admin purposes)
export const getCarts = query(async (limit: number = 10, offset: number = 0) => {
  'use server'
  try {
    const result = await db
      .select({
        cartId: carts.cartId,
        sessionId: carts.sessionId,
        items: carts.items,
        createdAt: carts.createdAt,
        updatedAt: carts.updatedAt,
        lastActive: carts.lastActive,
      })
      .from(carts)
      .orderBy(carts.lastActive)
      .limit(limit)
      .offset(offset)

    return result
  } catch (error) {
    console.error('Error fetching carts:', error)
    throw new Error('Failed to fetch carts')
  }
}, 'carts')
