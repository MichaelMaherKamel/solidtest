// import { onMount } from 'solid-js'

// // Extend the Window interface to include FawryPay
// declare global {
//   interface Window {
//     FawryPay: any // Declare FawryPay as a property of the global window object
//   }
// }

// // Import CryptoJS for SHA-256 hashing
// import * as CryptoJS from 'crypto-js'

// // Helper function to dynamically load a script and return a Promise
// function loadScript(src: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement('script')
//     script.src = src
//     script.onload = () => resolve()
//     script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
//     document.body.appendChild(script)
//   })
// }

// // Helper function to poll for the existence of FawryPay
// function waitForFawryPay(): Promise<void> {
//   return new Promise((resolve) => {
//     const interval = setInterval(() => {
//       if (window.FawryPay) {
//         clearInterval(interval)
//         resolve()
//       }
//     }, 100) // Check every 100ms
//   })
// }

// // Custom Button Component with Tailwind CSS Styling
// function Button(props) {
//   return (
//     <button
//       class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
//       onClick={props.onClick}
//       disabled={props.disabled}
//     >
//       {props.children}
//     </button>
//   )
// }

// export default function FawryPayComponent() {
//   // Type-safe definitions for the charge request and configuration
//   interface ChargeItem {
//     itemId: string
//     description: string
//     price: number
//     quantity: number
//   }

//   interface ChargeRequest {
//     merchantCode: string
//     merchantRefNum: number
//     customerProfileId: string
//     customerName: string
//     customerMobile: string
//     customerEmail: string
//     paymentExpiry: number
//     chargeItems: ChargeItem[]
//     returnUrl: string
//     paymentMethod: string
//     authCaptureModePayment: boolean
//     description: string
//     secKey: string
//     signature: string
//   }

//   interface Configuration {
//     locale: string
//     mode: string
//   }

//   // Function to generate a random merchant reference number
//   const generateMerchantRefNum = (): number => Math.floor(Math.random() * 100000000 + 1)

//   // Function to calculate the payment expiry timestamp
//   const getPaymentExpiry = (): number => Date.now() + 1 * 60 * 60 * 1000 // 1 hour from now

//   // Function to sign the request using SHA-256 hashing
//   const signRequest = (chargeRequest: Omit<ChargeRequest, 'signature'>): string => {
//     let signString = chargeRequest.merchantCode + chargeRequest.merchantRefNum
//     signString += chargeRequest.customerProfileId ? chargeRequest.customerProfileId : ''
//     signString += chargeRequest.returnUrl ? chargeRequest.returnUrl : ''

//     // Sort charge items by itemId
//     const items = chargeRequest.chargeItems.sort((x, y) => {
//       let a = x.itemId.toUpperCase(),
//         b = y.itemId.toUpperCase()
//       return a == b ? 0 : a > b ? 1 : -1
//     })

//     // Append item details to the signature string
//     items.forEach((item) => {
//       signString += item.itemId + '' + item.quantity + '' + item.price.toFixed(2)
//     })

//     signString += chargeRequest.secKey

//     // Use CryptoJS.SHA256 to hash the signature string
//     return CryptoJS.SHA256(signString).toString(CryptoJS.enc.Hex) // <button class="citation-flag" data-index="9">
//   }

//   // Function to build the charge request object
//   const buildChargeRequest = (): ChargeRequest => {
//     const merchantRefNum = generateMerchantRefNum()
//     const paymentExpiry = getPaymentExpiry()

//     const chargeRequest: Omit<ChargeRequest, 'signature'> = {
//       merchantCode: '770000019702', // Replace with your actual merchant code
//       merchantRefNum: merchantRefNum,
//       customerProfileId: '123',
//       customerName: '',
//       customerMobile: '01234567891',
//       customerEmail: 'Abdelrahman.Salem@Fawry.com',
//       paymentExpiry: paymentExpiry,
//       chargeItems: [
//         {
//           itemId: '10b5f6',
//           description: 'Product 1',
//           price: 400.0,
//           quantity: 2,
//         },
//       ],
//       returnUrl: 'https://developer.fawrystaging.com', // Replace with your actual return URL
//       paymentMethod: '',
//       authCaptureModePayment: false,
//       description: 'test description',
//       secKey: 'c6238f98-16ac-439e-b956-0af980adb7ff', // Replace with your actual secret key
//     }

//     return { ...chargeRequest, signature: signRequest(chargeRequest) }
//   }

//   // Function to handle the checkout process
//   const checkout = async () => {
//     if (!window.FawryPay) {
//       console.error('FawryPay library is not loaded. Waiting for initialization...')
//       try {
//         await waitForFawryPay() // Wait for FawryPay to be initialized
//       } catch (error) {
//         console.error('Failed to initialize FawryPay:', error)
//         return
//       }
//     }

//     const configuration: Configuration = {
//       locale: 'en', // default en
//       mode: 'INSIDE_PAGE', // allowed values: POPUP, INSIDE_PAGE, SIDE_PAGE
//     }

//     window.FawryPay.checkout(buildChargeRequest(), configuration)
//   }

//   // Load FawryPay CSS and JS libraries, as well as CryptoJS for SHA-256 hashing
//   onMount(async () => {
//     try {
//       // Load FawryPay CSS (Production)
//       const fawryPayCSS = document.createElement('link')
//       fawryPayCSS.rel = 'stylesheet'
//       fawryPayCSS.href = 'https://www.atfawry.com/atfawry/plugin/assets/payments/css/fawrypay-payments.css'
//       document.head.appendChild(fawryPayCSS)

//       // Load FawryPay JS (Production)
//       await loadScript('https://www.atfawry.com/atfawry/plugin/assets/payments/js/fawrypay-payments.js')

//       // Wait for FawryPay to be initialized
//       await waitForFawryPay()

//       // Load CryptoJS for SHA-256 hashing
//       await loadScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js')

//       console.log('All scripts loaded successfully.')
//     } catch (error) {
//       console.error('Error loading scripts:', error)
//     }
//   })

//   return (
//     <div class='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
//       <h1 class='text-2xl font-bold mb-4'>FawryPay Checkout Example</h1>
//       <Button onClick={checkout}>Pay with Fawry</Button>
//     </div>
//   )
// }

import { createSignal, onMount } from 'solid-js'

const FawryCheckout = () => {
  const [isSDKLoaded, setIsSDKLoaded] = createSignal(false)
  const [error, setError] = createSignal('')

  // Add a small delay to check FawryPay availability
  const checkFawryPay = () => {
    if ((window as any).FawryPay) {
      console.log('FawryPay SDK detected')
      setIsSDKLoaded(true)
      return true
    }
    return false
  }

  onMount(() => {
    // First check if FawryPay is already available
    if (checkFawryPay()) return

    // If not, load the required scripts
    const shaScript = document.createElement('script')
    shaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js'

    const fawryScript = document.createElement('script')
    fawryScript.src = 'https://www.atfawry.com/atfawry/plugin/assets/payments/js/fawrypay-payments.js'

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://www.atfawry.com/atfawry/plugin/assets/payments/css/fawrypay-payments.css'

    // Add load handlers
    fawryScript.onload = () => {
      console.log('FawryPay script loaded')
      // Add a small delay to ensure FawryPay is initialized
      setTimeout(() => {
        checkFawryPay()
      }, 100)
    }

    shaScript.onload = () => {
      console.log('SHA256 script loaded')
    }

    // Add error handlers
    fawryScript.onerror = () => {
      console.error('Failed to load FawryPay SDK')
      setError('Failed to load payment system')
    }

    shaScript.onerror = () => {
      console.error('Failed to load SHA256 library')
      setError('Failed to load payment system')
    }

    // Append elements to document
    document.head.appendChild(shaScript)
    document.head.appendChild(fawryScript)
    document.head.appendChild(link)
  })

  const signRequest = (request: any) => {
    if (!(window as any).sha256) {
      throw new Error('SHA256 library not loaded')
    }

    let signString = request.merchantCode + request.merchantRefNum
    signString += request.customerProfileId || ''
    signString += request.returnUrl || ''

    const items = [...request.chargeItems].sort((a, b) => (a.itemId.toUpperCase() > b.itemId.toUpperCase() ? 1 : -1))

    items.forEach((item) => {
      signString += `${item.itemId}${item.quantity}${item.price.toFixed(2)}`
    })

    signString += request.secKey
    return (window as any).sha256(signString)
  }

  const buildChargeRequest = () => {
    const merchantRefNum = Math.floor(Math.random() * 100000000 + 1)
    const futureTimestamp = Date.now() + 1 * 60 * 60 * 1000

    const chargeRequest = {
      merchantCode: '770000019702', // Replace with your merchant code
      merchantRefNum: merchantRefNum,
      customerProfileId: '123',
      customerMobile: '01234567891',
      customerEmail: 'user@example.com',
      paymentExpiry: futureTimestamp,
      chargeItems: [
        {
          itemId: '10b5f6',
          description: 'Product 1',
          price: 400.0,
          quantity: 2,
        },
      ],
      returnUrl: 'https://your-return-url.com',
      paymentMethod: '',
      authCaptureModePayment: false,
      description: 'test description',
      secKey: 'c6238f98-16ac-439e-b956-0af980adb7ff', // Replace with your secret key
    }

    return {
      ...chargeRequest,
      signature: signRequest(chargeRequest),
    }
  }

  const handleCheckout = () => {
    if (!isSDKLoaded()) {
      setError('FawryPay SDK is not yet loaded')
      return
    }

    try {
      const configuration = {
        locale: 'en',
        mode: (window as any).DISPLAY_MODE?.SEPERATED || 'SEPERATED',
      }

      ;(window as any).FawryPay.checkout(buildChargeRequest(), configuration)
    } catch (err: any) {
      setError(`Checkout failed: ${err.message}`)
    }
  }

  return (
    <div class='relative'>
      {error() && <div class='text-red-500 mb-4'>{error()}</div>}
      <input
        type='image'
        onClick={handleCheckout}
        src='https://www.atfawry.com/assets/img/FawryPayLogo.jpg'
        alt='Pay using Fawry'
        class='fawry-payment-btn cursor-pointer w-48'
        disabled={!isSDKLoaded()}
      />
      {!isSDKLoaded() && <div class='text-gray-500 mt-2'>Loading payment system...</div>}
    </div>
  )
}

export default FawryCheckout
