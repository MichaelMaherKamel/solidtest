// // ~/db/actions/cart.ts
// import { action } from '@solidjs/router'
// import { eq } from 'drizzle-orm'
// import { db } from '~/db'
// import { carts, type CartItem } from '~/db/schema'
// import { getCookie, setCookie } from 'vinxi/http'
// import { getRequestEvent } from 'solid-js/web'
// import { v4 as secure } from '@lukeed/uuid/secure'

// const CART_COOKIE = 'cart-session'

// const COOKIE_OPTIONS = {
//   maxAge: 60 * 60 * 24 * 30, // 30 days
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   path: '/',
//   sameSite: 'lax' as const,
// }

// async function getCartSession(): Promise<string> {
//   const event = getRequestEvent()!.nativeEvent
//   let sessionId = getCookie(event, CART_COOKIE)

//   if (!sessionId) {
//     sessionId = secure()
//     setCookie(event, CART_COOKIE, sessionId, COOKIE_OPTIONS)
//   }

//   return sessionId
// }

// export type CartActionResult = { success: true; cart: typeof carts.$inferSelect } | { success: false; error: string }

// export const addToCartAction = action(async (formData: FormData): Promise<CartActionResult> => {
//   'use server'
//   try {
//     const sessionId = await getCartSession()
//     const productData = formData.get('product')?.toString()

//     if (!productData) {
//       return { success: false, error: 'Product data is required' }
//     }

//     const product = JSON.parse(productData)

//     // Find existing cart
//     const [existingCart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

//     if (existingCart) {
//       const currentItems = existingCart.items
//       const existingItemIndex = currentItems.findIndex((item: CartItem) => item.productId === product.productId)

//       let updatedItems
//       if (existingItemIndex >= 0) {
//         // Update quantity if item exists
//         updatedItems = currentItems.map((item: CartItem, index: number) =>
//           index === existingItemIndex
//             ? {
//                 ...item,
//                 quantity: item.quantity + 1,
//                 updatedAt: new Date().toISOString(),
//               }
//             : item
//         )
//       } else {
//         // Add new item
//         updatedItems = [
//           ...currentItems,
//           {
//             ...product,
//             quantity: 1,
//             addedAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           },
//         ]
//       }

//       const [updatedCart] = await db
//         .update(carts)
//         .set({
//           items: updatedItems,
//           updatedAt: new Date(),
//           lastActive: new Date(),
//         })
//         .where(eq(carts.cartId, existingCart.cartId))
//         .returning()

//       return { success: true, cart: updatedCart }
//     } else {
//       // Create new cart
//       const [newCart] = await db
//         .insert(carts)
//         .values({
//           sessionId,
//           items: [
//             {
//               ...product,
//               quantity: 1,
//               addedAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             },
//           ],
//         })
//         .returning()

//       return { success: true, cart: newCart }
//     }
//   } catch (error) {
//     console.error('Error adding to cart:', error)
//     return { success: false, error: 'Failed to add item to cart' }
//   }
// })

// export const updateCartItemAction = action(async (formData: FormData): Promise<CartActionResult> => {
//   'use server'
//   try {
//     const sessionId = await getCartSession()
//     const productId = formData.get('productId')?.toString()
//     const quantity = parseInt(formData.get('quantity')?.toString() || '0')

//     if (!productId) {
//       return { success: false, error: 'Product ID is required' }
//     }

//     const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

//     if (!cart) {
//       return { success: false, error: 'Cart not found' }
//     }

//     let updatedItems
//     if (quantity <= 0) {
//       // Remove item if quantity is 0 or negative
//       updatedItems = cart.items.filter((item: CartItem) => item.productId !== productId)
//     } else {
//       // Update quantity
//       updatedItems = cart.items.map((item: CartItem) =>
//         item.productId === productId
//           ? {
//               ...item,
//               quantity,
//               updatedAt: new Date().toISOString(),
//             }
//           : item
//       )
//     }

//     const [updatedCart] = await db
//       .update(carts)
//       .set({
//         items: updatedItems,
//         updatedAt: new Date(),
//         lastActive: new Date(),
//       })
//       .where(eq(carts.cartId, cart.cartId))
//       .returning()

//     return { success: true, cart: updatedCart }
//   } catch (error) {
//     console.error('Error updating cart item:', error)
//     return { success: false, error: 'Failed to update cart item' }
//   }
// })

// export const removeFromCartAction = action(async (formData: FormData): Promise<CartActionResult> => {
//   'use server'
//   try {
//     const sessionId = await getCartSession()
//     const productId = formData.get('productId')?.toString()

//     if (!productId) {
//       return { success: false, error: 'Product ID is required' }
//     }

//     const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

//     if (!cart) {
//       return { success: false, error: 'Cart not found' }
//     }

//     const updatedItems = cart.items.filter((item: CartItem) => item.productId !== productId)

//     const [updatedCart] = await db
//       .update(carts)
//       .set({
//         items: updatedItems,
//         updatedAt: new Date(),
//         lastActive: new Date(),
//       })
//       .where(eq(carts.cartId, cart.cartId))
//       .returning()

//     return { success: true, cart: updatedCart }
//   } catch (error) {
//     console.error('Error removing from cart:', error)
//     return { success: false, error: 'Failed to remove item from cart' }
//   }
// })

// export const clearCartAction = action(async (): Promise<CartActionResult> => {
//   'use server'
//   try {
//     const sessionId = await getCartSession()
//     const event = getRequestEvent()!.nativeEvent

//     // Clear the cart cookie
//     setCookie(event, CART_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 })

//     const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

//     if (!cart) {
//       return { success: false, error: 'Cart not found' }
//     }

//     const [updatedCart] = await db
//       .update(carts)
//       .set({
//         items: [],
//         updatedAt: new Date(),
//         lastActive: new Date(),
//       })
//       .where(eq(carts.cartId, cart.cartId))
//       .returning()

//     return { success: true, cart: updatedCart }
//   } catch (error) {
//     console.error('Error clearing cart:', error)
//     return { success: false, error: 'Failed to clear cart' }
//   }
// })

// ~/db/actions/cart.ts
import { action } from '@solidjs/router'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { carts, type CartItem } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'

const CART_COOKIE = 'cart-session'

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax' as const,
}

async function getCartSession(): Promise<string> {
  'use server'
  const event = getRequestEvent()!.nativeEvent
  let sessionId = getCookie(event, CART_COOKIE)

  if (!sessionId) {
    sessionId = secure()
    setCookie(event, CART_COOKIE, sessionId, COOKIE_OPTIONS)
  }

  return sessionId
}

type CartActionResult = { success: true; items: CartItem[] } | { success: false; error: string }

export const addToCartAction = action(async (formData: FormData): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const productData = formData.get('product')?.toString()

    if (!productData) {
      return { success: false, error: 'Product data is required' }
    }

    const product = JSON.parse(productData)
    const [existingCart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (existingCart) {
      const currentItems = existingCart.items
      const existingItemIndex = currentItems.findIndex((item: CartItem) => item.productId === product.productId)

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

export const getCartItems = action(async (): Promise<CartItem[]> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))
    return cart?.items || []
  } catch (error) {
    console.error('Error getting cart items:', error)
    return []
  }
})

export const updateCartItemQuantity = action(async (formData: FormData): Promise<CartActionResult> => {
  'use server'
  try {
    const sessionId = await getCartSession()
    const productId = formData.get('productId')?.toString()
    const quantity = parseInt(formData.get('quantity')?.toString() || '0')

    if (!productId) {
      return { success: false, error: 'Product ID is required' }
    }

    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

    let updatedItems: CartItem[]
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      updatedItems = cart.items.filter((item: CartItem) => item.productId !== productId)
    } else {
      // Update quantity
      updatedItems = cart.items.map((item: CartItem) =>
        item.productId === productId
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

    if (!productId) {
      return { success: false, error: 'Product ID is required' }
    }

    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

    const updatedItems = cart.items.filter((item: CartItem) => item.productId !== productId)

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
