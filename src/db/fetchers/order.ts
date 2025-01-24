import { db } from '~/db'
import { eq, and, isNull } from 'drizzle-orm'
import { orders, type Order, type OrderItem } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'
import { getSession } from '~/db/actions/auth'

const ORDER_COOKIE = 'order-session'

// Get the order identifier (userId or sessionId)
async function getOrderIdentifier(): Promise<{ type: 'user' | 'guest'; id: string }> {
  'use server'
  try {
    const session = await getSession()

    if (session?.user?.id) {
      return { type: 'user', id: session.user.id }
    }

    const event = getRequestEvent()!.nativeEvent
    let sessionId = getCookie(event, ORDER_COOKIE)

    if (!sessionId) {
      sessionId = secure()
      setCookie(event, ORDER_COOKIE, sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: true, // Ensure this is set dynamically in production
        path: '/',
        sameSite: 'lax',
      })
    }

    return { type: 'guest', id: sessionId }
  } catch (error) {
    console.error('Error getting order identifier:', error)
    throw new Error('Failed to get order identifier')
  }
}

// Fetch orders for the current user (authenticated or guest)
export async function getOrders() {
  'use server'
  try {
    const identifier = await getOrderIdentifier()

    const whereClause =
      identifier.type === 'user'
        ? and(eq(orders.userId, identifier.id), isNull(orders.sessionId))
        : and(eq(orders.sessionId, identifier.id), isNull(orders.userId))

    const ordersList = await db.select().from(orders).where(whereClause)

    return ordersList
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

// Fetch an order by ID (for both authenticated and guest users)
export async function getOrderById(orderId: string) {
  'use server'
  try {
    const identifier = await getOrderIdentifier()

    const whereClause =
      identifier.type === 'user'
        ? and(eq(orders.userId, identifier.id), eq(orders.orderId, orderId))
        : and(eq(orders.sessionId, identifier.id), eq(orders.orderId, orderId))

    const [order] = await db.select().from(orders).where(whereClause).limit(1)

    return order || null
  } catch (error) {
    console.error('Error fetching order by ID:', error)
    return null
  }
}

// Fetch orders for a specific store (used by store owners)
export async function getStoreOrders(storeId: string) {
  'use server'
  try {
    // Fetch all orders
    const allOrders = await db.select().from(orders)

    // Filter orders to include only those with items from the specified store
    const storeOrders = allOrders.filter((order) => {
      return order.items.some((item: OrderItem) => item.storeId === storeId)
    })

    return storeOrders
  } catch (error) {
    console.error('Error fetching store orders:', error)
    return []
  }
}
