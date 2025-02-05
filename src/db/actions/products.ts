import { action } from '@solidjs/router'
import { eq, sql } from 'drizzle-orm'
import { db } from '~/db'
import { products, stores } from '~/db/schema'
import type { ColorVariant } from '~/db/schema'
import { OrderItem } from '../schema/types'

export type ProductActionResult =
  | {
      success: true
      product: typeof products.$inferSelect
    }
  | {
      success: false
      error: string
    }

type UpdateInventoryResult = {
  success: boolean
  error?: string
  updatedProducts?: (typeof products.$inferSelect)[]
}

export const createProductAction = action(async (formData: FormData): Promise<ProductActionResult> => {
  'use server'
  try {
    const productName = formData.get('productName')?.toString()
    const productDescription = formData.get('productDescription')?.toString()
    const category = formData.get('category')?.toString() as 'kitchensupplies' | 'bathroomsupplies' | 'homesupplies'
    const price = parseFloat(formData.get('price')?.toString() || '0')
    const storeId = formData.get('storeId')?.toString()
    const storeName = formData.get('storeName')?.toString()
    const colorVariantsStr = formData.get('colorVariants')?.toString()

    // Validate required fields
    if (!productName || !productDescription || !storeId || !category || !storeName) {
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
        storeName,
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
    const storeName = formData.get('storeName')?.toString()
    const colorVariantsStr = formData.get('colorVariants')?.toString()

    if (!productId || !productName || !productDescription || !category || !storeName) {
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
        storeName,
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

export const updateInventoryAfterOrderAction = action(
  async (orderItems: OrderItem[]): Promise<UpdateInventoryResult> => {
    'use server'
    try {
      const updatedProducts = []

      // Process each order item
      for (const item of orderItems) {
        // Get the current product
        const [currentProduct] = await db.select().from(products).where(eq(products.productId, item.productId))

        if (!currentProduct) {
          console.error(`Product not found: ${item.productId}`)
          continue
        }

        // Update the color variant inventory
        const updatedColorVariants = currentProduct.colorVariants.map((variant: ColorVariant) => {
          if (variant.color === item.selectedColor) {
            // Ensure inventory doesn't go below 0
            const newInventory = Math.max(0, variant.inventory - item.quantity)
            if (newInventory !== variant.inventory - item.quantity) {
              console.warn(
                `Insufficient inventory for product ${item.productId}, color ${item.selectedColor}. Adjusting quantity.`
              )
            }
            return { ...variant, inventory: newInventory }
          }
          return variant
        })

        // Calculate new total inventory
        const newTotalInventory = updatedColorVariants.reduce((sum, variant) => sum + variant.inventory, 0)

        // Update the product
        const [updatedProduct] = await db
          .update(products)
          .set({
            colorVariants: updatedColorVariants,
            totalInventory: newTotalInventory,
          })
          .where(eq(products.productId, item.productId))
          .returning()

        updatedProducts.push(updatedProduct)
      }

      return {
        success: true,
        updatedProducts,
      }
    } catch (error) {
      console.error('Error updating inventory:', error)
      return {
        success: false,
        error: 'Failed to update product inventory',
      }
    }
  }
)
