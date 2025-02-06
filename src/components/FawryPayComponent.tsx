import { createSignal } from 'solid-js'
import { Button } from './ui/button'
import * as CryptoJS from 'crypto-js'

interface ChargeItem {
  itemId: string
  description: string
  price: number
  quantity: number
  imageUrl: string
}

interface ChargeRequest {
  merchantCode: string
  merchantRefNum: string
  customerMobile: string
  customerEmail: string
  customerName: string
  customerProfileId: string
  paymentExpiry: string
  language: string
  chargeItems: ChargeItem[]
  paymentMethod: string
  returnUrl: string
  authCaptureModePayment: boolean
  signature?: string
}

// Move utility functions outside the component
const signRequest = (chargeRequest: ChargeRequest, securityKey: string): string => {
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
  return CryptoJS.SHA256(signString).toString(CryptoJS.enc.Hex)
}

const buildChargeRequest = (merchantCode: string, securityKey: string): ChargeRequest => {
  const merchantRefNum = Math.floor(Math.random() * 100000000 + 1).toString()
  const futureTimestamp = Date.now() + 1 * 60 * 60 * 1000

  const chargeRequest: ChargeRequest = {
    merchantCode,
    merchantRefNum,
    customerMobile: '01022618610',
    customerEmail: 'test@example.com',
    customerName: 'Customer Name',
    customerProfileId: '1212',
    paymentExpiry: futureTimestamp.toString(),
    language: 'en-gb',
    chargeItems: [
      {
        itemId: '6b5fdea340e31b3b0339d4d4ae5',
        description: 'Product Description',
        price: 50.0,
        quantity: 2,
        imageUrl: 'https://developer.fawrystaging.com/photos/45566.jpg',
      },
      {
        itemId: '97092dd9e9c07888c7eef36',
        description: 'Product Description',
        price: 75.25,
        quantity: 3,
        imageUrl: 'https://developer.fawrystaging.com/photos/639855.jpg',
      },
    ],
    paymentMethod: 'CARD',
    returnUrl: 'https://your-return-url.com',
    authCaptureModePayment: false,
  }

  chargeRequest.signature = signRequest(chargeRequest, securityKey)
  return chargeRequest
}

const FawryHostedCheckout = () => {
  const [error, setError] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const initializePayment = async () => {
    try {
      setLoading(true)
      setError('')

      const merchantCode = import.meta.env.VITE_FAWRY_MERCHANT_CODE
      const securityKey = import.meta.env.VITE_FAWRY_SECURITY_CODE

      if (!merchantCode || !securityKey) {
        throw new Error('Missing merchant code or security key')
      }

      const chargeRequest = buildChargeRequest(merchantCode, securityKey)

      const response = await fetch('https://atfawry.com/fawrypay-api/api/payments/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify(chargeRequest),
      })

      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        const data = await response.json()
        if (data.paymentURL) {
          window.location.href = data.paymentURL
          return
        }
        throw new Error('Invalid JSON response: missing paymentURL')
      }

      const text = await response.text()
      if (text.trim().toLowerCase().startsWith('http')) {
        window.location.href = text.trim()
        return
      }

      throw new Error('Invalid response format from payment gateway')
    } catch (err) {
      console.error('Payment initialization error:', err)
      setError(err instanceof Error ? err.message : 'Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      {error() && <div class='text-red-500 mb-4'>{error()}</div>}

      <Button onClick={initializePayment} class='bg-blue-500 text-white px-4 py-2 rounded' disabled={loading()}>
        {loading() ? 'Initializing Payment...' : 'Pay with Fawry'}
      </Button>
    </div>
  )
}

export default FawryHostedCheckout
