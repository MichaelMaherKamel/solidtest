import { action } from '@solidjs/router'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { carts, products, type CartItem } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'

const CART_COOKIE = 'cart-session'

type DeleteCartResult = { success: true; message: string } | { success: false; error: string }

// Localized messages
const MESSAGES = {
  PRODUCT_NOT_FOUND: {
    en: 'Product not found',
    ar: 'المنتج غير موجود',
  },
  COLOR_UNAVAILABLE: {
    en: 'Selected color unavailable',
    ar: 'اللون المحدد غير متوفر',
  },
  INVALID_QUANTITY: {
    en: 'Invalid quantity',
    ar: 'كمية غير صالحة',
  },
  CART_NOT_FOUND: {
    en: 'Cart not found',
    ar: 'عربة التسوق غير موجودة',
  },
  MAX_QUANTITY_EXCEEDED: {
    en: 'Cannot exceed available stock of {0}',
    ar: 'لا يمكن تجاوز المخزون المتاح {0}',
  },
  REQUIRED_FIELDS: {
    en: 'Product ID and color selection are required',
    ar: 'معرف المنتج واختيار اللون مطلوبان',
  },
  CART_ERROR: {
    en: 'Failed to process cart operation',
    ar: 'فشل في معالجة عملية عربة التسوق',
  },
  CART_CLEARED: {
    en: 'Cart cleared successfully',
    ar: 'تم مسح عربة التسوق بنجاح',
  },
  CART_DELETED: {
    en: 'Cart deleted successfully',
    ar: 'تم حذف عربة التسوق بنجاح',
  },
  ITEM_REMOVED: {
    en: 'Item removed successfully',
    ar: 'تم إزالة العنصر بنجاح',
  },
} as const

// Helper function to get localized message
const getMessage = (key: keyof typeof MESSAGES, locale: 'en' | 'ar' = 'en', params?: string[]): string => {
  const message = MESSAGES[key][locale]
  if (!params) return message
  return params.reduce((msg, param, idx) => msg.replace(`{${idx}}`, param), message)
}

async function getProduct(productId: string): Promise<typeof products.$inferSelect | null> {
  'use server'
  const [product] = await db.select().from(products).where(eq(products.productId, productId))
  return product || null
}

function isSecureRequest(event: any): boolean {
  if (!event?.node?.req) return false
  const protocol = event.node.req.headers['x-forwarded-proto'] || event.node.req.protocol
  return protocol === 'https'
}

function getSafeRequestEvent() {
  const event = getRequestEvent()
  if (!event) throw new Error('Request event unavailable')
  return event.nativeEvent
}

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
}

export async function getCartSession(): Promise<string> {
  'use server'
  const event = getSafeRequestEvent()
  let sessionId = getCookie(event, CART_COOKIE)

  if (!sessionId) {
    sessionId = secure()
    setCookie(event, CART_COOKIE, sessionId, {
      ...COOKIE_OPTIONS,
      secure: isSecureRequest(event),
    })
  }

  return sessionId
}

type CartActionResult =
  | {
      success: true
      items: CartItem[]
      adjusted?: boolean
      max?: number
      existing?: number
      added?: number
    }
  | { success: false; error: string }

const createCartItem = (
  product: typeof products.$inferSelect,
  colorVariant: (typeof product.colorVariants)[0],
  quantity: number
): CartItem => ({
  productId: product.productId,
  quantity,
  selectedColor: colorVariant.color,
  addedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  price: product.price,
  name: product.productName,
  image: colorVariant.colorImageUrls[0] || '',
  storeId: product.storeId,
  storeName: product.storeName,
  inventory: colorVariant.inventory,
})

export const addToCartAction = action(async (formData: FormData): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const productId = formData.get('productId')?.toString()
    const selectedColor = formData.get('selectedColor')?.toString()
    const quantityStr = formData.get('quantity')?.toString()

    if (!productId || !selectedColor) {
      return { success: false, error: getMessage('REQUIRED_FIELDS') }
    }

    const product = await getProduct(productId)
    if (!product) return { success: false, error: getMessage('PRODUCT_NOT_FOUND') }

    const colorVariant = product.colorVariants.find((v) => v.color === selectedColor)
    if (!colorVariant) return { success: false, error: getMessage('COLOR_UNAVAILABLE') }

    const maxQuantity = colorVariant.inventory
    const quantity = parseInt(quantityStr || '1', 10)

    if (isNaN(quantity) || quantity < 1) {
      return { success: false, error: getMessage('INVALID_QUANTITY') }
    }

    const [existingCart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (existingCart) {
      const currentItems = existingCart.items
      const existingItemIndex = currentItems.findIndex(
        (item) => item.productId === productId && item.selectedColor === selectedColor
      )

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        const existingQuantity = currentItems[existingItemIndex].quantity
        const newTotalQuantity = existingQuantity + quantity

        if (newTotalQuantity > maxQuantity) {
          const added = maxQuantity - existingQuantity
          updatedItems = currentItems.map((item, index) =>
            index === existingItemIndex ? { ...item, quantity: maxQuantity, inventory: colorVariant.inventory } : item
          )

          const [updatedCart] = await db
            .update(carts)
            .set({
              items: updatedItems,
              updatedAt: new Date(),
              lastActive: new Date(),
            })
            .where(eq(carts.cartId, existingCart.cartId))
            .returning()

          return {
            success: true,
            items: updatedCart.items,
            adjusted: true,
            max: maxQuantity,
            existing: existingQuantity,
            added,
          }
        }

        updatedItems = currentItems.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: newTotalQuantity,
                updatedAt: new Date().toISOString(),
                price: product.price,
                inventory: colorVariant.inventory,
              }
            : item
        )
      } else {
        if (quantity > maxQuantity) {
          return { success: false, error: getMessage('MAX_QUANTITY_EXCEEDED', 'en', [maxQuantity.toString()]) }
        }

        updatedItems = [...currentItems, createCartItem(product, colorVariant, quantity)]
      }

      const [updatedCart] = await db
        .update(carts)
        .set({
          items: updatedItems,
          updatedAt: new Date(),
          lastActive: new Date(),
        })
        .where(eq(carts.cartId, existingCart.cartId))
        .returning()

      return { success: true, items: updatedCart.items }
    } else {
      if (quantity > maxQuantity) {
        return { success: false, error: getMessage('MAX_QUANTITY_EXCEEDED', 'en', [maxQuantity.toString()]) }
      }

      const [newCart] = await db
        .insert(carts)
        .values({
          sessionId,
          items: [createCartItem(product, colorVariant, quantity)],
        })
        .returning()

      return { success: true, items: newCart.items }
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { success: false, error: getMessage('CART_ERROR') }
  }
})

export const updateCartItemQuantity = action(async (formData: FormData): Promise<CartActionResult> => {
  'use server'
  try {
    // Extract required fields from FormData
    const sessionId = await getCartSession()
    const productId = formData.get('productId')?.toString()
    const selectedColor = formData.get('selectedColor')?.toString()
    const quantityStr = formData.get('quantity')?.toString()
    const locale = (formData.get('locale')?.toString() as 'en' | 'ar') || 'en' // Extract locale

    // Validate required fields
    if (!productId || !selectedColor) {
      return { success: false, error: getMessage('REQUIRED_FIELDS', locale) }
    }

    // Fetch product details
    const product = await getProduct(productId)
    if (!product) return { success: false, error: getMessage('PRODUCT_NOT_FOUND', locale) }

    // Find the selected color variant
    const colorVariant = product.colorVariants.find((v) => v.color === selectedColor)
    if (!colorVariant) return { success: false, error: getMessage('COLOR_UNAVAILABLE', locale) }

    // Validate quantity
    const maxQuantity = colorVariant.inventory
    const quantity = parseInt(quantityStr || '0', 10)
    if (isNaN(quantity)) {
      return { success: false, error: getMessage('INVALID_QUANTITY', locale) }
    }

    // Fetch the cart
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))
    if (!cart) return { success: false, error: getMessage('CART_NOT_FOUND', locale) }

    // Update cart items
    let updatedItems: CartItem[]
    if (quantity <= 0) {
      // Remove the item if quantity is zero or negative
      updatedItems = cart.items.filter((item) => item.productId !== productId || item.selectedColor !== selectedColor)
    } else {
      // Check if the requested quantity exceeds available stock
      if (quantity > maxQuantity) {
        return { success: false, error: getMessage('MAX_QUANTITY_EXCEEDED', locale, [maxQuantity.toString()]) }
      }

      // Update the quantity for the specified item
      updatedItems = cart.items.map((item) =>
        item.productId === productId && item.selectedColor === selectedColor
          ? {
              ...item,
              quantity: quantity,
              updatedAt: new Date().toISOString(),
              price: product.price,
              inventory: colorVariant.inventory,
            }
          : item
      )
    }

    // Save the updated cart
    const [updatedCart] = await db
      .update(carts)
      .set({
        items: updatedItems,
        updatedAt: new Date(),
        lastActive: new Date(),
      })
      .where(eq(carts.cartId, cart.cartId))
      .returning()

    return { success: true, items: updatedCart.items }
  } catch (error) {
    // Log and return an error message
    console.error('Error updating cart item:', error)
    return { success: false, error: getMessage('CART_ERROR', 'en') } // Default to English if locale fails
  }
})

export const removeCartItem = action(async (formData: FormData): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const productId = formData.get('productId')?.toString()
    const selectedColor = formData.get('selectedColor')?.toString()

    if (!productId || !selectedColor) {
      return { success: false, error: getMessage('REQUIRED_FIELDS') }
    }

    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))
    if (!cart) return { success: false, error: getMessage('CART_NOT_FOUND') }

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId || item.selectedColor !== selectedColor
    )

    const [updatedCart] = await db
      .update(carts)
      .set({
        items: updatedItems,
        updatedAt: new Date(),
        lastActive: new Date(),
      })
      .where(eq(carts.cartId, cart.cartId))
      .returning()

    return { success: true, items: updatedCart.items }
  } catch (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: getMessage('CART_ERROR') }
  }
})

export const clearCart = action(async (): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (!cart) return { success: false, error: getMessage('CART_NOT_FOUND') }

    const [updatedCart] = await db
      .update(carts)
      .set({
        items: [],
        updatedAt: new Date(),
        lastActive: new Date(),
      })
      .where(eq(carts.cartId, cart.cartId))
      .returning()

    return { success: true, items: updatedCart.items }
  } catch (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: getMessage('CART_ERROR') }
  }
})

export const deleteCart = action(async (): Promise<DeleteCartResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const event = getSafeRequestEvent()

    await db.delete(carts).where(eq(carts.sessionId, sessionId))
    setCookie(event, CART_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: -1, secure: isSecureRequest(event) })

    return { success: true, message: getMessage('CART_DELETED') }
  } catch (error) {
    console.error('Error deleting cart:', error)
    return { success: false, error: getMessage('CART_ERROR') }
  }
})

export const getCart = action(async (): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))
    return { success: true, items: cart?.items || [] }
  } catch (error) {
    console.error('Error fetching cart:', error)
    return { success: false, error: getMessage('CART_ERROR') }
  }
})
