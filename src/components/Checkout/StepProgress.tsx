// ~/components/Checkout/StepProgress.tsx
import { Component, For, Show } from 'solid-js'
import { FiCheck, FiChevronDown, FiArrowLeft, FiArrowRight } from 'solid-icons/fi'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'
import CheckoutCartItems from './CheckoutCartItems'
import CheckoutAddress from './CheckoutAddress'
import { IconCashOnDelivery, IconPayByCard } from '~/components/Icons'
import type { CartResponse } from '~/db/fetchers/cart'
import type { Address } from '~/db/schema'

interface StepProgressProps {
  activeStep: string
  completedSteps: string[]
  canActivateStep: (stepId: string) => boolean
  onStepClick: (stepId: string) => void
  onNext: (currentStepId: string) => void
  onBack: (currentStepId: string) => void
  selectedPaymentMethod: string | null
  onPaymentSelect: (method: string) => void
  cartData?: CartResponse
  addressData?: Address | null
  onAddressUpdate: () => void
}

const StepProgress: Component<StepProgressProps> = (props) => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'

  const steps = [
    { id: 'cart', title: t('checkout.steps.cart') },
    { id: 'shipping', title: t('checkout.steps.shipping') },
    { id: 'payment', title: t('checkout.steps.payment') },
  ]

  const renderStepContent = (stepId: string) => {
    if (stepId === 'cart') {
      return <CheckoutCartItems onNext={() => props.onNext('cart')} />
    }

    if (stepId === 'shipping') {
      return (
        <CheckoutAddress
          onNext={() => props.onNext('shipping')}
          onBack={() => props.onBack('shipping')}
          onAddressUpdate={props.onAddressUpdate}
        />
      )
    }

    if (stepId === 'payment') {
      return (
        <div class='space-y-6'>
          <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Cash on Delivery Option */}
            <Card
              classList={{
                'cursor-pointer transition-all duration-300 ease-out hover:shadow-lg bg-gray-50': true,
                'border-2 border-yellow-400': props.selectedPaymentMethod === 'cash',
                'border border-gray-200': props.selectedPaymentMethod !== 'cash',
              }}
              onClick={() => props.onPaymentSelect('cash')}
            >
              <div class='p-6'>
                <div class='flex items-center gap-4 mb-4'>
                  <div
                    classList={{
                      'transition-transform duration-300': true,
                      'scale-110': props.selectedPaymentMethod === 'cash',
                    }}
                  >
                    <IconCashOnDelivery />
                  </div>
                  <h4 class='font-medium flex-1'>{t('checkout.cashOnDelivery')}</h4>
                </div>
                <p class='text-sm text-gray-500'>{t('checkout.cashOnDeliveryDescription')}</p>
              </div>
            </Card>

            {/* Pay by Fawry Option */}
            <Card
              classList={{
                'cursor-pointer transition-all duration-300 ease-out hover:shadow-lg bg-gray-50': true,
                'border-2 border-yellow-400': props.selectedPaymentMethod === 'card',
                'border border-gray-200': props.selectedPaymentMethod !== 'card',
              }}
              onClick={() => props.onPaymentSelect('card')}
            >
              <div class='p-6'>
                <div class='flex items-center gap-4 mb-4'>
                  <div
                    classList={{
                      'transition-transform duration-300': true,
                      'scale-110': props.selectedPaymentMethod === 'card',
                    }}
                  >
                    <IconPayByCard />
                  </div>
                  <h4 class='font-medium flex-1'>{t('checkout.payByFawry')}</h4>
                </div>
                <p class='text-sm text-gray-500'>{t('checkout.fawryDescription')}</p>
              </div>
            </Card>
          </div>

          {/* Navigation Buttons for Payment Step */}
          <div class='flex flex-col-reverse sm:flex-row justify-between items-center gap-2'>
            <Button
              variant='secondary'
              class='w-full sm:w-auto flex items-center gap-2'
              onClick={() => props.onBack('payment')}
            >
              {isRTL() ? <FiArrowRight class='size-4' /> : <FiArrowLeft class='size-4' />}
              {t('checkout.buttons.backToAddress')}
            </Button>

            <Show when={props.selectedPaymentMethod}>
              <Button
                variant='pay'
                class='w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1'
                onClick={() => props.onNext('payment')}
              >
                <div class='flex items-center gap-2'>
                  {t('checkout.buttons.reviewOrder')}
                  {isRTL() ? <FiArrowLeft class='size-4' /> : <FiArrowRight class='size-4' />}
                </div>
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
        {(step) => {
          const isActive = () => props.activeStep === step.id
          const isCompleted = () =>
            props.completedSteps.includes(step.id) || (step.id === 'payment' && props.selectedPaymentMethod !== null)

          return (
            <Card
              classList={{
                'overflow-hidden transition-all duration-300 ease-out': true,
                'ring-2 ring-primary shadow-md': isActive(),
                'hover:shadow-sm cursor-pointer': props.canActivateStep(step.id),
                'opacity-60': !props.canActivateStep(step.id),
              }}
            >
              <button
                class='w-full px-6 py-4 flex items-center justify-between'
                onClick={() => props.canActivateStep(step.id) && props.onStepClick(step.id)}
                disabled={!props.canActivateStep(step.id)}
              >
                <div class='flex items-center gap-3'>
                  <div
                    classList={{
                      'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300': true,
                      'bg-green-500 text-white scale-110': isCompleted(),
                      'bg-primary text-white': isActive() && !isCompleted(),
                      'bg-gray-100': !isActive() && !isCompleted(),
                    }}
                  >
                    <Show when={isCompleted()} fallback={<span>{steps.indexOf(step) + 1}</span>}>
                      <FiCheck class='size-5' />
                    </Show>
                  </div>
                  <span
                    classList={{
                      'font-medium transition-colors duration-300': true,
                      'text-primary': isActive(),
                      'text-gray-900': !isActive(),
                    }}
                  >
                    {step.title}
                  </span>
                </div>
                <FiChevronDown
                  classList={{
                    'transform transition-transform duration-300': true,
                    'rotate-180 text-primary': isActive(),
                    'text-gray-400': !isActive(),
                  }}
                />
              </button>

              <div
                classList={{
                  'transition-all duration-500 ease-in-out overflow-hidden': true,
                  'opacity-100': isActive(),
                  'max-h-0 opacity-0': !isActive(),
                }}
              >
                <div class='px-6 py-4 border-t'>{renderStepContent(step.id)}</div>
              </div>
            </Card>
          )
        }}
      </For>
    </div>
  )
}

export default StepProgress
