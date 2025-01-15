// ~/components/Checkout/CheckoutAddress.tsx
import { Component, Show, createSignal } from 'solid-js'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'
import { createAsync, useAction } from '@solidjs/router'
import { getAddress } from '~/db/fetchers/address'
import { createAddressAction, updateAddressAction } from '~/db/actions/address'
import { FiMapPin, FiEdit2, FiPhone, FiUser } from 'solid-icons/fi'
import type { Address } from '~/db/schema'

// Extract city type from schema's enum
type City =
  | 'Cairo'
  | 'Alexandria'
  | 'Giza'
  | 'ShubraElKheima'
  | 'PortSaid'
  | 'Suez'
  | 'Luxor'
  | 'Mansoura'
  | 'ElMahallaElKubra'
  | 'Tanta'
  | 'Asyut'
  | 'Ismailia'
  | 'Faiyum'
  | 'Zagazig'
  | 'Damietta'
  | 'Aswan'
  | 'Minya'
  | 'Damanhur'
  | 'BeniSuef'
  | 'Hurghada'

interface CheckoutAddressProps {
  onNext: (step: string) => void
  onBack: (step: string) => void
}

interface AddressFormData {
  name: string
  email: string
  phone: string
  address: string
  buildingNumber: string
  flatNumber: string
  city: City
  district: string
  postalCode: string
}

const CheckoutAddress: Component<CheckoutAddressProps> = (props) => {
  const { t, locale } = useI18n()
  const addressData = createAsync(() => getAddress())
  const createAddress = useAction(createAddressAction)
  const updateAddress = useAction(updateAddressAction)
  const isRTL = () => locale() === 'ar'

  const [isEditing, setIsEditing] = createSignal(false)
  const [formError, setFormError] = createSignal('')
  const [isSaving, setIsSaving] = createSignal(false)

  // Form state
  const [formData, setFormData] = createSignal<AddressFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    buildingNumber: '',
    flatNumber: '',
    city: 'Cairo', // Default to Cairo
    district: '',
    postalCode: '',
  })

  // Initialize form with existing address data
  const initForm = (address: Address | null) => {
    if (address) {
      setFormData({
        name: address.name,
        email: address.email,
        phone: address.phone,
        address: address.address,
        buildingNumber: address.buildingNumber.toString(),
        flatNumber: address.flatNumber.toString(),
        city: address.city,
        district: address.district,
        postalCode: address.postalCode?.toString() || '',
      })
    }
  }

  // Handle edit mode
  const handleEdit = () => {
    const address = addressData()
    if (address) {
      initForm(address)
    }
    setIsEditing(true)
  }

  // Form submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setFormError('')
    setIsSaving(true)

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)

      const result = addressData() ? await updateAddress(formData) : await createAddress(formData)

      if (result.success) {
        setIsEditing(false)
        props.onNext('shipping')
      } else {
        setFormError(result.error)
      }
    } catch (error) {
      setFormError(t('address.validation.error'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div class='space-y-6'>
      <Show
        when={addressData() != null && !isEditing()}
        fallback={
          <Card class='overflow-hidden'>
            <form onSubmit={handleSubmit} class='p-6 space-y-6'>
              <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('address.form.firstName')}</label>
                  <input
                    name='name'
                    type='text'
                    value={formData().name}
                    onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
                    class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    required
                  />
                </div>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('address.form.email')}</label>
                  <input
                    name='email'
                    type='email'
                    value={formData().email}
                    onInput={(e) => setFormData({ ...formData(), email: e.currentTarget.value })}
                    class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    required
                  />
                </div>
              </div>

              <div class='space-y-2'>
                <label class='text-sm font-medium'>{t('address.form.phone')}</label>
                <input
                  name='phone'
                  type='tel'
                  value={formData().phone}
                  onInput={(e) => setFormData({ ...formData(), phone: e.currentTarget.value })}
                  dir={isRTL() ? 'rtl' : 'ltr'}
                  class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  required
                />
              </div>

              <div class='space-y-2'>
                <label class='text-sm font-medium'>{t('address.form.address')}</label>
                <input
                  name='address'
                  type='text'
                  value={formData().address}
                  onInput={(e) => setFormData({ ...formData(), address: e.currentTarget.value })}
                  class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  required
                />
              </div>

              <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('address.city.label')}</label>
                  <select
                    name='city'
                    value={formData().city}
                    onChange={(e) => setFormData({ ...formData(), city: e.currentTarget.value as City })}
                    class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white'
                    required
                  >
                    {Object.entries(t('address.city')).map(([key, value]) => {
                      if (key !== 'label' && key !== 'placeholder') {
                        return <option value={key}>{value as string}</option>
                      }
                      return null
                    })}
                  </select>
                </div>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('address.form.district')}</label>
                  <input
                    name='district'
                    type='text'
                    value={formData().district}
                    onInput={(e) => setFormData({ ...formData(), district: e.currentTarget.value })}
                    class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    required
                  />
                </div>
              </div>

              <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>Building Number</label>
                  <input
                    name='buildingNumber'
                    type='number'
                    value={formData().buildingNumber}
                    onInput={(e) => setFormData({ ...formData(), buildingNumber: e.currentTarget.value })}
                    class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    required
                  />
                </div>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>Flat Number</label>
                  <input
                    name='flatNumber'
                    type='number'
                    value={formData().flatNumber}
                    onInput={(e) => setFormData({ ...formData(), flatNumber: e.currentTarget.value })}
                    class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    required
                  />
                </div>
              </div>

              <div class='space-y-2'>
                <label class='text-sm font-medium'>{t('address.form.zipCode')}</label>
                <input
                  name='postalCode'
                  type='number'
                  value={formData().postalCode}
                  onInput={(e) => setFormData({ ...formData(), postalCode: e.currentTarget.value })}
                  class='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>

              <Show when={formError()}>
                <p class='text-red-500 text-sm'>{formError()}</p>
              </Show>

              <div class='flex flex-col-reverse sm:flex-row justify-between items-center gap-2'>
                <Button type='button' variant='ghost' class='w-full sm:w-auto' onClick={() => props.onBack('shipping')}>
                  {t('checkout.buttons.backToCart')}
                </Button>
                <Button
                  type='submit'
                  variant='pay'
                  disabled={isSaving()}
                  class='w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1'
                >
                  {isSaving() ? t('common.loading') : t('checkout.buttons.proceedToPayment')}
                </Button>
              </div>
            </form>
          </Card>
        }
      >
        <Card class='overflow-hidden'>
          <div class='p-6 space-y-6'>
            <div class='flex items-center justify-between'>
              <h3 class='font-medium text-gray-900'>{t('checkout.orderReview.deliveryDetails')}</h3>
              <Button variant='ghost' size='sm' class='flex items-center gap-2' onClick={handleEdit}>
                <FiEdit2 class='w-4 h-4' />
                {t('common.edit')}
              </Button>
            </div>

            <div class='space-y-4'>
              <div class='flex items-center gap-2 text-gray-600'>
                <FiUser class='flex-shrink-0' />
                <span>{addressData()?.name}</span>
              </div>
              <div class='flex items-center gap-2 text-gray-600' dir={isRTL() ? 'rtl' : 'ltr'}>
                <FiPhone class='flex-shrink-0' />
                <span>{addressData()?.phone}</span>
              </div>
              <div class='flex items-center gap-2 text-gray-600'>
                <FiMapPin class='flex-shrink-0' />
                <p class='text-gray-600'>
                  {addressData()?.address && `${addressData()?.address}`}
                  {addressData()?.buildingNumber && `, ${addressData()?.buildingNumber}`}
                  {addressData()?.flatNumber && `, ${addressData()?.flatNumber}`}
                </p>
              </div>
            </div>

            <div class='flex flex-col-reverse sm:flex-row justify-between items-center gap-2'>
              <Button variant='ghost' class='w-full sm:w-auto' onClick={() => props.onBack('shipping')}>
                {t('checkout.buttons.backToCart')}
              </Button>
              <Button
                variant='pay'
                class='w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1'
                onClick={() => props.onNext('shipping')}
              >
                {t('checkout.buttons.proceedToPayment')}
              </Button>
            </div>
          </div>
        </Card>
      </Show>
    </div>
  )
}

export default CheckoutAddress
