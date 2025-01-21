// // ~/db/fetchers/order-admin.ts
// import { query } from '@solidjs/router'
// import { eq, and, desc, sql, or, gte, lte } from 'drizzle-orm'
// import { db } from '~/db'
// import { orders, stores, users, type Order } from '~/db/schema'
// import { getSession } from '~/db/actions/auth'

// // Types for analytics
// interface AnalyticsPeriod {
//   startDate?: Date
//   endDate?: Date
// }

// interface AdminOrderStats extends AnalyticsPeriod {
//   totalOrders: number
//   totalRevenue: number
//   averageOrderValue: number
//   totalCustomers: number
//   ordersByStatus: Record<Order['orderStatus'], number>
//   ordersByPaymentMethod: Record<Order['paymentMethod'], number>
//   dailyRevenue: Array<{
//     date: string
//     orders: number
//     revenue: number
//     averageOrder: number
//   }>
//   topSellingStores: Array<{
//     storeId: string
//     storeName: string
//     orders: number
//     revenue: number
//   }>
// }

// interface StorePerformance {
//   storeId: string
//   storeName: string
//   storeOwner: string
//   totalOrders: number
//   totalRevenue: number
//   averageOrderValue: number
//   ordersByStatus: Record<Order['orderStatus'], number>
// }

// // Admin: Get all orders with comprehensive filtering
// export const getAllOrders = query(async (params: {
//   limit?: number
//   offset?: number
//   status?: Order['orderStatus']
//   paymentStatus?: Order['paymentStatus']
//   startDate?: Date
//   endDate?: Date
//   storeId?: string
//   userId?: string
//   minAmount?: number
//   maxAmount?: number
//   sortBy?: 'date' | 'amount' | 'status'
//   sortOrder?: 'asc' | 'desc'
// } = {}): Promise<{ orders: Order[]; total: number }> => {
//   'use server'
//   try {
//     const session = await getSession()
    
//     if (!session?.user?.id || session.user.role !== 'admin') {
//       throw new Error('Unauthorized: Admin access required')
//     }

//     const conditions = []
    
//     // Apply filters
//     if (params.status) {
//       conditions.push(eq(orders.orderStatus, params.status))
//     }
//     if (params.paymentStatus) {
//       conditions.push(eq(orders.paymentStatus, params.paymentStatus))
//     }
//     if (params.startDate) {
//       conditions.push(gte(orders.createdAt, params.startDate))
//     }
//     if (params.endDate) {
//       conditions.push(lte(orders.createdAt, params.endDate))
//     }
//     if (params.minAmount) {
//       conditions.push(gte(orders.total, params.minAmount))
//     }
//     if (params.maxAmount) {
//       conditions.push(lte(orders.total, params.maxAmount))
//     }
//     if (params.userId) {
//       conditions.push(eq(orders.userId, params.userId))
//     }
//     if (params.storeId) {
//       conditions.push(sql`EXISTS (
//         SELECT 1 FROM jsonb_array_elements(${orders.storeSummaries}) store
//         WHERE store->>'storeId' = ${params.storeId}
//       )`)
//     }

//     // Get total count
//     const [{ count }] = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(orders)
//       .where(and(...conditions))

//     // Determine sort column and order
//     const sortColumn = params.sortBy === 'amount' 
//       ? orders.total 
//       : params.sortBy === 'status' 
//         ? orders.orderStatus 
//         : orders.createdAt

//     const sortDirection = params.sortOrder === 'asc' ? 'asc' : 'desc'

//     // Get orders with pagination and sorting
//     const ordersList = await db
//       .select()
//       .from(orders)
//       .where(and(...conditions))
//       .orderBy(sortColumn, sortDirection)
//       .limit(params.limit || 10)
//       .offset(params.offset || 0)

//     return {
//       orders: ordersList,
//       total: Number(count),
//     }
//   } catch (error) {
//     console.error('Error fetching all orders:', error)
//     throw new Error('Failed to fetch orders')
//   }
// }, 'allOrders')

// // Admin: Get comprehensive order statistics
// export const getAdminOrderStats = query(async (params: AnalyticsPeriod = {}): Promise<AdminOrderStats> => {
//   'use server'
//   try {
//     const session = await getSession()
    
//     if (!session?.user?.id || session.user.role !== 'admin') {
//       throw new Error('Unauthorized: Admin access required')
//     }

//     const conditions = []
    
//     if (params.startDate) {
//       conditions.push(gte(orders.createdAt, params.startDate))
//     }
//     if (params.endDate) {
//       conditions.push(lte(orders.createdAt, params.endDate))
//     }

//     // Get basic statistics
//     const [basicStats] = await db
//       .select({
//         totalOrders: sql<number>`COUNT(*)`,
//         totalRevenue: sql<number>`SUM(${orders.total})`,
//         averageOrderValue: sql<number>`AVG(${orders.total})`,
//         totalCustomers: sql<number>`COUNT(DISTINCT COALESCE(${orders.userId}, ${orders.sessionId}))`,
//       })
//       .from(orders)
//       .where(and(...conditions))

//     // Get orders by status
//     const statusStats = await db
//       .select({
//         status: orders.orderStatus,
//         count: sql<number>`COUNT(*)`,
//       })
//       .from(orders)
//       .where(and(...conditions))
//       .groupBy(orders.orderStatus)

//     // Get orders by payment method
//     const paymentStats = await db
//       .select({
//         method: orders.paymentMethod,
//         count: sql<number>`COUNT(*)`,
//       })
//       .from(orders)
//       .where(and(...conditions))
//       .groupBy(orders.paymentMethod)

//     // Get daily revenue statistics
//     const dailyStats = await db
//       .select({
//         date: sql<string>`DATE(${orders.createdAt})::text`,
//         orders: sql<number>`COUNT(*)`,
//         revenue: sql<number>`SUM(${orders.total})`,
//         averageOrder: sql<number>`AVG(${orders.total})`,
//       })
//       .from(orders)
//       .where(and(...conditions))
//       .groupBy(sql`DATE(${orders.createdAt})`)
//       .orderBy(sql`DATE(${orders.createdAt})`)

//     // Get top selling stores
//     const topStores = await db
//       .select({
//         storeId: sql<string>`store->>'storeId'`,
//         storeName: sql<string>`store->>'storeName'`,
//         orders: sql<number>`COUNT(*)`,
//         revenue: sql<number>`SUM((store->>'subtotal')::numeric)`,
//       })
//       .from(orders)
//       .leftJoin(sql`jsonb_array_elements(${orders.storeSummaries}) store`)
//       .where(and(...conditions))
//       .groupBy(sql`store->>'storeId'`, sql`store->>'storeName'`)
//       .orderBy(sql`SUM((store->>'subtotal')::numeric)`, 'desc')
//       .limit(10)

//     return {
//       startDate: params.startDate,
//       endDate: params.endDate,
//       totalOrders: Number(basicStats.totalOrders),
//       totalRevenue: Number(basicStats.totalRevenue) || 0,
//       averageOrderValue: Number(basicStats.averageOrderValue) || 0,
//       totalCustomers: Number(basicStats.totalCustomers),
//       ordersByStatus: Object.fromEntries(
//         statusStats.map(stat => [stat.status, Number(stat.count)])
//       ),
//       ordersByPaymentMethod: Object.fromEntries(
//         paymentStats.map(stat => [stat.method, Number(stat.count)])
//       ),
//       dailyRevenue: dailyStats.map(stat => ({
//         date: stat.date,
//         orders: Number(stat.orders),
//         revenue: Number(stat.revenue) || 0,
//         averageOrder: Number(stat.averageOrder) || 0
//       })),
//       topSellingStores: topStores.map(store => ({
//         storeId: store.storeId,
//         storeName: store.storeName,
//         orders: Number(store.orders),
//         revenue: Number(store.revenue) || 0
//       }))
//     }
//   } catch (error) {
//     console.error('Error fetching admin order statistics:', error)
//     throw new Error('Failed to fetch order statistics')
//   }
// }, 'adminOrderStats')

// // Admin: Get store performance metrics
// export const getStorePerformanceStats = query(async (params: AnalyticsPeriod = {}): Promise<StorePerformance[]> => {
//   'use server'
//   try {
//     const session = await getSession()
    
//     if (!session?.user?.id || session.user.role !== 'admin') {
//       throw new Error('Unauthorized: Admin access required')
//     }

//     const conditions = []
    
//     if (params.startDate) {
//       conditions.push(gte(orders.createdAt, params.startDate))
//     }
//     if (params.endDate) {
//       conditions.push(lte(orders.createdAt, params.endDate))
//     }

//     // Join with stores and get comprehensive stats
//     return await db.execute(sql`
//       WITH store_metrics AS (
//         SELECT 
//           s.store_id,
//           s.store_name,
//           s.store_owner,
//           COUNT(DISTINCT o.order_id) as total_orders,
//           SUM((store->>'subtotal')::numeric) as total_revenue,
//           AVG((store->>'subtotal')::numeric) as avg_order_value,
//           jsonb_object_agg(
//             store->>'status',
//             COUNT(*)
//           ) as status_counts
//         FROM stores s
//         LEFT JOIN orders o ON o.created_at BETWEEN ${params.startDate} AND ${params.endDate}
//         LEFT JOIN jsonb_array_elements(o.store_summaries) store 
//           ON store->>'storeId' = s.store_id::text
//         GROUP BY s.store_id, s.store_name, s.store_owner
//       )
//       SELECT 
//         store_id as "storeId",
//         store_name as "storeName",
//         store_owner as "storeOwner",
//         COALESCE(total_orders, 0) as "totalOrders",
//         COALESCE(total_revenue, 0) as "totalRevenue",
//         COALESCE(avg_order_value, 0) as "averageOrderValue",
//         COALESCE(status_counts, '{}'::jsonb) as "ordersByStatus"
//       FROM store_metrics
//       ORDER BY total_revenue DESC
//     `)
//   } catch (error) {
//     console.error('Error fetching store performance stats:', error)
//     throw new Error('Failed to fetch store performance statistics')
//   }
// }, 'storePerformanceStats')