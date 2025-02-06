// ~/db/actions/fawry.ts
import { action } from '@solidjs/router'
import CryptoJS from 'crypto-js'
import type { CartItem, Address } from '~/db/schema'
import { env } from '~/config/env'

interface FawryChargeItem {
  itemId: string
  description: string
  price: number
  quantity: number
  imageUrl: string
}

interface FawryRequest {
  merchantCode: string
  merchantRefNum: string
  customerMobile: string
  customerEmail: string
  customerName: string
  customerProfileId: string
  paymentExpiry: string
  language: string
  chargeItems: FawryChargeItem[]
  paymentMethod: string
  returnUrl: string
  authCaptureModePayment: boolean
  orderAmount: string
  currency: string
  orderDescription: string
  signature?: string
}

interface FawrySuccessResponse {
  type: string
  referenceNumber: string
  merchantRefNumber: string
  paymentAmount: number
  orderAmount: number
  fawryFees: number
  paymentMethod: string
  orderStatus: string
  paymentTime: string
  customerMobile: string
  customerEmail: string
  customerProfileId: string
  signature: string
  statusCode: number
  statusDescription: string
  paymentURL?: string
}

interface FawryErrorResponse {
  statusCode: number
  statusDescription: string
}

type FawryPaymentResult = { success: true; paymentUrl: string } | { success: false; error: string }

function isFawryResponse(data: unknown): data is FawrySuccessResponse | FawryErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'statusCode' in data &&
    typeof (data as any).statusCode === 'number' &&
    'statusDescription' in data &&
    typeof (data as any).statusDescription === 'string'
  )
}

function isSuccessResponse(data: FawrySuccessResponse | FawryErrorResponse): data is FawrySuccessResponse {
  return 'paymentURL' in data && typeof (data as FawrySuccessResponse).paymentURL === 'string'
}

function signFawryRequest(chargeRequest: FawryRequest, securityKey: string): string {
  let signString = chargeRequest.merchantCode + chargeRequest.merchantRefNum
  signString += chargeRequest.customerProfileId || ''
  signString += chargeRequest.returnUrl || ''

  const items = [...chargeRequest.chargeItems].sort((a, b) =>
    a.itemId.toUpperCase() > b.itemId.toUpperCase() ? 1 : -1
  )

  items.forEach((item) => {
    signString += `${item.itemId}${item.quantity}${item.price.toFixed(2)}`
  })

  signString += securityKey

  const hash = CryptoJS.SHA256(signString)
  return hash.toString(CryptoJS.enc.Hex)
}

export const initializeFawryPayment = action(
  async (payload: {
    items: CartItem[]
    address: Address
    orderNumber: string
    total: number
  }): Promise<FawryPaymentResult> => {
    'use server'
    try {
      const { items, address, orderNumber, total } = payload
      const { FAWRY_MERCHANT_CODE, FAWRY_SECURITY_CODE, PUBLIC_URL } = env

      console.log('Starting Fawry payment initialization:', {
        orderNumber,
        total: total.toFixed(2),
      })

      const futureTimestamp = Date.now() + 1 * 60 * 60 * 1000 // 1 hour expiry

      const chargeItems: FawryChargeItem[] = items.map((item) => ({
        itemId: item.productId,
        description: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.image,
      }))

      const chargeRequest: FawryRequest = {
        merchantCode: FAWRY_MERCHANT_CODE,
        merchantRefNum: orderNumber,
        customerMobile: address.phone,
        customerEmail: address.email || 'no-email@provided.com',
        customerName: address.name,
        customerProfileId: orderNumber,
        paymentExpiry: futureTimestamp.toString(),
        language: 'en-gb',
        chargeItems,
        paymentMethod: 'CARD',
        returnUrl: `${PUBLIC_URL}/checkout`,
        authCaptureModePayment: false,
        orderAmount: total.toFixed(2),
        currency: 'EGP',
        orderDescription: `Order ${orderNumber}`,
      }

      const signature = signFawryRequest(chargeRequest, FAWRY_SECURITY_CODE)
      console.log('Generated signature:', signature)

      const signedRequest: FawryRequest = {
        ...chargeRequest,
        signature,
      }

      console.log('Sending request to Fawry:', {
        merchantCode: FAWRY_MERCHANT_CODE,
        orderNumber,
        total: total.toFixed(2),
      })

      const response = await fetch('https://atfawry.com/fawrypay-api/api/payments/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify(signedRequest),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Fawry API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })
        return {
          success: false,
          error: `Payment gateway error: ${response.status} ${response.statusText}`,
        }
      }

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const data = await response.json()
        console.log('Fawry JSON response:', data)

        if (isFawryResponse(data)) {
          if (data.statusCode !== 200) {
            return {
              success: false,
              error: data.statusDescription || 'Payment initialization failed',
            }
          }

          if (isSuccessResponse(data) && data.paymentURL) {
            return { success: true, paymentUrl: data.paymentURL }
          }
        }
      }

      const text = await response.text()
      console.log('Fawry text response:', text)

      if (text.trim().toLowerCase().startsWith('http')) {
        return { success: true, paymentUrl: text.trim() }
      }

      return { success: false, error: 'Invalid response from payment gateway' }
    } catch (error) {
      console.error('Payment initialization error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initialization failed',
      }
    }
  }
)
