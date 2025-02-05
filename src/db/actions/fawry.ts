import { action } from '@solidjs/router'
import { db } from '~/db'
import { orders } from '~/db/schema'
import { eq } from 'drizzle-orm'
import { createHash } from 'crypto'
import type { Address } from '~/db/schema'

// Define the ChargeRequest type
type ChargeRequest = {
  merchantCode: string
  merchantRefNum: string
  customerMobile: string
  customerEmail: string
  customerName: string
  customerProfileId: string
  chargeItems: {
    itemId: string
    description: string
    price: string
    quantity: number
    imageUrl: string
  }[]
  returnUrl: string
  authCaptureModePayment: boolean
  paymentExpiry: number
  secKey: string
  description: string
  signature?: string // Optional since it's added later
}

export const createFawryChargeRequest = action(async (orderId: string) => {
  'use server'
  try {
    const order = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1)
    if (!order[0]) throw new Error('Order not found')

    if (!process.env.FAWRY_MERCHANT_CODE || !process.env.FAWRY_SECURE_KEY) {
      throw new Error('Fawry configuration missing')
    }

    const shippingAddress = order[0].shippingAddress as Address

    // Generate the signature
    const signRequest = (chargeRequest: ChargeRequest): string => {
      const items = chargeRequest.chargeItems.sort((x, y) => {
        const a = x.itemId.toUpperCase()
        const b = y.itemId.toUpperCase()
        return a === b ? 0 : a > b ? 1 : -1
      })

      let signString = [
        chargeRequest.merchantCode,
        chargeRequest.merchantRefNum,
        chargeRequest.customerProfileId || '',
        chargeRequest.returnUrl || '',
        ...items.flatMap((item) => [item.itemId, item.quantity.toString(), item.price]),
        process.env.FAWRY_SECURE_KEY,
      ].join('')

      return createHash('sha256').update(signString).digest('hex')
    }

    // Prepare the charge request payload
    const chargeRequest: ChargeRequest = {
      merchantCode: process.env.FAWRY_MERCHANT_CODE,
      merchantRefNum: order[0].orderNumber,
      customerMobile: shippingAddress?.phone || '',
      customerEmail: shippingAddress?.email || '',
      customerName: shippingAddress?.name || '',
      customerProfileId: order[0].userId || '',
      chargeItems: order[0].items.map((item) => ({
        itemId: item.productId,
        description: item.name,
        price: item.price.toFixed(2),
        quantity: item.quantity,
        imageUrl: item.image || '',
      })),
      returnUrl: `${process.env.BASE_URL}/checkout`,
      authCaptureModePayment: false,
      paymentExpiry: Date.now() + 3600 * 1000, // 1 hour from now
      secKey: process.env.FAWRY_SECURE_KEY,
      description: 'Order Payment',
    }

    // Add the signature to the chargeRequest
    chargeRequest.signature = signRequest(chargeRequest)

    return { success: true, chargeRequest }
  } catch (error) {
    console.error('Fawry charge request error:', error)
    return { success: false, error: 'Failed to create Fawry charge request' }
  }
})
