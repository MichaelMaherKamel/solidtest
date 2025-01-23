import { action } from '@solidjs/router'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { carts, type CartItem } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'

const CART_COOKIE = 'cart-session'

// Dynamically determine if the request is over HTTPS
function isSecureRequest(event: any): boolean {
  if (!event || !event.node || !event.node.req) {
    // Default to false if the event or request object is missing
    return false
  }
  const protocol = event.node.req.headers['x-forwarded-proto'] || event.node.req.protocol
  return protocol === 'https'
}

// Helper function to safely get the request event
function getSafeRequestEvent() {
  const event = getRequestEvent()
  if (!event) {
    throw new Error('Request event is not available')
  }
  return event.nativeEvent
}

// Define COOKIE_OPTIONS without calling getSafeRequestEvent() at the module level
const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
}

async function getCartSession(): Promise<string> {
  'use server'
  const event = getSafeRequestEvent()
  let sessionId = getCookie(event, CART_COOKIE)

  if (!sessionId) {
    sessionId = secure()
    // Set the secure flag dynamically based on the request protocol
    setCookie(event, CART_COOKIE, sessionId, {
      ...COOKIE_OPTIONS,
      secure: isSecureRequest(event),
    })
  }

  return sessionId
}

type CartActionResult = { success: true; items: CartItem[] } | { success: false; error: string }

export const addToCartAction = action(async (formData: FormData): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const productData = formData.get('product')?.toString()
    const selectedColor = formData.get('selectedColor')?.toString()

    if (!productData) {
      return { success: false, error: 'Product data is required' }
    }

    const product = JSON.parse(productData)
    const [existingCart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (existingCart) {
      const currentItems = existingCart.items
      const existingItemIndex = currentItems.findIndex(
        (item: CartItem) => item.productId === product.productId && item.selectedColor === selectedColor
      )

      let updatedItems: CartItem[]
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = currentItems.map((item: CartItem, index: number) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + 1,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      } else {
        // Add new item
        updatedItems = [
          ...currentItems,
          {
            ...product,
            quantity: 1,
            selectedColor, // Use the selected color
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
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
      // Create new cart
      const [newCart] = await db
        .insert(carts)
        .values({
          sessionId,
          items: [
            {
              ...product,
              quantity: 1,
              selectedColor, // Use the selected color
              addedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })
        .returning()

      return { success: true, items: newCart.items }
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
})
export const updateCartItemQuantity = action(async (formData: FormData): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const productId = formData.get('productId')?.toString()
    const quantity = parseInt(formData.get('quantity')?.toString() || '0')
    const selectedColor = formData.get('selectedColor')?.toString() // Get selected color

    if (!productId || !selectedColor) {
      return { success: false, error: 'Product ID and selected color are required' }
    }

    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

    let updatedItems: CartItem[]
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      updatedItems = cart.items.filter(
        (item: CartItem) => item.productId !== productId || item.selectedColor !== selectedColor
      )
    } else {
      // Update quantity
      updatedItems = cart.items.map((item: CartItem) =>
        item.productId === productId && item.selectedColor === selectedColor
          ? {
              ...item,
              quantity,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    }

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
    console.error('Error updating cart item:', error)
    return { success: false, error: 'Failed to update cart item' }
  }
})

export const removeCartItem = action(async (formData: FormData): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const productId = formData.get('productId')?.toString()
    const selectedColor = formData.get('selectedColor')?.toString() // Get selected color

    if (!productId || !selectedColor) {
      return { success: false, error: 'Product ID and selected color are required' }
    }

    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

    const updatedItems = cart.items.filter(
      (item: CartItem) => item.productId !== productId || item.selectedColor !== selectedColor
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
    return { success: false, error: 'Failed to remove item from cart' }
  }
})

export const clearCart = action(async (): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

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
    return { success: false, error: 'Failed to clear cart' }
  }
})

export const getCart = action(async (): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (!cart) {
      return { success: true, items: [] } // Return empty cart if not found
    }

    return { success: true, items: cart.items }
  } catch (error) {
    console.error('Error fetching cart:', error)
    return { success: false, error: 'Failed to fetch cart' }
  }
})
