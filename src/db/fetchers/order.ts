// ~/db/fetchers/order.ts
import { db } from '~/db'
import { eq, and, like, sql, desc } from 'drizzle-orm'
import { orders, type Order } from '~/db/schema'
import { getCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { getSession } from '~/db/actions/auth'
import { query } from '@solidjs/router'

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

// Add this to your existing order.ts fetcher file
export const getStoreOrders = query(async (storeId: string): Promise<Order[]> => {
  'use server'
  try {
    if (!storeId) {
      throw new Error('Store ID is required')
    }

    const ordersList = await db
      .select({
        orderId: orders.orderId,
        sessionId: orders.sessionId,
        userId: orders.userId,
        orderNumber: orders.orderNumber,
        items: orders.items,
        subtotal: orders.subtotal,
        shippingCost: orders.shippingCost,
        total: orders.total,
        orderStatus: orders.orderStatus,
        paymentStatus: orders.paymentStatus,
        paymentMethod: orders.paymentMethod,
        shippingAddress: orders.shippingAddress,
        storeSummaries: orders.storeSummaries,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        confirmedAt: orders.confirmedAt,
        processedAt: orders.processedAt,
        shippedAt: orders.shippedAt,
        deliveredAt: orders.deliveredAt,
        cancelledAt: orders.cancelledAt,
        refundedAt: orders.refundedAt,
      })
      .from(orders)
      .where(
        sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements(${orders.storeSummaries}) summary
          WHERE summary->>'storeId' = ${storeId}
        )`
      )
      .orderBy(desc(orders.createdAt))

    // Filter out invalid orders
    return ordersList.filter((order) => {
      if (!order?.orderNumber || !order?.items || !order?.shippingAddress) {
        console.warn('Found invalid order:', order?.orderId)
        return false
      }
      return true
    })
  } catch (error) {
    console.error('Error fetching store orders:', error)
    throw new Error('Failed to fetch store orders')
  }
}, 'storeOrders')
