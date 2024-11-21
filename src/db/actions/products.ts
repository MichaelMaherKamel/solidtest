// ~/actions/products.ts
import { sql } from 'drizzle-orm'
import { db } from '~/db'
import { products } from '~/db/schema'
import { NewProduct, Product, ColorVariant, ProductCategory } from '~/db/schema/types'
import { action } from '@solidjs/router'

// Omit auto-generated fields from the input type
export type CreateProductInput = Omit<NewProduct, 'productId' | 'createdAt' | 'updatedAt'> & {
  colorVariants: ColorVariant[]
}

export const createProduct = action(async (input: CreateProductInput) => {
  'use server'
  try {
    const [product] = await db
      .insert(products)
      .values({
        productName: input.productName,
        productDescription: input.productDescription,
        category: input.category,
        price: input.price,
        storeId: input.storeId,
        colorVariants: input.colorVariants,
      })
      .returning()

    return { success: true, product } as const
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' } as const
  }
}, 'createProduct')

// Helper type for action result
export type CreateProductResult = { success: true; product: Product } | { success: false; error: string }
