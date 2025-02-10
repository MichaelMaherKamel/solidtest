import { sql, eq, ilike } from 'drizzle-orm'
import { db } from '~/db'
import { products, stores } from '~/db/schema'
import { query } from '@solidjs/router'
import type { Product, ColorVariant, ProductCategory } from '~/db/schema'

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
        storeName: products.storeName,
        totalInventory: products.totalInventory,
        colorVariants: products.colorVariants,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        searchVector: products.searchVector,
        storeSubscription: stores.subscription,
        storeOwner: stores.storeOwner,
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
        storeName: products.storeName,
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
        storeName: products.storeName,
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
        storeName: products.storeName,
        colorVariants: products.colorVariants,
      })
      .from(products)
      .where(eq(products.storeId, storeId))
      .orderBy(products.createdAt)

    return result.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      storeName: product.storeName,
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
        storeName: products.storeName,
        totalInventory: products.totalInventory,
        colorVariants: products.colorVariants,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        searchVector: products.searchVector,
      })
      .from(products)
      .where(eq(products.productId, productId))

    return result
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }
}, 'product')

export const searchProducts = query(async (searchQuery: string) => {
  'use server'
  try {
    console.log('Server received search query:', searchQuery)

    const trimmedQuery = searchQuery.trim()

    const selectFields = {
      productId: products.productId,
      productName: products.productName,
      price: products.price,
      storeId: products.storeId,
      storeName: stores.storeName,
      colorVariants: products.colorVariants,
      // Add any other fields you need
    }

    if (trimmedQuery.length <= 2) {
      const likePattern = `%${trimmedQuery}%`
      const result = await db
        .select(selectFields)
        .from(products)
        .leftJoin(stores, eq(products.storeId, stores.storeId))
        .where(ilike(products.productName, likePattern))
        .orderBy(products.productName)
        .limit(12)

      // Transform the results to include the first image from color variants
      return result.map((product) => ({
        ...product,
        image: (product.colorVariants as ColorVariant[])?.[0]?.colorImageUrls?.[0] || '',
      }))
    } else {
      const formattedQuery = trimmedQuery

      const result = await db
        .select(selectFields)
        .from(products)
        .leftJoin(stores, eq(products.storeId, stores.storeId))
        .where(
          sql`to_tsvector('english', ${products.productName} || ' ' || ${products.productDescription}) @@ 
              plainto_tsquery('english', ${formattedQuery})`
        )
        .orderBy(
          sql`ts_rank(
              to_tsvector('english', ${products.productName} || ' ' || ${products.productDescription}), 
              plainto_tsquery('english', ${formattedQuery})
              ) DESC`,
          sql`CASE 
              WHEN ${stores.subscription} = 'premium' THEN 1
              WHEN ${stores.subscription} = 'business' THEN 2
              WHEN ${stores.subscription} = 'basic' THEN 3
              ELSE 4
              END`
        )
        .limit(12)

      // Transform the results to include the first image from color variants
      return result.map((product) => ({
        ...product,
        image: (product.colorVariants as ColorVariant[])?.[0]?.colorImageUrls?.[0] || '',
      }))
    }
  } catch (error) {
    console.error('Search error:', error)
    throw new Error('Failed to perform search')
  }
}, 'searchProducts')
