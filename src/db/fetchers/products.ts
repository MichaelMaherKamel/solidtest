import { sql, eq } from 'drizzle-orm'
import { db } from '~/db'
import { products, stores } from '~/db/schema'
import { query } from '@solidjs/router'
import type { Product, ColorVariant } from '~/db/schema'

// New function to fetch all products for admin
export const getAllProducts = query(async () => {
  'use server'
  try {
    const result = await db
      .select({
        productId: products.productId,
        productName: products.productName,
        productDescription: products.productDescription,
        category: products.category,
        price: products.price,
        storeId: products.storeId,
        totalInventory: products.totalInventory,
        colorVariants: products.colorVariants,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        searchVector: products.searchVector,
        storeSubscription: stores.subscription,
        storeName: stores.storeName, // Added for admin view
        storeOwner: stores.storeOwner, // Added for admin view
      })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.storeId))
      .orderBy(
        sql`CASE 
          WHEN ${stores.subscription} = 'premium' THEN 1
          WHEN ${stores.subscription} = 'business' THEN 2
          WHEN ${stores.subscription} = 'basic' THEN 3
          ELSE 4
        END`,
        products.createdAt
      )
    return result
  } catch (error) {
    console.error('Error fetching all products:', error)
    throw new Error('Failed to fetch all products')
  }
}, 'allProducts')

// Fetch all Store products
export const getProducts = query(async (storeId: string) => {
  'use server'
  try {
    const result = await db
      .select({
        productId: products.productId,
        productName: products.productName,
        productDescription: products.productDescription,
        category: products.category,
        price: products.price,
        storeId: products.storeId,
        totalInventory: products.totalInventory,
        colorVariants: products.colorVariants,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        searchVector: products.searchVector,
        storeSubscription: stores.subscription,
      })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.storeId))
      .where(eq(products.storeId, storeId))
      .orderBy(
        sql`CASE 
          WHEN ${stores.subscription} = 'premium' THEN 1
          WHEN ${stores.subscription} = 'business' THEN 2
          WHEN ${stores.subscription} = 'basic' THEN 3
          ELSE 4
        END`,
        products.createdAt
      )
    //await new Promise((resolve) => setTimeout(resolve, 5000)) // Simulate a delay
    return result
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}, 'products')

// Fetch products by category with store subscription ordering
export const getCategoryProducts = query(async (category: 'kitchensupplies' | 'bathroomsupplies' | 'homesupplies') => {
  'use server'
  try {
    const result = await db
      .select({
        productId: products.productId,
        productName: products.productName,
        productDescription: products.productDescription,
        category: products.category,
        price: products.price,
        storeId: products.storeId,
        totalInventory: products.totalInventory,
        colorVariants: products.colorVariants,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        searchVector: products.searchVector,
        storeSubscription: stores.subscription,
      })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.storeId))
      .where(eq(products.category, category))
      .orderBy(
        sql`CASE 
          WHEN ${stores.subscription} = 'premium' THEN 1
          WHEN ${stores.subscription} = 'business' THEN 2
          WHEN ${stores.subscription} = 'basic' THEN 3
          ELSE 4
        END`,
        products.createdAt
      )
    return result
  } catch (error) {
    console.error('Error fetching category products:', error)
    throw new Error('Failed to fetch category products')
  }
}, 'categoryProducts')

// Fetch color variants for a specific product
export const getProductColors = query(async (productId: string) => {
  'use server'
  try {
    const [result] = await db
      .select({
        colorVariants: products.colorVariants,
      })
      .from(products)
      .where(eq(products.productId, productId))

    return (result?.colorVariants as ColorVariant[]) || []
  } catch (error) {
    console.error('Error fetching product colors:', error)
    throw new Error('Failed to fetch product colors')
  }
}, 'productColors')

// Fetch color variants for a store's products
export const getStoreProductColors = query(async (storeId: string) => {
  'use server'
  try {
    const result = await db
      .select({
        productId: products.productId,
        productName: products.productName,
        colorVariants: products.colorVariants,
      })
      .from(products)
      .where(eq(products.storeId, storeId))
      .orderBy(products.createdAt)

    return result.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      colors: product.colorVariants as ColorVariant[],
    }))
  } catch (error) {
    console.error('Error fetching store product colors:', error)
    throw new Error('Failed to fetch store product colors')
  }
}, 'storeProductColors')

// Get single product by ID with colors
export const getProductById = query(async (productId: string) => {
  'use server'
  try {
    const [result] = await db
      .select({
        productId: products.productId,
        productName: products.productName,
        productDescription: products.productDescription,
        category: products.category,
        price: products.price,
        storeId: products.storeId,
        totalInventory: products.totalInventory,
        colorVariants: products.colorVariants,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        searchVector: products.searchVector,
        storeSubscription: stores.subscription,
      })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.storeId))
      .where(eq(products.productId, productId))

    return result
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }
}, 'product')
