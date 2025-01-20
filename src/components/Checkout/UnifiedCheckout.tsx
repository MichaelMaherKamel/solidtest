// ~/components/Checkout/UnifiedCheckout.tsx
import { Component, createSignal, createMemo, createEffect, Show, type Resource } from 'solid-js'
import { createAsync } from '@solidjs/router'
import { getCart } from '~/db/fetchers/cart'
import { getAddress } from '~/db/fetchers/address'
import StepProgress from './StepProgress'
import CheckoutSummaryItems from './CheckoutSummaryItems'
import type { CartItem, Address } from '~/db/schema'

interface Cart {
  createdAt: Date
  updatedAt: Date
  sessionId: string
  cartId: string
  items: CartItem[]
  lastActive: Date
}

const UnifiedCheckout: Component = () => {
  /* To simulate a delay to check the loading state*/
  //const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  // const cartData = createAsync(async () => {
  //   await delay(5000)
  //   return getCart()
  // }) as Resource<Cart | { items: never[] } | undefined>

  const cartData = createAsync(() => getCart()) as Resource<Cart | { items: never[] } | undefined>

  const addressData = createAsync(() => getAddress()) as Resource<Address | undefined>

  const [activeStep, setActiveStep] = createSignal('cart')
  const [completedSteps, setCompletedSteps] = createSignal<string[]>([''])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = createSignal<string | null>(null)
  const [showSummary, setShowSummary] = createSignal(false)

  const steps = [
    { id: 'cart', title: 'cart.title' },
    { id: 'shipping', title: 'checkout.delivery.information' },
    { id: 'payment', title: 'cart.checkout' },
  ]

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  createEffect(() => {
    if (activeStep()) {
      scrollToTop()
    }
  })

  const isLoading = createMemo(() => {
    try {
      return cartData.state === 'pending' || !cartData() || !addressData()
    } catch {
      return true
    }
  })

  const canActivateStep = (stepId: string) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId)
    const previousSteps = steps.slice(0, stepIndex).map((step) => step.id)
    return previousSteps.every((step) => completedSteps().includes(step))
  }

  const handleNext = (currentStepId: string) => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId)
    if (currentIndex < steps.length - 1) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStepId])])
      setActiveStep(steps[currentIndex + 1].id)
      scrollToTop()
    } else if (currentStepId === 'payment' && selectedPaymentMethod()) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStepId])])
      setShowSummary(true)
      scrollToTop()
    }
  }

  const handleStepBack = (currentStepId: string) => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId)
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id)
      setCompletedSteps((prev) => prev.filter((step) => step !== currentStepId))
      if (currentStepId === 'payment') {
        setSelectedPaymentMethod(null)
      }
      scrollToTop()
    }
  }

  const handlePaymentSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const handleBackToSteps = () => {
    setShowSummary(false)
    setActiveStep('payment')
    scrollToTop()
  }

  const handleConfirmOrder = async () => {
    console.log('Order confirmed:', {
      cart: cartData(),
      address: addressData(),
      paymentMethod: selectedPaymentMethod(),
    })
  }

  return (
    <div class='relative max-w-4xl mx-auto'>
      <Show
        when={!showSummary()}
        fallback={
          <div class='transition-all duration-500 ease-in-out transform'>
            <CheckoutSummaryItems
              items={cartData()?.items ?? []}
              address={addressData()}
              selectedPaymentMethod={selectedPaymentMethod()}
              isLoading={isLoading()}
              onEditOrder={handleBackToSteps}
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        }
      >
        <div class='transition-all duration-500 ease-in-out'>
          <StepProgress
            activeStep={activeStep()}
            completedSteps={completedSteps()}
            canActivateStep={canActivateStep}
            onStepClick={setActiveStep}
            onNext={handleNext}
            onBack={handleStepBack}
            selectedPaymentMethod={selectedPaymentMethod()}
            onPaymentSelect={handlePaymentSelect}
            cartData={cartData}
            addressData={addressData}
          />
        </div>
      </Show>
    </div>
  )
}

export default UnifiedCheckout
