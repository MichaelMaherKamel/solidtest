// ~/pages/orders/[orderId].tsx
import { Component, createEffect, createSignal, onCleanup, Show, Suspense } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { createAsync } from '@solidjs/router'
import { useI18n } from '~/contexts/i18n'
import {
  FiPackage,
  FiMapPin,
  FiPhone,
  FiUser,
  FiCheck,
  FiClock,
  FiTruck,
  FiAlertCircle,
  FiCalendar,
  FiShoppingBag,
  FiAlertTriangle,
} from 'solid-icons/fi'
import { BiSolidStore } from 'solid-icons/bi'
import { Card } from '~/components/ui/card'
import { getOrderById } from '~/db/fetchers/order'
import { formatCurrency } from '~/lib/utils'
import { IconCashOnDelivery, IconPayByCard } from '~/components/Icons'
import type { OrderStatus, PaymentStatus } from '~/db/schema'
import { Order } from '~/db/schema/types'
import { Button } from '~/components/ui/button'

const OrderSkeleton: Component = () => {
  const { locale } = useI18n()
  const isRTL = () => locale() === 'ar'
  return (
    <div class='container mx-auto px-4 py-8' dir={isRTL() ? 'rtl' : 'ltr'}>
      <div class='max-w-4xl mx-auto'>
        <Card class='overflow-hidden'>
          {/* Header Skeleton */}
          <div class='bg-primary/10 p-6'>
            <div class='flex flex-col sm:flex-row justify-between items-start gap-4'>
              <div class='space-y-2'>
                <div class='h-8 w-48 bg-primary/20 rounded-md animate-pulse' />
                <div class='flex items-center gap-2'>
                  <div class='w-4 h-4 bg-primary/20 rounded animate-pulse' />
                  <div class='h-4 w-32 bg-primary/20 rounded-md animate-pulse' />
                </div>
                <div class='flex items-center gap-2'>
                  <div class='w-4 h-4 bg-primary/20 rounded animate-pulse' />
                  <div class='h-4 w-40 bg-primary/20 rounded-md animate-pulse' />
                </div>
              </div>
              <div class='h-6 w-24 bg-primary/20 rounded-full animate-pulse' />
            </div>
          </div>

          <div class='p-6 space-y-8'>
            {/* Address and Payment Section */}
            <div class='space-y-6 sm:space-y-0 sm:grid grid-cols-1 sm:gap-6'>
              {/* Delivery Information */}
              <div class='space-y-4'>
                <div class='flex items-center gap-2'>
                  <div class='w-4 h-4 bg-gray-200 rounded animate-pulse' />
                  <div class='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                </div>
                <div class='space-y-3 bg-gray-50 rounded-lg p-3'>
                  <div class='flex items-center gap-3'>
                    <div class='w-4 h-4 bg-gray-200 rounded animate-pulse' />
                    <div class='h-4 w-40 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div class='flex items-center gap-3'>
                    <div class='w-4 h-4 bg-gray-200 rounded animate-pulse' />
                    <div class='h-4 w-32 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div class='flex items-start gap-3'>
                    <div class='w-4 h-4 bg-gray-200 rounded animate-pulse flex-shrink-0 mt-1' />
                    <div class='space-y-2 flex-1'>
                      <div class='h-4 w-full bg-gray-200 rounded animate-pulse' />
                      <div class='h-4 w-2/3 bg-gray-200 rounded animate-pulse' />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div class='space-y-4'>
                <div class='flex items-center gap-2'>
                  <div class='w-5 h-5 bg-gray-200 rounded animate-pulse' />
                  <div class='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                </div>
                <div class='bg-gray-50 p-3 rounded-lg flex items-center justify-between'>
                  <div class='h-4 w-32 bg-gray-200 rounded animate-pulse' />
                  <div class='h-6 w-24 bg-gray-200 rounded-full animate-pulse' />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div class='h-px bg-gray-200' />

            {/* Order Items Section */}
            <div class='space-y-6'>
              <div class='h-6 w-32 bg-gray-200 rounded animate-pulse' />

              <div class='space-y-6'>
                {[1, 2].map(() => (
                  <div class='border rounded-lg overflow-hidden'>
                    <div class='bg-gray-50 p-4 flex items-center justify-between'>
                      <div class='flex items-center gap-3'>
                        <div class='w-5 h-5 bg-gray-200 rounded animate-pulse' />
                        <div class='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                      </div>
                      <div class='h-6 w-24 bg-gray-200 rounded-full animate-pulse' />
                    </div>
                    <div class='divide-y divide-gray-100'>
                      {[1, 2].map(() => (
                        <div class='p-4'>
                          <div class='flex gap-4'>
                            <div class='w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0' />
                            <div class='flex-1 min-w-0 space-y-2'>
                              <div class='h-5 w-3/4 bg-gray-200 rounded animate-pulse' />
                              <div class='h-4 w-1/4 bg-gray-200 rounded animate-pulse' />
                              <div class='flex justify-between items-end pt-2'>
                                <div class='h-4 w-20 bg-gray-200 rounded animate-pulse' />
                                <div class='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div class='border-t pt-6 space-y-3'>
                  <div class='flex justify-between'>
                    <div class='h-4 w-20 bg-gray-200 rounded animate-pulse' />
                    <div class='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div class='flex justify-between'>
                    <div class='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                    <div class='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div class='flex justify-between pt-3 border-t'>
                    <div class='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                    <div class='h-5 w-28 bg-gray-200 rounded animate-pulse' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

const OrderNotFound: Component = () => {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const isRTL = () => locale() === 'ar'

  return (
    <div class='container mx-auto px-4 py-8' dir={isRTL() ? 'rtl' : 'ltr'}>
      <div class='max-w-4xl mx-auto'>
        <Card class='p-6 text-center'>
          <div class='space-y-6'>
            <div class='mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
              <FiAlertTriangle class='w-8 h-8 text-red-400' />
            </div>
            <div class='space-y-2'>
              <h2 class='text-2xl font-semibold text-gray-900'>{t('order.notFound.title')}</h2>
              <p class='text-gray-600'>{t('order.notFound.description')}</p>
            </div>
            <Button variant={'secondary'} onClick={() => navigate('/orders')} class='inline-flex items-center gap-2'>
              <FiShoppingBag class='w-4 h-4' />
              {t('order.notFound.viewAllOrders')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

const StatusBadge: Component<{ status: OrderStatus | PaymentStatus; type: 'order' | 'payment' }> = (props) => {
  const { t } = useI18n()

  const getStatusConfig = () => {
    const baseConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FiClock },
      processing: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: FiTruck },
      completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: FiCheck },
      failed: { color: 'bg-red-100 text-red-800 border-red-200', icon: FiAlertCircle },
      refunded: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FiAlertCircle },
      confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: FiCheck },
      shipped: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: FiTruck },
      delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: FiCheck },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: FiAlertCircle },
    }[props.status]

    return baseConfig || { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FiClock }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <span
      class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color} transition-colors duration-200`}
    >
      <StatusIcon class='w-3.5 h-3.5' />
      {t(`${props.type}.status.${props.status}`)}
    </span>
  )
}

const OrderDetails: Component = () => {
  const params = useParams()
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'

  const orderData = createAsync(() => getOrderById(params.orderId) as Promise<Order>)

  return (
    <div class='container mx-auto px-4 py-8' dir={isRTL() ? 'rtl' : 'ltr'}>
      <div class='max-w-4xl mx-auto'>
        <Show when={orderData()} fallback={<OrderNotFound />}>
          {(order) => (
            <Card class='overflow-hidden'>
              {/* Header Section */}
              <div class='bg-primary/10 p-6'>
                <div class='flex flex-col sm:flex-row justify-between items-start gap-4'>
                  <div class='space-y-2'>
                    <h1 class='text-2xl font-semibold text-gray-900'>{t('order.details.title')}</h1>
                    <div class='flex items-center gap-2 text-gray-600'>
                      <FiPackage class='w-4 h-4' />
                      <span>
                        {t('order.number')}: {order().orderNumber}
                      </span>
                    </div>
                    <div class='flex items-center gap-2 text-gray-600'>
                      <FiCalendar class='w-4 h-4' />
                      <time>
                        {new Date(order().createdAt).toLocaleDateString(locale() === 'ar' ? 'ar-EG' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </div>
                  </div>
                  <StatusBadge status={order().orderStatus} type='order' />
                </div>
              </div>

              <div class='p-6 space-y-8'>
                {/* Address and Payment Section */}
                <div class='space-y-6 sm:space-y-0 sm:grid grid-cols-1 sm:gap-6'>
                  {/* Delivery Information */}
                  <div class='space-y-4'>
                    <h2 class='font-medium flex items-center gap-2 text-gray-900'>
                      <FiMapPin class='text-primary' />
                      {t('checkout.orderReview.deliveryDetails')}
                    </h2>
                    <div class='space-y-3 text-gray-600 bg-gray-50 rounded-lg p-3'>
                      <div class='flex items-center gap-3'>
                        <FiUser class='flex-shrink-0 text-gray-400' />
                        <span>{order().shippingAddress.name}</span>
                      </div>
                      <div class='flex items-center gap-3'>
                        <FiPhone class='flex-shrink-0 text-gray-400' />
                        <span>{order().shippingAddress.phone}</span>
                      </div>
                      <div class='flex items-start gap-3'>
                        <FiMapPin class='flex-shrink-0 mt-1 text-gray-400' />
                        <p class='text-sm'>
                          {order().shippingAddress.address}
                          {order().shippingAddress.buildingNumber &&
                            `, ${t('address.form.buildingNumber')}: ${order().shippingAddress.buildingNumber}`}
                          {order().shippingAddress.flatNumber &&
                            `, ${t('address.form.flatNumber')}: ${order().shippingAddress.flatNumber}`}
                          {order().shippingAddress.district && `, ${order().shippingAddress.district}`}
                          {order().shippingAddress.city && `, ${order().shippingAddress.city}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div class='space-y-4'>
                    <h2 class='font-medium flex items-center gap-2 text-gray-900'>
                      <Show
                        when={order().paymentMethod === 'cash'}
                        fallback={<IconPayByCard class='w-5 h-5 text-primary' />}
                      >
                        <IconCashOnDelivery class='w-5 h-5 text-primary' />
                      </Show>
                      {t('checkout.paymentMethod')}
                    </h2>
                    <div class='bg-gray-50 p-3 rounded-lg flex items-center justify-between'>
                      <span class='text-gray-700'>
                        {order().paymentMethod === 'cash' ? t('checkout.cashOnDelivery') : t('checkout.payByFawry')}
                      </span>
                      <StatusBadge status={order().paymentStatus} type='payment' />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div class='h-px bg-gray-200' />

                {/* Order Items Section */}
                <div class='space-y-6'>
                  <h2 class='text-lg font-medium text-gray-900'>{t('order.items.title')}</h2>

                  <div class='space-y-6'>
                    {order().storeSummaries.map((store) => (
                      <div class='border rounded-lg overflow-hidden'>
                        <div class='bg-gray-50 p-4 flex items-center justify-between'>
                          <div class='flex items-center gap-3'>
                            <BiSolidStore class='h-5 w-5 text-primary' />
                            <span class='font-medium'>{store.storeName}</span>
                          </div>
                          <StatusBadge status={store.status} type='order' />
                        </div>
                        <div class='divide-y divide-gray-100'>
                          {order()
                            .items.filter((item) => item.storeId === store.storeId)
                            .map((item) => (
                              <div class='p-4 hover:bg-gray-50 transition-colors duration-200'>
                                <div class='flex gap-4'>
                                  <div class='w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border'>
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      class='w-full h-full object-cover'
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder-product.png'
                                      }}
                                    />
                                  </div>
                                  <div class='flex-1 min-w-0'>
                                    <h3 class='font-medium text-gray-900 truncate'>{item.name}</h3>
                                    <p class='text-sm text-gray-600 mt-1'>
                                      {t('product.colors.' + item.selectedColor)}
                                    </p>
                                    <div class='mt-2 flex justify-between items-end'>
                                      <span class='text-sm text-gray-600'>
                                        {item.quantity} × {formatCurrency(item.price)}
                                      </span>
                                      <span class='font-medium text-gray-900'>
                                        {formatCurrency(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}

                    {/* Order Summary */}
                    <div class='border-t pt-6 space-y-3'>
                      <div class='flex justify-between text-sm text-gray-600'>
                        <span>{t('checkout.orderReview.subtotal')}</span>
                        <span>{formatCurrency(order().subtotal)}</span>
                      </div>
                      <div class='flex justify-between text-sm text-gray-600'>
                        <span>{t('checkout.orderReview.shippingCost')}</span>
                        <span>{formatCurrency(order().shippingCost)}</span>
                      </div>
                      <div class='flex justify-between text-lg font-medium text-gray-900 pt-3 border-t'>
                        <span>{t('checkout.orderReview.total')}</span>
                        <span>{formatCurrency(order().total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </Show>
      </div>
    </div>
  )
}

// Helper function to get status icon
const getStatusIcon = (status: OrderStatus | undefined) => {
  switch (status) {
    case 'pending':
      return <FiClock class='w-5 h-5' />
    case 'confirmed':
    case 'delivered':
      return <FiCheck class='w-5 h-5' />
    case 'processing':
    case 'shipped':
      return <FiTruck class='w-5 h-5' />
    case 'cancelled':
    case 'refunded':
      return <FiAlertCircle class='w-5 h-5' />
    default:
      return <FiClock class='w-5 h-5' />
  }
}

// Main Page Component with Suspense
const OrderPage: Component = () => {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderDetails />
    </Suspense>
  )
}

export default OrderPage
