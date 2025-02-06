import { Component, Suspense, createEffect, createSignal, createResource, Show } from 'solid-js'
import { useSearchParams, useNavigate } from '@solidjs/router'
import { useI18n } from '~/contexts/i18n'
import { showToast } from '~/components/ui/toast'
import StepProgress from '~/components/Checkout/StepProgress'
import CheckoutSummaryItems from '~/components/Checkout/CheckoutSummaryItems'
import { CheckoutSkeleton } from '~/components/Checkout/CheckoutSkeleton'
import { getCart } from '~/db/fetchers/cart'
import { getAddress } from '~/db/fetchers/address'
import { createOrderAction } from '~/db/actions/order'
import { deleteCart } from '~/db/actions/cart'
import { updateInventoryAfterOrderAction } from '~/db/actions/products'
import { useAction } from '@solidjs/router'
import type { NewOrder } from '~/db/schema'

type CheckoutState = {
  activeStep: string
  completedSteps: string[]
  selectedPaymentMethod: string | null
  showSummary: boolean
}

const CheckoutPage: Component = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useI18n()

  // Actions
  const createOrder = useAction(createOrderAction)
  const clearCartAction = useAction(deleteCart)
  const updateInventory = useAction(updateInventoryAfterOrderAction)

  // Resources
  const [cartData, { refetch: refetchCart }] = createResource(() => getCart())
  const [addressData, { refetch: refetchAddress }] = createResource(() => getAddress())

  // State
  const [state, setState] = createSignal<CheckoutState>({
    activeStep: 'cart',
    completedSteps: [],
    selectedPaymentMethod: null,
    showSummary: false,
  })
  const [isProcessing, setIsProcessing] = createSignal(false)

  // Handle Fawry payment return
  createEffect(() => {
    if (searchParams.type === 'ChargeResponse') {
      setState((prev) => ({ ...prev, showSummary: true }))

      // Retrieve pending order from sessionStorage
      const pendingOrder = sessionStorage.getItem('pending_order')
      if (!pendingOrder) {
        showToast({
          variant: 'destructive',
          title: t('checkout.order.error.title'),
          description: t('checkout.payment.error.noPendingOrder'),
        })
        return
      }

      const { orderNumber, ...orderData } = JSON.parse(pendingOrder)

      if (searchParams.statusCode === '200') {
        handleOrderConfirmation({
          ...orderData,
          orderNumber,
          paymentStatus: 'paid',
          paymentDetails: {
            referenceNumber: searchParams.referenceNumber,
            merchantRefNumber: searchParams.merchantRefNumber,
            cardLastFourDigits: searchParams.cardLastFourDigits,
          },
        })
      } else {
        showToast({
          variant: 'destructive',
          title: t('checkout.order.error.title'),
          description: searchParams.statusDescription || t('checkout.payment.error.description'),
        })
      }

      sessionStorage.removeItem('pending_order')
    }
  })

  const handleOrderConfirmation = async (orderData: NewOrder) => {
    setIsProcessing(true)
    try {
      const result = await createOrder(orderData)

      if (result.success) {
        // Update inventory and clear cart
        await updateInventory(orderData.items)
        await clearCartAction()

        // Show success toast
        showToast({
          variant: 'success',
          title: t('checkout.order.success.title'),
          description: t('checkout.order.success.description'),
        })

        // Navigate to order details
        navigate(`/orders/${result.orderId}`)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Order confirmation failed:', error)
      showToast({
        variant: 'destructive',
        title: t('checkout.order.error.title'),
        description: t('checkout.order.error.description'),
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Step management
  const canActivateStep = (stepId: string) => {
    if (stepId === 'cart') return true
    if (stepId === 'shipping') return state().completedSteps.includes('cart')
    if (stepId === 'payment') return state().completedSteps.includes('shipping')
    return false
  }

  const handleNextStep = async (currentStepId: string) => {
    const steps = ['cart', 'shipping', 'payment']
    const currentIndex = steps.indexOf(currentStepId)

    if (currentStepId === 'shipping') {
      await refetchAddress()
    }

    if (currentIndex < steps.length - 1) {
      setState((prev) => ({
        ...prev,
        completedSteps: [...new Set([...prev.completedSteps, currentStepId])],
        activeStep: steps[currentIndex + 1],
      }))
    } else if (currentStepId === 'payment' && state().selectedPaymentMethod) {
      await refetchAddress()
      setState((prev) => ({ ...prev, showSummary: true }))
    }
  }

  const handleStepBack = (currentStepId: string) => {
    const steps = ['cart', 'shipping', 'payment']
    const currentIndex = steps.indexOf(currentStepId)

    if (currentIndex > 0) {
      setState((prev) => ({
        ...prev,
        activeStep: steps[currentIndex - 1],
        completedSteps: prev.completedSteps.filter((step) => step !== currentStepId),
      }))
    }
  }

  const handlePaymentSelect = (method: string) => {
    setState((prev) => ({ ...prev, selectedPaymentMethod: method }))
  }

  const handleEditOrder = () => {
    setState((prev) => ({
      ...prev,
      showSummary: false,
      activeStep: 'payment',
    }))
  }

  return (
    <div class='container mx-auto'>
      <div class='max-w-3xl mx-auto'>
        <Suspense fallback={<CheckoutSkeleton />}>
          <Show when={!cartData.loading && !addressData.loading}>
            <Show
              when={state().showSummary}
              fallback={
                <StepProgress
                  activeStep={state().activeStep}
                  completedSteps={state().completedSteps}
                  canActivateStep={canActivateStep}
                  onStepClick={(stepId) => setState((prev) => ({ ...prev, activeStep: stepId }))}
                  onNext={handleNextStep}
                  onBack={handleStepBack}
                  selectedPaymentMethod={state().selectedPaymentMethod}
                  onPaymentSelect={handlePaymentSelect}
                  cartData={cartData()}
                  addressData={addressData()}
                  onAddressUpdate={() => refetchAddress()}
                />
              }
            >
              <CheckoutSummaryItems
                items={cartData()?.items || []}
                address={addressData()}
                selectedPaymentMethod={state().selectedPaymentMethod}
                isLoading={isProcessing()}
                onEditOrder={handleEditOrder}
                onConfirmOrder={handleOrderConfirmation}
              />
            </Show>
          </Show>
        </Suspense>
      </div>
    </div>
  )
}

export default CheckoutPage
