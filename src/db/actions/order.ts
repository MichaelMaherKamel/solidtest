import { action } from '@solidjs/router'
import { eq, and } from 'drizzle-orm'
import { db } from '~/db'
import { orders, type Order, type NewOrder, type OrderItem } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'
import { getSession } from '~/db/actions/auth'

const ORDER_COOKIE = 'order-session'

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
