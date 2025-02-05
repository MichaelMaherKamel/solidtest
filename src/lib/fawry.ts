type FawryPaymentRequest = {
  merchantCode: string
  merchantRefNum: string
  customer: {
    name: string
    mobile: string
    email?: string
  }
  paymentAmount: number
  currencyCode: string
  language: string
  chargeItems: Array<{
    itemId: string
    description: string
    price: number
    quantity: number
  }>
  returnUrl: string
  authCaptureMode: boolean
}

type CardTokenizationRequest = {
  merchantCode: string
  customerProfileId: string
  customerMobile: string
  customerEmail?: string
  cardNumber: string
  expiryYear: string
  expiryMonth: string
  cvv: string
}

export const createFawryPayment = async (paymentData: FawryPaymentRequest) => {
  const fawryEndpoint = process.env.FAWRY_BASE_URL + '/payments/charge'

  const response = await fetch(fawryEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FAWRY_SECRET_KEY}`,
    },
    body: JSON.stringify({
      ...paymentData,
      signature: generateFawrySignature(paymentData),
    }),
  })

  if (!response.ok) throw new Error('Fawry payment failed')
  return response.json()
}

export const createCardToken = async (tokenData: CardTokenizationRequest) => {
  const tokenEndpoint = process.env.FAWRY_BASE_URL + '/cards/token'

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FAWRY_SECRET_KEY}`,
    },
    body: JSON.stringify({
      ...tokenData,
      signature: generateTokenSignature(tokenData),
    }),
  })

  if (!response.ok) throw new Error('Token creation failed')
  return response.json()
}

// Helper function to generate Fawry signature
const generateFawrySignature = (paymentData: FawryPaymentRequest) => {
  const values = [
    paymentData.merchantCode,
    paymentData.merchantRefNum,
    paymentData.customer.name,
    paymentData.paymentAmount.toString(),
    process.env.FAWRY_SECRET_KEY,
  ]
  return hashHex(values.join(''))
}

// Helper function for token signature
const generateTokenSignature = (tokenData: CardTokenizationRequest) => {
  const values = [
    tokenData.merchantCode,
    tokenData.customerProfileId,
    tokenData.cardNumber,
    process.env.FAWRY_SECRET_KEY,
  ]
  return hashHex(values.join(''))
}

const hashHex = async (data: string) => {
  // Implementation using Web Crypto API
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  return crypto.subtle.digest('SHA-256', dataBuffer).then((hash) => {
    const hexArray = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0'))
    return hexArray.join('')
  })
}

export const verifyFawryPayment = async (merchantRefNum: string) => {
  const verifyEndpoint = `${process.env.FAWRY_BASE_URL}/payments/${merchantRefNum}/status`

  const response = await fetch(verifyEndpoint, {
    headers: {
      Authorization: `Bearer ${process.env.FAWRY_SECRET_KEY}`,
    },
  })

  if (!response.ok) throw new Error('Payment verification failed')
  const data = await response.json()

  return {
    success: data.paymentStatus === 'PAID',
    status: data.paymentStatus,
    reference: data.referenceNumber,
  }
}
