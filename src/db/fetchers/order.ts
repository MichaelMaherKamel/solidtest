// ~/db/fetchers/order.ts
import { query } from '@solidjs/router'
import { eq, and, isNull, desc, sql, or, gte, lte } from 'drizzle-orm'
import { db } from '~/db'
import { orders, type Order } from '~/db/schema'
import { getCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { getSession } from '~/db/actions/auth'

const ORDER_COOKIE = 'order-session'

// Get a single order by ID with auth check
export const getOrder = query(async (orderId: string): Promise<Order | null> => {
  'use server'
  try {
    const session = await getSession()
    const event = getRequestEvent()!.nativeEvent
    const sessionId = getCookie(event, ORDER_COOKIE)

    if (!orderId) {
      return null
    }

    // Build query conditions based on auth status
    const conditions = session?.user?.id
      ? or(eq(orders.userId, session.user.id), eq(orders.sessionId, sessionId || ''))
      : eq(orders.sessionId, sessionId || '')

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.orderId, orderId), conditions))

    return order || null
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Failed to fetch order')
  }
}, 'order')

// Get order by order number (for tracking)
export const getOrderByNumber = query(async (orderNumber: string): Promise<Order | null> => {
  'use server'
  try {
    if (!orderNumber) {
      return null
    }

    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber.toUpperCase()))

    return order || null
  } catch (error) {
    console.error('Error fetching order by number:', error)
    throw new Error('Failed to fetch order by number')
  }
}, 'orderByNumber')

// Get user's orders (both authenticated and guest)
export const getUserOrders = query(
  async (
    params: {
      limit?: number
      offset?: number
      status?: Order['orderStatus']
      startDate?: Date
      endDate?: Date
    } = {}
  ): Promise<{ orders: Order[]; total: number }> => {
    'use server'
    try {
      const session = await getSession()
      const event = getRequestEvent()!.nativeEvent
      const sessionId = getCookie(event, ORDER_COOKIE)

      if (!session?.user?.id && !sessionId) {
        return { orders: [], total: 0 }
      }

      // Build query conditions
      const conditions = []

      // User/Session condition
      if (session?.user?.id) {
        conditions.push(or(eq(orders.userId, session.user.id), eq(orders.sessionId, sessionId || '')))
      } else {
        conditions.push(eq(orders.sessionId, sessionId || ''))
      }

      // Status condition
      if (params.status) {
        conditions.push(eq(orders.orderStatus, params.status))
      }

      // Date range conditions
      if (params.startDate) {
        conditions.push(gte(orders.createdAt, params.startDate))
      }
      if (params.endDate) {
        conditions.push(lte(orders.createdAt, params.endDate))
      }

      // Get total count
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(and(...conditions))

      // Get orders with pagination
      const ordersList = await db
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt))
        .limit(params.limit || 10)
        .offset(params.offset || 0)

      return {
        orders: ordersList,
        total: Number(count),
      }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      throw new Error('Failed to fetch user orders')
    }
  },
  'userOrders'
)

// Get store orders (for sellers)
export const getStoreOrders = query(
  async (
    storeId: string,
    params: {
      limit?: number
      offset?: number
      status?: Order['orderStatus']
      startDate?: Date
      endDate?: Date
    } = {}
  ): Promise<{ orders: Order[]; total: number }> => {
    'use server'
    try {
      const session = await getSession()

      if (!session?.user?.id) {
        throw new Error('Unauthorized')
      }

      const conditions = []

      // Filter orders containing items from this store
      conditions.push(sql`EXISTS (
      SELECT 1 FROM jsonb_array_elements(${orders.storeSummaries}) store
      WHERE store->>'storeId' = ${storeId}
    )`)

      // Status condition for the specific store
      if (params.status) {
        conditions.push(sql`EXISTS (
        SELECT 1 FROM jsonb_array_elements(${orders.storeSummaries}) store
        WHERE store->>'storeId' = ${storeId}
        AND store->>'status' = ${params.status}
      )`)
      }

      // Date range conditions
      if (params.startDate) {
        conditions.push(gte(orders.createdAt, params.startDate))
      }
      if (params.endDate) {
        conditions.push(lte(orders.createdAt, params.endDate))
      }

      // Get total count
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(and(...conditions))

      // Get orders with pagination
      const ordersList = await db
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt))
        .limit(params.limit || 10)
        .offset(params.offset || 0)

      return {
        orders: ordersList,
        total: Number(count),
      }
    } catch (error) {
      console.error('Error fetching store orders:', error)
      throw new Error('Failed to fetch store orders')
    }
  },
  'storeOrders'
)

// Get store order statistics

interface StoreOrderStats {
  totalOrders: number
  totalRevenue: number
  ordersByStatus: Record<Order['orderStatus'], number>
  dailyStats: Array<{
    date: string
    orderCount: number
    revenue: number
  }>
}

export const getStoreOrderStats = query(
  async (
    storeId: string,
    params: {
      startDate?: Date
      endDate?: Date
    } = {}
  ): Promise<StoreOrderStats> => {
    'use server'
    try {
      const session = await getSession()

      if (!session?.user?.id) {
        throw new Error('Unauthorized')
      }

      const conditions = [
        sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements(${orders.storeSummaries}) store
          WHERE store->>'storeId' = ${storeId}
        )`,
      ]

      if (params.startDate) {
        conditions.push(gte(orders.createdAt, params.startDate))
      }
      if (params.endDate) {
        conditions.push(lte(orders.createdAt, params.endDate))
      }

      // Get basic stats
      const [basicStats] = await db
        .select({
          totalOrders: sql<number>`COUNT(*)`,
          totalRevenue: sql<number>`
            SUM((
              SELECT (store->>'subtotal')::numeric
              FROM jsonb_array_elements(${orders.storeSummaries}) store
              WHERE store->>'storeId' = ${storeId}
            ))
          `,
        })
        .from(orders)
        .where(and(...conditions))

      // Get orders by status
      const statusStats = await db
        .select({
          status: sql<Order['orderStatus']>`
            (jsonb_array_elements(${orders.storeSummaries})->>'status')::text
          `,
          count: sql<number>`count(*)`,
        })
        .from(orders)
        .where(and(...conditions))
        .groupBy(sql`(jsonb_array_elements(${orders.storeSummaries})->>'status')::text`)

      // Get daily stats
      const dailyStats = await db
        .select({
          date: sql<string>`DATE(${orders.createdAt})::text`,
          orderCount: sql<number>`COUNT(*)`,
          revenue: sql<number>`
            SUM((
              SELECT (store->>'subtotal')::numeric
              FROM jsonb_array_elements(${orders.storeSummaries}) store
              WHERE store->>'storeId' = ${storeId}
            ))
          `,
        })
        .from(orders)
        .where(and(...conditions))
        .groupBy(sql`DATE(${orders.createdAt})`)
        .orderBy(sql`DATE(${orders.createdAt})`)

      // Initialize ordersByStatus with all possible statuses set to 0
      const ordersByStatus: Record<Order['orderStatus'], number> = {
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        refunded: 0,
      }

      // Update counts for statuses that have orders
      statusStats.forEach((stat) => {
        if (stat.status) {
          ordersByStatus[stat.status] = Number(stat.count)
        }
      })

      return {
        totalOrders: Number(basicStats.totalOrders),
        totalRevenue: Number(basicStats.totalRevenue) || 0,
        ordersByStatus,
        dailyStats: dailyStats.map((stat) => ({
          date: stat.date,
          orderCount: Number(stat.orderCount),
          revenue: Number(stat.revenue) || 0,
        })),
      }
    } catch (error) {
      console.error('Error fetching store order statistics:', error)
      throw new Error('Failed to fetch store order statistics')
    }
  },
  'storeOrderStats'
)
