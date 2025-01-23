import { Component, For, Show, createMemo } from 'solid-js'
import { Separator } from '~/components/ui/separator'
import { useI18n } from '~/contexts/i18n'
import { FiPackage, FiMapPin, FiPhone, FiUser, FiEdit2 } from 'solid-icons/fi'
import { FaSolidMapPin } from 'solid-icons/fa'
import { formatCurrency, calculateCartTotals, getDeliveryEstimate } from '~/lib/utils'
import type { CartItem, Address } from '~/db/schema'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { IconPayByCard, IconCashOnDelivery } from '../Icons'
import { BiSolidStore } from 'solid-icons/bi'

interface CheckoutSummaryItemsProps {
  items: CartItem[]
  address: Address | null | undefined
  selectedPaymentMethod: string | null
  isLoading?: boolean
  onEditOrder?: () => void
  onConfirmOrder?: () => void
}

const CheckoutSummaryItems: Component<CheckoutSummaryItemsProps> = (props) => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'

  const totals = () => {
    if (!props.items || !props.address) return { subtotal: 0, shipping: 0, total: 0 }
    return calculateCartTotals(props.items, props.address.city)
  }

  const deliveryInfo = () => {
    if (!props.address?.city) return null
    return getDeliveryEstimate(props.address.city)
  }

  // Group items by store
  const groupedItems = createMemo(() => {
    const grouped: Record<
      string,
      {
        store: { storeId: string; storeName: string }
        items: CartItem[]
      }
    > = {}

    props.items.forEach((item) => {
      if (!grouped[item.storeId]) {
        grouped[item.storeId] = {
          store: {
            storeId: item.storeId,
            storeName: item.storeName,
          },
          items: [],
        }
      }
      grouped[item.storeId].items.push(item)
    })

    return Object.values(grouped)
  })

  return (
    <Card class='overflow-hidden shadow-lg'>
      <div class='py-4 px-3 sm:py-6 sm:px-4 lg:px-6 space-y-4 sm:space-y-6'>
        {/* Title and Edit Button Row */}
        <div class='flex items-center justify-between'>
          <h2 class='text-lg sm:text-xl font-semibold'>{t('checkout.orderReview.title')}</h2>
          <Button
            variant='outline'
            size='sm'
            class='text-sm transition-colors duration-300 gap-1'
            onClick={() => props.onEditOrder?.()}
          >
            <FiEdit2 class='w-4 h-4' />
            {t('checkout.orderReview.buttons.editOrder')}
          </Button>
        </div>

        {/* Order Items */}
        <div class='space-y-3 sm:space-y-4'>
          <h3 class='font-medium text-gray-700 flex items-center gap-2'>
            <FiPackage />
            <span>{t('checkout.orderReview.items')}</span>
          </h3>

          <div class='bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3'>
            <Show
              when={props.items?.length > 0}
              fallback={<div class='text-gray-500 text-center py-2'>{t('cart.empty')}</div>}
            >
              <For each={groupedItems()}>
                {({ store, items }) => (
                  <Card class='overflow-hidden'>
                    <div class='bg-primary/5 p-3 flex items-center gap-2'>
                      <BiSolidStore class='h-4 w-4' />
                      <span class='font-semibold'>{store.storeName}</span>
                    </div>
                    <div class='divide-y'>
                      <For each={items}>
                        {(item) => (
                          <div class='p-3'>
                            <div class='flex items-start sm:items-center justify-between gap-2'>
                              <div class='flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                                <div class='w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0'>
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    class='w-full h-full object-cover'
                                    onError={(e) => {
                                      e.currentTarget.src = '/placeholder-product.png'
                                    }}
                                  />
                                </div>
                                <div class='min-w-0 flex-1'>
                                  <p class='font-medium text-sm sm:text-base truncate'>{item.name}</p>
                                  <div class='flex items-center justify-between sm:justify-start gap-4'>
                                    <p class='text-xs sm:text-sm text-gray-500'>
                                      {t('checkout.quantity')}: {item.quantity}
                                    </p>
                                    <div class='sm:hidden text-right text-xs'>
                                      <span class='font-medium'>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Price section - hidden on mobile, shown on desktop */}
                              <div class='hidden sm:block text-end flex-shrink-0'>
                                <p class='text-sm text-gray-500'>
                                  {item.quantity} × {formatCurrency(item.price)}
                                </p>
                                <p class='font-medium text-base'>{formatCurrency(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </Card>
                )}
              </For>

              <Separator class='my-2 sm:my-3' />

              <div class='space-y-2'>
                <div class='flex justify-between text-xs sm:text-sm'>
                  <span class='text-gray-600'>{t('checkout.orderReview.subtotal')}</span>
                  <span class='font-medium'>{formatCurrency(totals().subtotal)}</span>
                </div>

                <div class='flex justify-between text-xs sm:text-sm items-center'>
                  <div>
                    <span class='text-gray-600'>{t('checkout.orderReview.shippingCost')}</span>
                    <Show when={deliveryInfo()}>
                      <p class='text-xs text-gray-500 mt-0.5'>
                        {deliveryInfo()?.minDays}-{deliveryInfo()?.maxDays} {t('checkout.businessDays')}
                      </p>
                    </Show>
                  </div>
                  <span class='font-medium'>{formatCurrency(totals().shipping)}</span>
                </div>

                <Separator class='my-2' />

                <div class='flex justify-between text-base sm:text-lg font-medium'>
                  <span>{t('checkout.orderReview.total')}</span>
                  <span>{formatCurrency(totals().total)}</span>
                </div>
              </div>
            </Show>
          </div>
        </div>

        {/* Delivery Information */}
        <Show when={props.address} fallback={<div class='text-gray-500 text-center py-2'>{t('address.notFound')}</div>}>
          <div class='space-y-3 sm:space-y-4'>
            <h3 class='font-medium text-gray-700 flex items-center gap-2'>
              <FiMapPin />
              <span>{t('checkout.orderReview.deliveryDetails')}</span>
            </h3>
            <div class='bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2'>
              <div class='flex items-center gap-2 text-gray-600 text-sm sm:text-base'>
                <FiUser class='flex-shrink-0' />
                <span class='truncate'>{props.address?.name}</span>
              </div>
              <div class='flex items-center gap-2 text-gray-600 text-sm sm:text-base'>
                <FiPhone class='flex-shrink-0' />
                <span class='truncate'>{props.address?.phone}</span>
              </div>
              <div class='flex items-start gap-2 text-gray-600 text-sm sm:text-base'>
                <FaSolidMapPin class='flex-shrink-0 mt-1' />
                <p class='text-gray-600 break-words'>
                  {props.address?.address}
                  {props.address?.buildingNumber ? `, ${props.address?.buildingNumber}` : ''}
                  {props.address?.flatNumber ? `, ${props.address?.flatNumber}` : ''}
                  {props.address?.district ? `, ${props.address?.district}` : ''}
                  {props.address?.city ? `, ${props.address?.city}` : ''}
                </p>
              </div>
            </div>
          </div>
        </Show>

        {/* Selected Payment Method */}
        <div class='bg-gray-50 rounded-lg p-3 sm:p-4'>
          <div class='flex items-center justify-between'>
            <div class='flex items-center gap-2 text-gray-600 text-sm sm:text-base'>
              <Show
                when={props.selectedPaymentMethod === 'cod'}
                fallback={<IconPayByCard class='flex-shrink-0 size-5 sm:size-6' />}
              >
                <IconCashOnDelivery class='flex-shrink-0 size-5 sm:size-6' />
              </Show>
              <span>{t('checkout.paymentMethod')}</span>
            </div>
            <span class='font-medium text-sm sm:text-base'>
              {props.selectedPaymentMethod === 'cod' ? t('checkout.cashOnDelivery') : t('checkout.payByFawry')}
            </span>
          </div>
        </div>

        {/* Action Button - Only Confirm Order */}
        <div class='pt-2 sm:pt-4'>
          <Button
            variant='pay'
            class='w-full transform transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base'
            size='lg'
            onClick={() => props.onConfirmOrder?.()}
          >
            {props.selectedPaymentMethod === 'cod'
              ? t('checkout.orderReview.buttons.confirmCod')
              : t('checkout.orderReview.buttons.confirmFawry')}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default CheckoutSummaryItems
