// StepProgress.tsx
import { Component, For, Show } from 'solid-js'
import { FiCheck, FiChevronDown, FiTruck, FiCreditCard, FiArrowLeft } from 'solid-icons/fi'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'

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

  const steps = [
    { id: 'cart', title: t('cart.title') },
    { id: 'shipping', title: t('checkout.delivery.information') },
    { id: 'payment', title: t('cart.checkout') },
  ]

  const renderStepContent = (stepId: string, index: () => number) => {
    if (stepId === 'cart') {
      return (
        <div class='space-y-6'>
          <div class='bg-white rounded-lg p-6'>
            {/* Cart Items List */}
            <div class='space-y-4 bg-gray-50'>
              <div class='flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow'>
                <div class='flex items-center gap-4'>
                  <div class='w-16 h-16 bg-gray-100 rounded-md'></div>
                  <div>
                    <h3 class='font-medium'>Product Name</h3>
                    <p class='text-sm text-gray-500'>Quantity: 1</p>
                  </div>
                </div>
                <span class='font-medium'>$99.00</span>
              </div>
            </div>

            {/* Cart Actions */}
            <div class='mt-6 flex flex-col sm:flex-row sm:justify-end gap-2'>
              <Button
                variant='pay'
                class='w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1'
                onClick={() => props.onNext(stepId)}
              >
                {t('checkout.continueToShipping')}
              </Button>
            </div>
          </div>
        </div>
      )
    }

    if (stepId === 'shipping') {
      return (
        <div class='space-y-6'>
          <Card class='overflow-hidden'>
            <div class='p-6 bg-gray-50'>
              {/* Shipping Form */}
              <div class='space-y-4'>
                <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div class='space-y-2'>
                    <label class='text-sm font-medium'>{t('checkout.firstName')}</label>
                    <input
                      type='text'
                      class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    />
                  </div>
                  <div class='space-y-2'>
                    <label class='text-sm font-medium'>{t('checkout.lastName')}</label>
                    <input
                      type='text'
                      class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    />
                  </div>
                </div>

                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('checkout.address')}</label>
                  <input
                    type='text'
                    class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                </div>

                <div class='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div class='space-y-2'>
                    <label class='text-sm font-medium'>{t('checkout.city')}</label>
                    <input
                      type='text'
                      class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    />
                  </div>
                  <div class='space-y-2'>
                    <label class='text-sm font-medium'>{t('checkout.state')}</label>
                    <input
                      type='text'
                      class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    />
                  </div>
                  <div class='space-y-2'>
                    <label class='text-sm font-medium'>{t('checkout.zipCode')}</label>
                    <input
                      type='text'
                      class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    />
                  </div>
                </div>

                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('checkout.phone')}</label>
                  <input
                    type='tel'
                    class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div class='mt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-2'>
                <Button
                  variant='ghost'
                  class='w-full sm:w-auto flex items-center gap-2'
                  onClick={() => props.onBack(stepId)}
                >
                  <FiArrowLeft class='w-4 h-4' />
                  {t('checkout.backToCart')}
                </Button>

                <Button
                  variant='pay'
                  class='w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1'
                  onClick={() => props.onNext(stepId)}
                >
                  {t('checkout.continueToPayment')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    if (stepId === 'payment') {
      return (
        <div class='space-y-6'>
          <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Cash on Delivery Card */}
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
                  class={`rounded-full p-3 transition-all duration-300 
                    ${
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
                        ${
                          props.selectedPaymentMethod === 'cod'
                            ? 'border-primary bg-primary scale-110'
                            : 'border-gray-300'
                        }`}
                    />
                  </div>
                  <p class='mt-1 text-sm text-gray-500'>{t('checkout.cashOnDeliveryDescription')}</p>
                </div>
              </div>
            </Card>

            {/* Fawry Payment Card */}
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
                        ${
                          props.selectedPaymentMethod === 'fawry'
                            ? 'border-primary bg-primary scale-110'
                            : 'border-gray-300'
                        }`}
                    />
                  </div>
                  <p class='mt-1 text-sm text-gray-500'>{t('checkout.fawryDescription')}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div class='flex flex-col sm:flex-row justify-between items-center gap-2'>
            <Button
              variant='ghost'
              class='w-full sm:w-auto flex items-center gap-2'
              onClick={() => props.onBack(stepId)}
            >
              <FiArrowLeft class='w-4 h-4' />
              {t('checkout.backToShipping')}
            </Button>
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
                    class={`font-medium transition-colors duration-300 
                    ${isActive() ? 'text-primary' : 'text-gray-900'}`}
                  >
                    {step.title}
                  </span>
                </div>
                <FiChevronDown
                  class={`transform transition-all duration-300 
                    ${isActive() ? 'rotate-180 text-primary' : 'text-gray-400'}`}
                />
              </button>

              <div
                class={`transition-all duration-500 ease-in-out overflow-hidden
                  ${isActive() ? 'opacity-100' : 'max-h-0 opacity-0'}`}
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
