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
  signature?: string // Optional property for the signature
}

const FawryHostedCheckout = () => {
  const [error, setError] = createSignal('') // Tracks errors

  // Function to generate the signature using SHA-256 hashing
  const signRequest = (chargeRequest: ChargeRequest, securityKey: string): string => {
    let signString = chargeRequest.merchantCode + chargeRequest.merchantRefNum
    signString += chargeRequest.customerProfileId || ''
    signString += chargeRequest.returnUrl || ''

    // Sort charge items by itemId
    const items = [...chargeRequest.chargeItems].sort((a, b) =>
      a.itemId.toUpperCase() > b.itemId.toUpperCase() ? 1 : -1
    )

    // Append item details to the signature string
    items.forEach((item) => {
      signString += `${item.itemId}${item.quantity}${item.price.toFixed(2)}`
    })

    signString += securityKey

    // Use CryptoJS for SHA-256 hashing
    return CryptoJS.SHA256(signString).toString(CryptoJS.enc.Hex)
  }

  // Function to build the charge request object
  const buildChargeRequest = (merchantCode: string, securityKey: string): ChargeRequest => {
    const merchantRefNum = Math.floor(Math.random() * 100000000 + 1).toString()
    const futureTimestamp = Date.now() + 1 * 60 * 60 * 1000 // 1 hour from now

    const chargeRequest: ChargeRequest = {
      merchantCode: merchantCode,
      merchantRefNum: merchantRefNum,
      customerMobile: '01xxxxxxxxx', // Replace with actual customer mobile
      customerEmail: 'email@domain.com', // Replace with actual customer email
      customerName: 'Customer Name', // Replace with actual customer name
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
      paymentMethod: 'PayAtFawry',
      returnUrl: 'https://your-return-url.com', // Replace with your actual return URL
      authCaptureModePayment: false,
    }

    // Generate the signature
    chargeRequest.signature = signRequest(chargeRequest, securityKey)

    return chargeRequest
  }

  // Function to handle the checkout process
  const handleCheckout = async () => {
    try {
      // Retrieve sensitive data from environment variables
      const merchantCode = import.meta.env.VITE_FAWRY_MERCHANT_CODE
      const securityKey = import.meta.env.VITE_FAWRY_SECURITY_CODE

      // Build the charge request
      const chargeRequest = buildChargeRequest(merchantCode, securityKey)

      // Log the request for debugging
      console.log('Sending request to Fawry:', JSON.stringify(chargeRequest, null, 2))

      // Call Fawry API
      const apiUrl = 'https://atfawry.com/fawrypay-api/api/payments/init'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chargeRequest),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('FawryPay API Response:', data)

      // Redirect to the payment URL
      if (data.paymentURL) {
        window.location.href = data.paymentURL // Redirect to the payment page <button class="citation-flag" data-index="10">
      } else {
        setError('Payment URL not found in API response.')
      }
    } catch (err) {
      console.error('Error during checkout:', err)
      setError('Failed to initiate payment. Please try again.')
    }
  }

  return (
    <div class='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      {error() && <div class='text-red-500 mb-4'>{error()}</div>}
      <Button onClick={handleCheckout} class='bg-blue-500 text-white px-4 py-2 rounded'>
        Pay with Fawry
      </Button>
    </div>
  )
}

export default FawryHostedCheckout
