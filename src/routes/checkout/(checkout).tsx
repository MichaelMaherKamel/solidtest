// CheckoutPage.tsx
import { Component, createSignal, Show } from 'solid-js'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { useI18n } from '~/contexts/i18n'
import StepProgress from '~/components/Checkout/StepProgress'
import { FiPackage, FiMapPin, FiPhone, FiUser } from 'solid-icons/fi'
import { FaSolidMapPin } from 'solid-icons/fa'

const CheckoutPage: Component = () => {
  const { t } = useI18n()

  const [activeStep, setActiveStep] = createSignal('cart')
  const [completedSteps, setCompletedSteps] = createSignal([''])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = createSignal<string | null>(null)
  const [showSummary, setShowSummary] = createSignal(false)

  const steps = [
    { id: 'cart', title: t('cart.title') },
    { id: 'shipping', title: t('checkout.delivery.information') },
    { id: 'payment', title: t('cart.checkout') },
  ]

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
    } else if (currentStepId === 'payment' && selectedPaymentMethod()) {
      // If we're on the payment step and have a payment method selected
      setCompletedSteps((prev) => [...new Set([...prev, currentStepId])])
      setShowSummary(true) // Show the summary view
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

  return (
    <>
      {/* Steps Section */}
      <div
        class={`transition-all duration-500 ease-in-out
          ${
            showSummary() ? 'opacity-0 transform translate-y-4 pointer-events-none hidden' : 'opacity-100 translate-y-0'
          }`}
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
        />
      </div>

      {/* Summary Card */}
      <Show when={showSummary()}>
        <div
          class={`transition-all duration-500 ease-in-out transform
      ${showSummary() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <Card class='overflow-hidden shadow-lg'>
            <div class='p-6 space-y-6'>
              <h2 class='text-xl font-semibold'>{t('checkout.orderReview.title')}</h2>

              {/* Order Items */}
              <div class='space-y-4'>
                <h3 class='font-medium text-gray-700 flex items-center gap-2'>
                  <FiPackage />
                  <span>{t('checkout.orderReview.items')}</span>
                </h3>
                <div class='bg-gray-50 rounded-lg p-4 space-y-3'>
                  <div class='flex items-center justify-between'>
                    <div class='flex items-center gap-3'>
                      <div class='w-12 h-12 bg-gray-200 rounded-md'></div>
                      <div>
                        <p class='font-medium'>Product Name</p>
                        <p class='text-sm text-gray-500'>Quantity: 1</p>
                      </div>
                    </div>
                    <span class='font-medium'>{t('currency', { value: 99.0 })}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div class='space-y-4'>
                <h3 class='font-medium text-gray-700 flex items-center gap-2'>
                  <FiMapPin />
                  <span>{t('checkout.orderReview.deliveryDetails')}</span>
                </h3>
                <div class='bg-gray-50 rounded-lg p-4 space-y-2'>
                  <div class='flex items-center gap-2 text-gray-600'>
                    <FiUser class='flex-shrink-0' />
                    <span>John Doe</span>
                  </div>
                  <div class='flex items-center gap-2 text-gray-600'>
                    <FiPhone class='flex-shrink-0' />
                    <span>+20 123 456 7890</span>
                  </div>
                  <div class='flex items-center gap-2 text-gray-600'>
                    <FaSolidMapPin class='flex-shrink-0' />
                    <p class='text-gray-600'>123 Main St, Cairo, Egypt</p>
                  </div>
                </div>
              </div>

              {/* Order Total */}
              <div class='space-y-3 pt-3'>
                <div class='flex justify-between text-sm'>
                  <span class='text-muted-foreground'>{t('checkout.orderReview.subtotal')}</span>
                  <span>{t('currency', { value: 99.0 })}</span>
                </div>
                <div class='flex justify-between text-sm'>
                  <span class='text-muted-foreground'>{t('checkout.orderReview.shippingCost')}</span>
                  <span>{t('currency', { value: 10.0 })}</span>
                </div>
                <Separator />
                <div class='flex justify-between text-lg font-medium'>
                  <span>{t('checkout.orderReview.total')}</span>
                  <span>{t('currency', { value: 109.0 })}</span>
                </div>
              </div>

              {/* Selected Payment Method */}
              <div class='bg-gray-50 rounded-lg p-4'>
                <div class='flex items-center justify-between text-sm'>
                  <span class='text-gray-600'>{t('checkout.paymentMethod')}</span>
                  <span class='font-medium'>
                    {selectedPaymentMethod() === 'cod' ? t('checkout.cashOnDelivery') : t('checkout.payByFawry')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div class='space-y-3 pt-4'>
                <Button variant='pay' class='w-full transform transition-all duration-300 hover:scale-[1.02]' size='lg'>
                  {selectedPaymentMethod() === 'cod'
                    ? t('checkout.orderReview.buttons.confirmCod')
                    : t('checkout.orderReview.buttons.confirmFawry')}
                </Button>
                <Button variant='outline' class='w-full transition-colors duration-300' onClick={handleBackToSteps}>
                  {t('checkout.orderReview.buttons.editOrder')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Show>
    </>
  )
}

export default CheckoutPage
