import { sql } from 'drizzle-orm'
import { db } from '~/db'
import { products } from '~/db/schema'
import { Product, ColorVariant } from '~/db/schema/types'
import { query } from '@solidjs/router'

export type ProductWithFirstColor = Omit<Product, 'colorVariants'> & {
  firstColor?: {
    color: ColorVariant['color']
    inventory: number
    imageUrl: string
  }
}

export const getProducts = query(async () => {
  'use server'
  try {
    const result = await db.select().from(products).orderBy(products.createdAt)

    return result.map((product) => ({
      ...product,
      firstColor: product.colorVariants[0]
        ? {
            color: product.colorVariants[0].color,
            inventory: product.colorVariants[0].inventory,
            imageUrl: product.colorVariants[0].colorImageUrls[0],
          }
        : undefined,
      colorVariants: undefined,
    })) as ProductWithFirstColor[]
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}, 'products')

export const getProductsByStore = query(async (storeId: string) => {
  'use server'
  try {
    const result = await db
      .select()
      .from(products)
      .where(sql`${products.storeId} = ${storeId}`)
      .orderBy(products.createdAt)
    return result as Product[]
  } catch (error) {
    console.error('Error fetching store products:', error)
    throw new Error('Failed to fetch store products')
  }
}, 'storeProducts')
