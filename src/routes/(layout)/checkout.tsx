import { Component, createSignal, createMemo, Show, For } from 'solid-js'
import { useNavigate, useAction, createAsync } from '@solidjs/router'
import { useI18n } from '~/contexts/i18n'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Separator } from '~/components/ui/separator'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { getCart } from '~/db/fetchers/cart'
import { getAddress } from '~/db/fetchers/address'
import { createAddressAction, updateAddressAction } from '~/db/actions/address'
import { updateCartItemQuantity, removeCartItem } from '~/db/actions/cart'
import { FiPlus, FiMinus, FiTrash2, FiShield, FiLock, FiCreditCard, FiPackage, FiEdit2 } from 'solid-icons/fi'

const CheckoutPage: Component = () => {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const isRTL = () => locale() === 'ar'

  // State management
  const [openSection, setOpenSection] = createSignal(['cart'])
  const [activeStep, setActiveStep] = createSignal(1)
  const [isEditingAddress, setIsEditingAddress] = createSignal(false)
  const [paymentMethod, setPaymentMethod] = createSignal('cod')
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  // Data fetching
  const cartData = createAsync(() => getCart())
  const addressData = createAsync(() => getAddress())
  const updateQuantity = useAction(updateCartItemQuantity)
  const removeItem = useAction(removeCartItem)
  const createAddress = useAction(createAddressAction)
  const updateAddress = useAction(updateAddressAction)

  // Progress tracking
  const steps = [
    { id: 'cart', label: t('checkout.cartReview') },
    { id: 'address', label: t('checkout.shippingAddress') },
    { id: 'payment', label: t('checkout.payment') },
  ]

  const progress = createMemo(() => {
    const currentIndex = steps.findIndex((step) => !openSection().includes(step.id))
    return currentIndex === -1 ? 100 : (currentIndex / steps.length) * 100
  })

  // Cart calculations
  const subtotal = createMemo(() => {
    return cartData()?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
  })

  const estimatedTax = createMemo(() => {
    return Math.round(subtotal() * 0.14) // 14% VAT
  })

  const total = createMemo(() => {
    return subtotal() + estimatedTax()
  })

  // Event handlers
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    setError(null)
    try {
      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('quantity', newQuantity.toString())
      await updateQuantity(formData)
    } catch (error) {
      setError(t('checkout.errors.updateQuantity'))
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setError(null)
    try {
      const formData = new FormData()
      formData.append('productId', productId)
      await removeItem(formData)
    } catch (error) {
      setError(t('checkout.errors.removeItem'))
    }
  }

  const handleAddressSubmit = async (event: Event) => {
    event.preventDefault()
    setError(null)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      if (addressData() && !isEditingAddress()) {
        const result = await updateAddress(formData)
        if (result.success) {
          setIsEditingAddress(false)
          setOpenSection((prev) => [...prev, 'payment'])
          setActiveStep(3)
        } else {
          setError(result.error)
        }
      } else {
        const result = await createAddress(formData)
        if (result.success) {
          setIsEditingAddress(false)
          setOpenSection((prev) => [...prev, 'payment'])
          setActiveStep(3)
        } else {
          setError(result.error)
        }
      }
    } catch (error) {
      setError(t('checkout.errors.address'))
    }
  }

  const handleCheckout = async () => {
    setError(null)
    setIsSubmitting(true)

    try {
      if (!addressData()) {
        throw new Error(t('checkout.errors.noAddress'))
      }

      if (!paymentMethod()) {
        throw new Error(t('checkout.errors.noPayment'))
      }

      // Simulated checkout process
      await new Promise((resolve) => setTimeout(resolve, 1500))
      navigate('/checkout/success')
    } catch (error) {
      setError(error instanceof Error ? error.message : t('checkout.errors.general'))
      setIsSubmitting(false)
    }
  }

  return (
    <div class='min-h-screen py-8 bg-gray-50' dir={isRTL() ? 'rtl' : 'ltr'}>
      <div class='max-w-6xl mx-auto px-4'>
        {/* Progress Bar */}
        <div class='mb-8'>
          <div class='flex items-center justify-between mb-4'>
            <h1 class='text-2xl font-semibold'>{t('checkout.title')}</h1>
            <div class='flex items-center gap-2'>
              <FiShield class='text-green-600' />
              <span class='text-sm text-gray-600'>{t('checkout.secureCheckout')}</span>
            </div>
          </div>

          {/* Steps */}
          <div class='relative pt-1'>
            <div class='flex mb-2 items-center justify-between'>
              <For each={steps}>
                {(step, index) => (
                  <div class='flex items-center gap-2'>
                    <span
                      class={`text-xs font-semibold inline-block py-1 px-2 rounded-full
                        ${openSection().includes(step.id) ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                      {index() + 1}
                    </span>
                    <span class='text-sm'>{step.label}</span>
                  </div>
                )}
              </For>
            </div>
            <div class='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200'>
              <div
                style={{ width: `${progress()}%` }}
                class='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500'
              />
            </div>
          </div>

          {/* Error Display */}
          <Show when={error()}>
            <Alert variant='destructive' class='mb-4'>
              <AlertDescription>{error()}</AlertDescription>
            </Alert>
          </Show>
        </div>

        <div class='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main checkout flow */}
          <div class='lg:col-span-2'>
            <Accordion value={openSection()} onChange={setOpenSection} class='space-y-4'>
              {/* Cart Review Section */}
              <AccordionItem value='cart'>
                <AccordionTrigger class='bg-white p-4 rounded-lg hover:no-underline'>
                  <div class='flex items-center gap-2'>
                    <span class='size-6 rounded-full bg-primary text-white flex items-center justify-center text-sm'>
                      1
                    </span>
                    <span class='font-medium'>{t('checkout.cartReview')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent class='mt-4'>
                  <Card class='p-4'>
                    <Show
                      when={cartData()?.items.length}
                      fallback={
                        <div class='text-center py-8'>
                          <FiPackage class='h-12 w-12 mx-auto text-gray-400 mb-4' />
                          <div class='text-gray-500'>{t('cart.empty')}</div>
                          <Button variant='outline' class='mt-4' onClick={() => navigate('/shopping')}>
                            {t('cart.continueShopping')}
                          </Button>
                        </div>
                      }
                    >
                      <div class='space-y-4'>
                        <For each={cartData()?.items}>
                          {(item) => (
                            <div class='flex gap-4 py-4 border-b last:border-0'>
                              <div class='w-20 h-20 bg-gray-100 rounded'>
                                <img src={item.image} alt={item.name} class='w-full h-full object-cover rounded' />
                              </div>
                              <div class='flex-1'>
                                <h3 class='font-medium'>{item.name}</h3>
                                <div class='flex items-center gap-4 mt-2'>
                                  <div class='flex items-center border rounded-md'>
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      title={t('cart.decrease')}
                                    >
                                      <FiMinus class='h-4 w-4' />
                                    </Button>
                                    <span class='px-4'>{item.quantity}</span>
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                      title={t('cart.increase')}
                                    >
                                      <FiPlus class='h-4 w-4' />
                                    </Button>
                                  </div>
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    class='text-red-500'
                                    onClick={() => handleRemoveItem(item.productId)}
                                    title={t('cart.remove')}
                                  >
                                    <FiTrash2 class='h-4 w-4' />
                                  </Button>
                                </div>
                                <div class='mt-2 font-medium'>
                                  {t('currency', { value: item.price * item.quantity })}
                                </div>
                              </div>
                            </div>
                          )}
                        </For>

                        <Separator />

                        <div class='pt-4'>
                          <Button
                            class='w-full'
                            onClick={() => {
                              setOpenSection((prev) => [...prev, 'address'])
                              setActiveStep(2)
                            }}
                          >
                            {t('checkout.continueToAddress')}
                          </Button>
                        </div>
                      </div>
                    </Show>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              {/* Address Section */}
              <AccordionItem value='address'>
                <AccordionTrigger class='bg-white p-4 rounded-lg hover:no-underline'>
                  <div class='flex items-center gap-2'>
                    <span class='size-6 rounded-full bg-primary text-white flex items-center justify-center text-sm'>
                      2
                    </span>
                    <span class='font-medium'>{t('checkout.shippingAddress')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent class='mt-4'>
                  <Card class='p-4'>
                    <Show
                      when={addressData() && !isEditingAddress()}
                      fallback={
                        <form onSubmit={handleAddressSubmit} class='space-y-4'>
                          <h3 class='font-medium'>
                            {addressData() ? t('checkout.editAddress') : t('checkout.newAddress')}
                          </h3>
                          <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div class='space-y-2'>
                              <Label for='name'>{t('address.name')}</Label>
                              <Input
                                id='name'
                                name='name'
                                required
                                value={addressData()?.name || ''}
                                placeholder={t('address.namePlaceholder')}
                                class={isRTL() ? 'text-right' : ''}
                              />
                            </div>
                            <div class='space-y-2'>
                              <Label for='email'>{t('address.email')}</Label>
                              <Input
                                id='email'
                                name='email'
                                type='email'
                                required
                                value={addressData()?.email || ''}
                                placeholder={t('address.emailPlaceholder')}
                                class={isRTL() ? 'text-right' : ''}
                              />
                            </div>
                            <div class='space-y-2'>
                              <Label for='phone'>{t('address.phone')}</Label>
                              <Input
                                id='phone'
                                name='phone'
                                required
                                value={addressData()?.phone || ''}
                                placeholder={t('address.phonePlaceholder')}
                                class={isRTL() ? 'text-right' : ''}
                              />
                            </div>
                            <div class='space-y-2'>
                              <Label for='district'>{t('address.district')}</Label>
                              <Input
                                id='district'
                                name='district'
                                required
                                value={addressData()?.district || ''}
                                placeholder={t('address.districtPlaceholder')}
                                class={isRTL() ? 'text-right' : ''}
                              />
                            </div>
                            <div class='space-y-2'>
                              <Label for='buildingNumber'>{t('address.buildingNumber')}</Label>
                              <Input
                                id='buildingNumber'
                                name='buildingNumber'
                                type='number'
                                required
                                min='1'
                                value={addressData()?.buildingNumber || ''}
                                class={isRTL() ? 'text-right' : ''}
                              />
                            </div>
                            <div class='space-y-2'>
                              <Label for='flatNumber'>{t('address.flatNumber')}</Label>
                              <Input
                                id='flatNumber'
                                name='flatNumber'
                                type='number'
                                required
                                min='1'
                                value={addressData()?.flatNumber || ''}
                                class={isRTL() ? 'text-right' : ''}
                              />
                            </div>
                            <div class='md:col-span-2 space-y-2'>
                              <Label for='address'>{t('address.streetAddress')}</Label>
                              <Input
                                id='address'
                                name='address'
                                required
                                value={addressData()?.address || ''}
                                placeholder={t('address.streetAddressPlaceholder')}
                                class={isRTL() ? 'text-right' : ''}
                              />
                            </div>
                          </div>
                          <Separator class='my-6' />
                          <div class='flex justify-end gap-4'>
                            <Show when={addressData()}>
                              <Button type='button' variant='outline' onClick={() => setIsEditingAddress(false)}>
                                {t('common.cancel')}
                              </Button>
                            </Show>
                            <Button type='submit' class='min-w-32' disabled={!cartData()?.items.length}>
                              {t('checkout.continueToPayment')}
                            </Button>
                          </div>
                        </form>
                      }
                    >
                      <div class='space-y-4'>
                        <div class='flex justify-between items-start'>
                          <h3 class='font-medium'>{t('checkout.shippingAddress')}</h3>
                          <Button
                            variant='ghost'
                            size='sm'
                            class='text-primary'
                            onClick={() => setIsEditingAddress(true)}
                          >
                            <FiEdit2 class='h-4 w-4 mr-2' />
                            {t('common.edit')}
                          </Button>
                        </div>

                        <div class='rounded-lg border p-4'>
                          <div class='font-medium'>{addressData()?.name}</div>
                          <div class='text-sm text-gray-600 mt-1'>
                            {addressData()?.address}, {t('address.building')} {addressData()?.buildingNumber},
                            {t('address.flat')} {addressData()?.flatNumber}
                          </div>
                          <div class='text-sm text-gray-600'>
                            {addressData()?.district}, {addressData()?.city}, {addressData()?.country}
                          </div>
                          <div class='text-sm text-gray-600 mt-1'>{addressData()?.phone}</div>
                          <div class='text-sm text-gray-600'>{addressData()?.email}</div>
                        </div>

                        <Button
                          class='w-full mt-4'
                          onClick={() => {
                            setOpenSection((prev) => [...prev, 'payment'])
                            setActiveStep(3)
                          }}
                        >
                          {t('checkout.continueToPayment')}
                        </Button>
                      </div>
                    </Show>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              {/* Payment Section */}
              <AccordionItem value='payment'>
                <AccordionTrigger class='bg-white p-4 rounded-lg hover:no-underline'>
                  <div class='flex items-center gap-2'>
                    <span class='size-6 rounded-full bg-primary text-white flex items-center justify-center text-sm'>
                      3
                    </span>
                    <span class='font-medium'>{t('checkout.payment')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent class='mt-4'>
                  <Card class='p-4'>
                    <div class='mb-6'>
                      <div class='flex items-center gap-2 mb-4'>
                        <FiLock class='text-green-600' />
                        <span class='text-sm text-gray-600'>{t('checkout.securePayment')}</span>
                      </div>

                      <RadioGroup value={paymentMethod()} onChange={setPaymentMethod} class='space-y-4'>
                        <div class='flex items-center space-x-2 rtl:space-x-reverse'>
                          <RadioGroupItem value='cod' id='cod' />
                          <Label for='cod' class='flex items-center gap-2 cursor-pointer'>
                            <FiCreditCard class='h-4 w-4' />
                            {t('checkout.cashOnDelivery')}
                            <span class='text-sm text-gray-500'>({t('checkout.paymentDetails.cod')})</span>
                          </Label>
                        </div>
                        <div class='flex items-center space-x-2 rtl:space-x-reverse'>
                          <RadioGroupItem value='card' id='card' />
                          <Label for='card' class='flex items-center gap-2 cursor-pointer'>
                            <div class='flex items-center gap-1'>
                              <img src='/visa.svg' alt='Visa' class='h-6' />
                              <img src='/mastercard.svg' alt='Mastercard' class='h-6' />
                            </div>
                            {t('checkout.payByCard')}
                            <span class='text-sm text-gray-500'>({t('checkout.paymentDetails.card')})</span>
                          </Label>
                        </div>
                      </RadioGroup>

                      <Separator class='my-6' />

                      <div class='space-y-4'>
                        <Show when={paymentMethod() === 'card'}>
                          <div class='rounded-lg border p-4 bg-gray-50'>
                            <div class='text-sm text-gray-500'>{t('checkout.cardPaymentNote')}</div>
                          </div>
                        </Show>

                        <Button class='w-full' disabled={isSubmitting() || !addressData()} onClick={handleCheckout}>
                          <Show
                            when={!isSubmitting()}
                            fallback={
                              <div class='flex items-center gap-2'>
                                <div class='size-4 border-2 border-current border-r-transparent rounded-full animate-spin' />
                                {t('checkout.processing')}
                              </div>
                            }
                          >
                            {t('checkout.placeOrder')}
                          </Show>
                        </Button>
                      </div>
                    </div>

                    <div class='mt-6'>
                      {/* Trust Badges */}
                      <div class='flex items-center justify-center gap-4 text-sm text-gray-500'>
                        <div class='flex items-center gap-1'>
                          <FiShield class='text-green-600' />
                          {t('checkout.secureTransaction')}
                        </div>
                        <div class='flex items-center gap-1'>
                          <FiLock class='text-green-600' />
                          {t('checkout.encryptedData')}
                        </div>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Order Summary Sidebar */}
          <div class='lg:col-span-1'>
            <div class='sticky top-8'>
              <Card class='p-4'>
                <h2 class='font-semibold text-lg mb-4'>{t('checkout.orderSummary')}</h2>

                <div class='space-y-4'>
                  <div class='flex justify-between text-sm'>
                    <span>{t('checkout.subtotal')}</span>
                    <span>{t('currency', { value: subtotal() })}</span>
                  </div>

                  <div class='flex justify-between text-sm'>
                    <span>{t('checkout.estimatedTax')}</span>
                    <span>{t('currency', { value: estimatedTax() })}</span>
                  </div>

                  <Separator />

                  <div class='pt-4'>
                    <div class='flex justify-between font-semibold'>
                      <span>{t('checkout.total')}</span>
                      <span>{t('currency', { value: total() })}</span>
                    </div>
                    <div class='mt-2 text-sm text-gray-500'>{t('checkout.vatIncluded')}</div>
                  </div>

                  {/* Security Badges */}
                  <div class='border-t pt-4'>
                    <div class='grid grid-cols-2 gap-4'>
                      <div class='flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg'>
                        <FiShield class='h-6 w-6 text-green-600 mb-2' />
                        <span class='text-xs text-center text-gray-600'>{t('checkout.securePayments')}</span>
                      </div>
                      <div class='flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg'>
                        <FiLock class='h-6 w-6 text-green-600 mb-2' />
                        <span class='text-xs text-center text-gray-600'>{t('checkout.encryptedData')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div class='space-y-2 text-xs text-gray-500'>
                    <div class='flex items-center gap-2'>
                      <FiShield class='h-4 w-4 text-green-600' />
                      {t('checkout.moneyBackGuarantee')}
                    </div>
                    <div class='flex items-center gap-2'>
                      <FiShield class='h-4 w-4 text-green-600' />
                      {t('checkout.authenticProducts')}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
