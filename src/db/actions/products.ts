import { action } from '@solidjs/router'
import { eq, sql } from 'drizzle-orm'
import { db } from '~/db'
import { products } from '~/db/schema'
import type { ProductFormData, ColorVariant } from '~/db/schema'

export type ProductActionResult =
  | {
      success: true
      product: typeof products.$inferSelect
    }
  | {
      success: false
      error: string
    }

export const createProductAction = action(async (formData: FormData): Promise<ProductActionResult> => {
  'use server'
  try {
    const productName = formData.get('productName')?.toString()
    const productDescription = formData.get('productDescription')?.toString()
    const category = formData.get('category')?.toString() as 'kitchensupplies' | 'bathroomsupplies' | 'homesupplies'
    const price = parseFloat(formData.get('price')?.toString() || '0')
    const storeId = formData.get('storeId')?.toString()
    const colorVariantsStr = formData.get('colorVariants')?.toString()

    // Validate required fields
    if (!productName || !productDescription || !storeId || !category) {
      return { success: false, error: 'Required fields are missing' }
    }

    // Parse and validate colorVariants
    let colorVariants: ColorVariant[] = []
    try {
      colorVariants = colorVariantsStr ? JSON.parse(colorVariantsStr) : []
    } catch (e) {
      return { success: false, error: 'Invalid color variants format' }
    }

    // Calculate total inventory
    const totalInventory = colorVariants.reduce((sum, variant) => sum + (variant.inventory || 0), 0)

    // Create the search vector
    const searchVector = sql`to_tsvector('english', ${productName} || ' ' || ${productDescription})`

    const [product] = await db
      .insert(products)
      .values({
        productName,
        productDescription,
        category,
        price,
        storeId,
        colorVariants,
        totalInventory,
        searchVector,
      })
      .returning()

    return { success: true, product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
})

export const updateProductAction = action(async (formData: FormData): Promise<ProductActionResult> => {
  'use server'
  try {
    const productId = formData.get('productId')?.toString()
    const productName = formData.get('productName')?.toString()
    const productDescription = formData.get('productDescription')?.toString()
    const category = formData.get('category')?.toString() as 'kitchensupplies' | 'bathroomsupplies' | 'homesupplies'
    const price = parseFloat(formData.get('price')?.toString() || '0')
    const colorVariantsStr = formData.get('colorVariants')?.toString()

    if (!productId || !productName || !productDescription || !category) {
      return { success: false, error: 'Required fields are missing' }
    }

    // Parse and validate colorVariants
    let colorVariants: ColorVariant[] = []
    try {
      colorVariants = colorVariantsStr ? JSON.parse(colorVariantsStr) : []
    } catch (e) {
      return { success: false, error: 'Invalid color variants format' }
    }

    // Calculate total inventory
    const totalInventory = colorVariants.reduce((sum, variant) => sum + (variant.inventory || 0), 0)

    // Create the search vector
    const searchVector = sql`to_tsvector('english', ${productName} || ' ' || ${productDescription})`

    const [product] = await db
      .update(products)
      .set({
        productName,
        productDescription,
        category,
        price,
        colorVariants,
        totalInventory,
        searchVector,
      })
      .where(eq(products.productId, productId))
      .returning()

    return { success: true, product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Failed to update product' }
  }
})

export const deleteProductAction = action(async (formData: FormData): Promise<ProductActionResult> => {
  'use server'
  try {
    const productId = formData.get('productId')?.toString()

    if (!productId) {
      return { success: false, error: 'Product ID is required' }
    }

    const [deletedProduct] = await db.delete(products).where(eq(products.productId, productId)).returning()

    return { success: true, product: deletedProduct }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
})
