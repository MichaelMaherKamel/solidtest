// ~/components/Checkout/StepProgress.tsx
import { Component, For, Show, createSignal, Switch, Match } from 'solid-js'
import { FiCheck, FiChevronDown, FiTruck, FiCreditCard, FiArrowLeft, FiShoppingCart } from 'solid-icons/fi'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'
import { createAsync, useAction } from '@solidjs/router'
import { getCart } from '~/db/fetchers/cart'
import { updateCartItemQuantity, removeCartItem } from '~/db/actions/cart'
import { Skeleton } from '~/components/ui/skeleton'
import CheckoutCartItems from './CheckoutCartItems'
import CheckoutAddress from './CheckoutAddress'

interface StepProgressProps {
  activeStep: string
  completedSteps: string[]
  canActivateStep: (stepId: string) => boolean
  onStepClick: (stepId: string) => void
  onNext: (currentStepId: string) => void
  onBack: (currentStepId: string) => void
  selectedPaymentMethod: string | null
  onPaymentSelect: (method: string) => void
}

const StepProgress: Component<StepProgressProps> = (props) => {
  const { t } = useI18n()
  const cartData = createAsync(() => getCart())
  const updateQuantity = useAction(updateCartItemQuantity)
  const removeItem = useAction(removeCartItem)

  const [itemStates, setItemStates] = createSignal<Record<string, { isUpdating: boolean; isRemoving: boolean }>>({})

  const steps = [
    { id: 'cart', title: t('checkout.steps.cart') },
    { id: 'shipping', title: t('checkout.steps.shipping') },
    { id: 'payment', title: t('checkout.steps.payment') },
  ]

  // Cart operations
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(productId)
        return
      }

      setItemStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isUpdating: true },
      }))

      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('quantity', newQuantity.toString())

      const result = await updateQuantity(formData)
      if (!result.success) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert(t('cart.error'))
    } finally {
      setTimeout(() => {
        setItemStates((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], isUpdating: false },
        }))
      }, 300)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      setItemStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isRemoving: true },
      }))

      const formData = new FormData()
      formData.append('productId', productId)

      await new Promise((resolve) => setTimeout(resolve, 300))
      const result = await removeItem(formData)
      if (!result.success) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error removing item:', error)
      alert(t('cart.error'))
    }
  }

  const renderStepContent = (stepId: string, index: () => number) => {
    if (stepId === 'cart') {
      return <CheckoutCartItems onNext={props.onNext} />
    }

    if (stepId === 'shipping') {
      return <CheckoutAddress onNext={props.onNext} onBack={props.onBack} />
    }

    if (stepId === 'payment') {
      return (
        <div class='space-y-6'>
          <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card
              class={`group cursor-pointer transition-all duration-300 ease-out bg-gray-50 
                ${
                  props.selectedPaymentMethod === 'cod'
                    ? 'ring-2 ring-primary shadow-lg translate-y-0'
                    : 'hover:-translate-y-1 hover:shadow-md'
                }`}
              onClick={() => props.onPaymentSelect('cod')}
            >
              <div class='p-6 flex items-start gap-4'>
                <div
                  class={`rounded-full p-3 transition-all duration-300 ${
                    props.selectedPaymentMethod === 'cod'
                      ? 'bg-primary text-white scale-110'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}
                >
                  <FiTruck class='w-6 h-6' />
                </div>
                <div class='flex-1'>
                  <div class='flex items-center justify-between'>
                    <h4 class='font-medium'>{t('checkout.cashOnDelivery')}</h4>
                    <div
                      class={`w-4 h-4 rounded-full border-2 transition-all duration-300 
                      ${props.selectedPaymentMethod === 'cod' ? 'border-primary bg-primary' : 'border-gray-300'}`}
                    />
                  </div>
                  <p class='mt-1 text-sm text-gray-500'>{t('checkout.cashOnDeliveryDescription')}</p>
                </div>
              </div>
            </Card>

            <Card
              class={`group cursor-pointer transition-all duration-300 ease-out bg-gray-50
                ${
                  props.selectedPaymentMethod === 'fawry'
                    ? 'ring-2 ring-primary shadow-lg translate-y-0'
                    : 'hover:-translate-y-1 hover:shadow-md'
                }`}
              onClick={() => props.onPaymentSelect('fawry')}
            >
              <div class='p-6 flex items-start gap-4'>
                <div
                  class={`rounded-full p-3 transition-all duration-300 
                  ${
                    props.selectedPaymentMethod === 'fawry'
                      ? 'bg-primary text-white scale-110'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}
                >
                  <FiCreditCard class='w-6 h-6' />
                </div>
                <div class='flex-1'>
                  <div class='flex items-center justify-between'>
                    <h4 class='font-medium'>{t('checkout.payByFawry')}</h4>
                    <div
                      class={`w-4 h-4 rounded-full border-2 transition-all duration-300 
                      ${props.selectedPaymentMethod === 'fawry' ? 'border-primary bg-primary' : 'border-gray-300'}`}
                    />
                  </div>
                  <p class='mt-1 text-sm text-gray-500'>{t('checkout.fawryDescription')}</p>
                </div>
              </div>
            </Card>
          </div>

          <div class='flex flex-col-reverse sm:flex-row justify-between items-center gap-2'>
            <Button
              variant='ghost'
              class='w-full sm:w-auto flex items-center gap-2'
              onClick={() => props.onBack('payment')}
            >
              <FiArrowLeft class='w-4 h-4' />
              {t('checkout.buttons.backToAddress')}
            </Button>

            <Show when={props.selectedPaymentMethod}>
              <Button
                variant='pay'
                class='w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1'
                onClick={() => props.onNext('payment')}
              >
                {t('checkout.buttons.reviewOrder')}
              </Button>
            </Show>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div class='space-y-6'>
      <For each={steps}>
        {(step, index) => {
          const isActive = () => props.activeStep === step.id
          const isCompleted = () =>
            props.completedSteps.includes(step.id) || (step.id === 'payment' && props.selectedPaymentMethod !== null)

          return (
            <Card
              class={`overflow-hidden transition-all duration-300 ease-out
                ${
                  isActive()
                    ? 'ring-2 ring-primary shadow-md'
                    : props.canActivateStep(step.id)
                    ? 'hover:shadow-sm cursor-pointer'
                    : 'opacity-60'
                }`}
            >
              <button
                class='w-full px-6 py-4 flex items-center justify-between'
                onClick={() => props.canActivateStep(step.id) && props.onStepClick(step.id)}
                disabled={!props.canActivateStep(step.id)}
              >
                <div class='flex items-center gap-3'>
                  <div
                    class={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 
                    ${
                      isCompleted()
                        ? 'bg-green-500 text-white scale-110'
                        : isActive()
                        ? 'bg-primary text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Show when={isCompleted()} fallback={<span>{index() + 1}</span>}>
                      <FiCheck class='w-5 h-5' />
                    </Show>
                  </div>
                  <span
                    class={`font-medium transition-colors duration-300 ${
                      isActive() ? 'text-primary' : 'text-gray-900'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <FiChevronDown
                  class={`transform transition-all duration-300 ${
                    isActive() ? 'rotate-180 text-primary' : 'text-gray-400'
                  }`}
                />
              </button>

              <div
                class={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isActive() ? 'opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div class='px-6 py-4 border-t'>{renderStepContent(step.id, index)}</div>
              </div>
            </Card>
          )
        }}
      </For>
    </div>
  )
}

export default StepProgress
