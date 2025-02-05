import { Component, createSignal, createMemo, Show, createResource } from 'solid-js'
import { getCart } from '~/db/fetchers/cart'
import { getAddress } from '~/db/fetchers/address'
import StepProgress from './StepProgress'
import CheckoutSummaryItems from './CheckoutSummaryItems'
import { showToast } from '~/components/ui/toast'
import { useNavigate } from '@solidjs/router'
import { useI18n } from '~/contexts/i18n'

const UnifiedCheckout: Component = () => {
  const [cartResource] = createResource(() => getCart())
  const [addressResource] = createResource(() => getAddress())
  const { t } = useI18n()
  const navigate = useNavigate()

  const [activeStep, setActiveStep] = createSignal('cart')
  const [completedSteps, setCompletedSteps] = createSignal<string[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = createSignal<string | null>(null)
  const [showSummary, setShowSummary] = createSignal(false)

  const steps = [
    { id: 'cart', title: 'cart.title' },
    { id: 'shipping', title: 'checkout.delivery.information' },
    { id: 'payment', title: 'cart.checkout' },
  ]

  const isLoading = createMemo(() => {
    return cartResource.loading || addressResource.loading
  })

  const cartItems = createMemo(() => {
    const cart = cartResource()
    return cart && 'items' in cart ? cart.items : []
  })

  const shippingAddress = createMemo(() => {
    return addressResource()
  })

  const canActivateStep = (stepId: string) => {
    if (stepId === 'cart') return true
    if (stepId === 'shipping') return completedSteps().includes('cart')
    if (stepId === 'payment') return completedSteps().includes('shipping')
    return false
  }

  const handleNext = (currentStepId: string) => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId)
    if (currentIndex < steps.length - 1) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStepId])])
      setActiveStep(steps[currentIndex + 1].id)
    } else if (currentStepId === 'payment' && selectedPaymentMethod()) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStepId])])
      setShowSummary(true)
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
    }
  }

  const handlePaymentSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const handleBackToSteps = () => {
    setShowSummary(false)
    setActiveStep('payment')
  }

  const handleConfirmOrder = async (orderId: string) => {
    try {
      // Show success toast
      showToast({
        variant: 'success',
        title: t('checkout.order.success.title'),
        description: t('checkout.order.success.description'),
      })

      // Navigate to the order details page using the orderId
      navigate(`/orders/${orderId}`) // Redirect to the order details page
    } catch (error) {
      console.error('Error confirming order:', error)
      showToast({
        variant: 'error',
        title: t('checkout.order.error.title'),
        description: t('checkout.order.error.description'),
      })
    }
  }

  return (
    <div class='relative max-w-4xl mx-auto'>
      <Show when={!isLoading()} fallback={<div class='flex justify-center items-center p-8'>Loading...</div>}>
        <Show
          when={!showSummary()}
          fallback={
            <CheckoutSummaryItems
              items={cartItems()}
              address={shippingAddress()}
              selectedPaymentMethod={selectedPaymentMethod()}
              isLoading={isLoading()}
              onEditOrder={handleBackToSteps}
              onConfirmOrder={handleConfirmOrder}
            />
          }
        >
          <StepProgress
            activeStep={activeStep()}
            completedSteps={completedSteps()}
            canActivateStep={canActivateStep}
            onStepClick={setActiveStep}
            onNext={handleNext}
            onBack={handleStepBack}
            selectedPaymentMethod={selectedPaymentMethod()}
            onPaymentSelect={handlePaymentSelect}
            cartData={cartResource}
            addressData={addressResource}
          />
        </Show>
      </Show>
    </div>
  )
}

export default UnifiedCheckout
