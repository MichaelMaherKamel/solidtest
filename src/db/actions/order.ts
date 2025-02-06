import { action } from '@solidjs/router'
import { eq, and } from 'drizzle-orm'
import { db } from '~/db'
import { orders, type Order, type NewOrder, OrderStatus } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'
import { getSession } from '~/db/actions/auth'
import { ShippingAddress } from '../schema/types'

const ORDER_COOKIE = 'order-session'

type StoreOrderUpdateResult = {
  success: boolean
  error?: string
  order?: Order
}

// Get the order identifier (userId or sessionId)
async function getOrderIdentifier(): Promise<{ type: 'user' | 'guest'; id: string; sessionId: string }> {
  'use server'
  try {
    const session = await getSession()
    const event = getRequestEvent()!.nativeEvent
    let sessionId = getCookie(event, ORDER_COOKIE)

    // Always generate a session ID if missing
    if (!sessionId) {
      sessionId = secure()
      setCookie(event, ORDER_COOKIE, sessionId, {
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
      })
    }

    if (session?.user?.id) {
      return { type: 'user', id: session.user.id, sessionId }
    }
    return { type: 'guest', id: sessionId, sessionId }
  } catch (error) {
    console.error('Error getting order identifier:', error)
    throw new Error('Failed to get order identifier')
  }
}

type OrderActionResult = { success: true; order: Order; orderId: string } | { success: false; error: string }

// Create a new order
export const createOrderAction = action(async (orderData: NewOrder): Promise<OrderActionResult> => {
  'use server'
  try {
    const identifier = await getOrderIdentifier()

    const newOrder: NewOrder = {
      sessionId: identifier.sessionId,
      userId: identifier.type === 'user' ? identifier.id : null,
      orderNumber: orderData.orderNumber,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      total: orderData.total,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      storeSummaries: orderData.storeSummaries,
    }

    const [createdOrder] = await db.insert(orders).values(newOrder).returning()

    return { success: true, order: createdOrder, orderId: createdOrder.orderId }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
})

// Update an existing order
export const updateOrderAction = action(
  async (orderId: string, updateData: Partial<Order>): Promise<OrderActionResult> => {
    'use server'
    try {
      const identifier = await getOrderIdentifier()

      const whereClause =
        identifier.type === 'user'
          ? and(eq(orders.userId, identifier.id), eq(orders.orderId, orderId))
          : and(eq(orders.sessionId, identifier.id), eq(orders.orderId, orderId))

      const [updatedOrder] = await db.update(orders).set(updateData).where(whereClause).returning()

      if (!updatedOrder) {
        return { success: false, error: 'Order not found' }
      }

      // Return the updated order along with the orderId
      return { success: true, order: updatedOrder, orderId: updatedOrder.orderId }
    } catch (error) {
      console.error('Error updating order:', error)
      return { success: false, error: 'Failed to update order' }
    }
  }
)

// Type guard for shipping address
export function isValidShippingAddress(address: unknown): address is ShippingAddress {
  if (!address || typeof address !== 'object') return false
  const addr = address as Record<string, unknown>
  return (
    typeof addr.name === 'string' &&
    typeof addr.email === 'string' &&
    typeof addr.phone === 'string' &&
    typeof addr.address === 'string'
  )
}

// Action to update order status for a specific store
export const updateStoreOrderAction = action(async (formData: FormData): Promise<StoreOrderUpdateResult> => {
  'use server'
  try {
    const orderId = formData.get('orderId')?.toString()
    const storeId = formData.get('storeId')?.toString()
    const newStatus = formData.get('orderStatus')?.toString() as OrderStatus

    if (!orderId || !storeId || !newStatus) {
      return { success: false, error: 'Missing required fields' }
    }

    // Find the order
    const [currentOrder] = await db.select().from(orders).where(eq(orders.orderId, orderId))

    if (!currentOrder) {
      return { success: false, error: 'Order not found' }
    }

    // Update the store's status in storeSummaries
    const updatedStoreSummaries = currentOrder.storeSummaries.map((summary) => {
      if (summary.storeId === storeId) {
        return { ...summary, status: newStatus }
      }
      return summary
    })

    // Update timestamps based on status
    const timestamps: Partial<Order> = {}
    switch (newStatus) {
      case 'confirmed':
        timestamps.confirmedAt = new Date()
        break
      case 'processing':
        timestamps.processedAt = new Date()
        break
      case 'shipped':
        timestamps.shippedAt = new Date()
        break
      case 'delivered':
        timestamps.deliveredAt = new Date()
        break
    }

    // Update the order
    const [updatedOrder] = await db
      .update(orders)
      .set({
        storeSummaries: updatedStoreSummaries,
        ...timestamps,
      })
      .where(eq(orders.orderId, orderId))
      .returning()

    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error('Error updating store order:', error)
    return { success: false, error: 'Failed to update order status' }
  }
})
