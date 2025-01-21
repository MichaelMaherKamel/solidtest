// ~/db/actions/order.ts
import { action } from '@solidjs/router'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { orders, stores, type NewOrder, type Order, type OrderItem, type CartItem, products } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'
import { getSession } from '~/db/actions/auth'
import { clearCart } from '~/db/actions/cart'
import { getCart } from '~/db/fetchers/cart'
import { getAddress } from '~/db/fetchers/address'

const ORDER_COOKIE = 'order-session'

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 180, // 180 days - longer retention for order tracking
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax' as const,
}

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
      setCookie(event, ORDER_COOKIE, sessionId, COOKIE_OPTIONS)
    }

    return { type: 'guest', id: sessionId }
  } catch (error) {
    console.error('Error getting order identifier:', error)
    throw new Error('Failed to get order identifier')
  }
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `ORD-${timestamp}-${randomStr}`.toUpperCase()
}

// Transform CartItem to OrderItem
async function transformCartItemsToOrderItems(cartItems: CartItem[]): Promise<OrderItem[]> {
  const orderItems: OrderItem[] = []

  for (const item of cartItems) {
    // Get store information for the product
    const [store] = await db
      .select({
        storeId: stores.storeId,
        storeName: stores.storeName,
      })
      .from(stores)
      .innerJoin(products, eq(products.storeId, stores.storeId))
      .where(eq(products.productId, item.productId))

    if (store) {
      orderItems.push({
        ...item,
        storeId: store.storeId,
        storeName: store.storeName,
        color: 'default', // You might want to adjust this based on your needs
      })
    }
  }

  return orderItems
}

// Calculate store summaries from order items
function calculateStoreSummaries(items: OrderItem[]) {
  const storeMap = new Map()

  items.forEach((item) => {
    if (!storeMap.has(item.storeId)) {
      storeMap.set(item.storeId, {
        storeId: item.storeId,
        storeName: item.storeName,
        itemCount: 0,
        subtotal: 0,
        status: 'pending',
      })
    }

    const storeSummary = storeMap.get(item.storeId)
    storeSummary.itemCount += item.quantity
    storeSummary.subtotal += item.price * item.quantity
  })

  return Array.from(storeMap.values())
}

type OrderActionResult = { success: true; order: Order } | { success: false; error: string }

export const createOrderAction = action(async (formData: FormData): Promise<OrderActionResult> => {
  'use server'
  try {
    const identifier = await getOrderIdentifier()
    const cart = await getCart()
    const address = await getAddress()

    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    if (!address) {
      return { success: false, error: 'Shipping address is required' }
    }

    // Transform cart items to order items
    const orderItems = await transformCartItemsToOrderItems(cart.items)

    const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shippingCost = 50 // Replace with actual shipping calculation based on your logic
    const total = subtotal + shippingCost

    const newOrder: NewOrder = {
      sessionId: identifier.type === 'guest' ? identifier.id : '',
      userId: identifier.type === 'user' ? identifier.id : null,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      subtotal,
      shippingCost,
      total,
      shippingAddress: address,
      storeSummaries: calculateStoreSummaries(orderItems),
    }

    const [createdOrder] = await db.insert(orders).values(newOrder).returning()

    // Clear the cart after successful order creation
    await clearCart()

    return { success: true, order: createdOrder }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
})

export const updateOrderStatusAction = action(async (formData: FormData): Promise<OrderActionResult> => {
  'use server'
  try {
    const orderId = formData.get('orderId')?.toString()
    const storeId = formData.get('storeId')?.toString()
    const newStatus = formData.get('status')?.toString() as Order['orderStatus']

    if (!orderId || !storeId || !newStatus) {
      return { success: false, error: 'Missing required fields' }
    }

    const [existingOrder] = await db.select().from(orders).where(eq(orders.orderId, orderId))

    if (!existingOrder) {
      return { success: false, error: 'Order not found' }
    }

    // Update store status in storeSummaries
    const updatedStoreSummaries = existingOrder.storeSummaries.map((store) =>
      store.storeId === storeId ? { ...store, status: newStatus } : store
    )

    // Determine overall order status based on store statuses
    const allStoresCompleted = updatedStoreSummaries.every((store) =>
      ['delivered', 'cancelled', 'refunded'].includes(store.status)
    )

    const statusTimestamp = new Date()

    // Create status update object with proper type handling
    const statusUpdate: Partial<Order> = {
      storeSummaries: updatedStoreSummaries,
      orderStatus: allStoresCompleted ? 'delivered' : existingOrder.orderStatus,
    }

    // Add timestamp based on status
    switch (newStatus) {
      case 'confirmed':
        statusUpdate.confirmedAt = statusTimestamp
        break
      case 'processing':
        statusUpdate.processedAt = statusTimestamp
        break
      case 'shipped':
        statusUpdate.shippedAt = statusTimestamp
        break
      case 'delivered':
        statusUpdate.deliveredAt = statusTimestamp
        break
      case 'cancelled':
        statusUpdate.cancelledAt = statusTimestamp
        break
      case 'refunded':
        statusUpdate.refundedAt = statusTimestamp
        break
    }

    const [updatedOrder] = await db.update(orders).set(statusUpdate).where(eq(orders.orderId, orderId)).returning()

    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Failed to update order status' }
  }
})

export const updatePaymentStatusAction = action(async (formData: FormData): Promise<OrderActionResult> => {
  'use server'
  try {
    const orderId = formData.get('orderId')?.toString()
    const newPaymentStatus = formData.get('paymentStatus')?.toString() as Order['paymentStatus']
    const paymentMethod = formData.get('paymentMethod')?.toString() as Order['paymentMethod']

    if (!orderId || !newPaymentStatus) {
      return { success: false, error: 'Missing required fields' }
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({
        paymentStatus: newPaymentStatus,
        paymentMethod: paymentMethod || 'cash',
      })
      .where(eq(orders.orderId, orderId))
      .returning()

    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return { success: false, error: 'Failed to update payment status' }
  }
})
