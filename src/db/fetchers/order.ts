// ~/db/fetchers/order.ts
import { db } from '~/db'
import { eq, and, like } from 'drizzle-orm'
import { orders, type Order } from '~/db/schema'
import { getCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { getSession } from '~/db/actions/auth'

const ORDER_COOKIE = 'order-session'

// Get the order identifier with proper error handling
async function getOrderIdentifier() {
  'use server'
  try {
    const session = await getSession()
    const event = getRequestEvent()?.nativeEvent

    if (!event) {
      throw new Error('Request event not found')
    }

    const sessionId = getCookie(event, ORDER_COOKIE)

    if (session?.user?.id) {
      return { type: 'user' as const, id: session.user.id }
    }

    if (!sessionId) {
      throw new Error('No session ID found')
    }

    return { type: 'guest' as const, id: sessionId }
  } catch (error) {
    console.error('Error getting order identifier:', error)
    throw new Error('Failed to get order identifier')
  }
}

// Fetch an order by ID with proper null checks
export async function getOrderById(orderId: string): Promise<Order | null> {
  'use server'
  try {
    if (!orderId) {
      throw new Error('Order ID is required')
    }

    const identifier = await getOrderIdentifier()

    const whereClause =
      identifier.type === 'user'
        ? and(eq(orders.userId, identifier.id), eq(orders.orderId, orderId))
        : and(eq(orders.sessionId, identifier.id), eq(orders.orderId, orderId))

    const [order] = await db.select().from(orders).where(whereClause).limit(1)

    if (!order?.orderNumber || !order?.items || !order?.shippingAddress) {
      return null
    }

    return order
  } catch (error) {
    console.error('Error fetching order by ID:', error)
    return null
  }
}

// Fetch an order by order number
export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  'use server'
  try {
    if (!orderNumber) {
      throw new Error('Order number is required')
    }

    const identifier = await getOrderIdentifier()

    const whereClause =
      identifier.type === 'user'
        ? and(eq(orders.userId, identifier.id), like(orders.orderNumber, `%${orderNumber}%`))
        : and(eq(orders.sessionId, identifier.id), like(orders.orderNumber, `%${orderNumber}%`))

    const [order] = await db.select().from(orders).where(whereClause).limit(1)

    if (!order?.orderNumber || !order?.items || !order?.shippingAddress) {
      return null
    }

    return order
  } catch (error) {
    console.error('Error fetching order by order number:', error)
    return null
  }
}

// Fetch orders list with proper error handling
export async function getOrders() {
  'use server'
  try {
    const identifier = await getOrderIdentifier()

    const whereClause =
      identifier.type === 'user' ? and(eq(orders.userId, identifier.id)) : and(eq(orders.sessionId, identifier.id))

    const ordersList = await db.select().from(orders).where(whereClause)

    return ordersList.filter((order) => order?.orderNumber && order?.items?.length > 0 && order?.shippingAddress)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
