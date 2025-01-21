// ~/components/Checkout/CheckoutCartItems.tsx
import { A } from '@solidjs/router'
import { Component, createSignal, For, Match, Switch, createMemo, type Resource } from 'solid-js'
import { Button, buttonVariants } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'
import { createAsync, useAction } from '@solidjs/router'
import { getCart } from '~/db/fetchers/cart'
import { updateCartItemQuantity, removeCartItem } from '~/db/actions/cart'
import { Skeleton } from '~/components/ui/skeleton'
import { FiArrowLeft, FiArrowRight, FiShoppingCart } from 'solid-icons/fi'
import { cn, formatCurrency } from '~/lib/utils'
import type { CartItem } from '~/db/schema'

interface Cart {
  createdAt: Date
  updatedAt: Date
  sessionId: string
  cartId: string
  items: CartItem[]
  lastActive: Date
}

interface CheckoutCartItemsProps {
  onNext: (step: string) => void
}

const CheckoutCartItems: Component<CheckoutCartItemsProps> = (props) => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'
  const cartData = createAsync(() => getCart()) as Resource<Cart | { items: never[] } | undefined>

  const updateQuantity = useAction(updateCartItemQuantity)
  const removeItem = useAction(removeCartItem)

  const [itemStates, setItemStates] = createSignal<Record<string, { isUpdating: boolean; isRemoving: boolean }>>({})

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

  const cartTotal = createMemo(() => {
    const cart = cartData()
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const cartItemPrice = (item: CartItem) => {
    return formatCurrency(item.price * item.quantity)
  }

  return (
    <div class='space-y-6'>
      <Switch
        fallback={
          <div class='flex flex-col items-center justify-center py-8 text-center'>
            <FiShoppingCart class='h-12 w-12 text-muted-foreground mb-4' />
            <p class='text-lg font-medium mb-2'>{t('cart.emptyTitle')}</p>
            <p class='text-sm text-muted-foreground mb-2'>{t('cart.emptyMessage')}</p>
            <A
              href='/shopping'
              class={cn(
                buttonVariants({
                  variant: 'secondary', // or any other variant you prefer
                  size: 'lg',
                })
              )}
            >
              {t('hero.cta')}
            </A>
          </div>
        }
      >
        <Match when={cartData.state === 'pending'}>
          <div class='space-y-4'>
            <Skeleton class='h-24 w-full' />
            <Skeleton class='h-24 w-full' />
            <Skeleton class='h-24 w-full' />
          </div>
        </Match>
        <Match when={cartData()?.items?.length > 0}>
          <div class='bg-white rounded-lg p-4 sm:p-6'>
            <div class='space-y-4'>
              <For each={cartData()?.items}>
                {(item) => {
                  const itemState = () => itemStates()[item.productId] || { isUpdating: false, isRemoving: false }

                  return (
                    <div
                      class={`flex flex-col gap-3 p-3 sm:p-4 border rounded-lg relative transition-all duration-300
                      ${itemState().isRemoving ? 'opacity-0 transform translate-x-full' : 'opacity-100 translate-x-0'}`}
                    >
                      {/* First row: Image, Name, Price, Remove button */}
                      <div class='flex items-center gap-3'>
                        {/* Image */}
                        <div class='w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0'>
                          <img
                            src={item.image}
                            alt={item.name}
                            class='w-full h-full object-cover'
                            loading='lazy'
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.png'
                            }}
                          />
                        </div>

                        {/* Name and Price */}
                        <div class='flex-1 min-w-0'>
                          <div class='flex items-start justify-between gap-2'>
                            <div>
                              <h3 class='font-medium text-sm sm:text-base line-clamp-1'>{item.name}</h3>
                              <div class='text-xs sm:text-sm text-gray-500 mt-0.5'>{formatCurrency(item.price)}</div>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              class={`text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors flex-shrink-0
                              ${itemState().isRemoving ? 'animate-spin' : ''}`}
                              aria-label={t('cart.removeItem')}
                            >
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                class='h-4 w-4'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                              >
                                <path
                                  fill-rule='evenodd'
                                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                  clip-rule='evenodd'
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Second row: Quantity controls and Total */}
                      <div class='flex items-center justify-between gap-2 pt-1'>
                        <div
                          class={`flex items-center border rounded-md ${
                            itemState().isUpdating ? 'scale-110' : 'scale-100'
                          } transition-transform duration-200`}
                        >
                          <Button
                            variant='ghost'
                            size='sm'
                            class='h-7 w-7 p-0'
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label={t('cart.decreaseQuantity')}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              class='h-3 w-3'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fill-rule='evenodd'
                                d='M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                                clip-rule='evenodd'
                              />
                            </svg>
                          </Button>
                          <span class='w-8 text-center text-sm'>{item.quantity}</span>
                          <Button
                            variant='ghost'
                            size='sm'
                            class='h-7 w-7 p-0'
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            aria-label={t('cart.increaseQuantity')}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              class='h-3 w-3'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fill-rule='evenodd'
                                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                                clip-rule='evenodd'
                              />
                            </svg>
                          </Button>
                        </div>
                        <div class='flex items-center gap-2'>
                          <span class='text-xs text-gray-500'>{t('cart.total')}:</span>
                          <span class='font-medium text-sm sm:text-base'>{cartItemPrice(item)}</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </For>
            </div>

            <div class='mt-4 sm:mt-6 border-t pt-4'>
              <div class='space-y-3'>
                <div class='flex justify-between font-medium'>
                  <span class='text-sm sm:text-base'>{t('cart.subtotal')}</span>
                  <span class='text-sm sm:text-base'>{formatCurrency(cartTotal())}</span>
                </div>
              </div>

              <div class='flex flex-col sm:flex-row sm:justify-end gap-2 mt-4'>
                <Button
                  variant='pay'
                  class='w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1'
                  onClick={() => props.onNext('cart')}
                  disabled={!cartData()?.items?.length}
                >
                  <div class='flex items-center gap-2'>
                    {t('checkout.buttons.checkoutAddress')}
                    {isRTL() ? <FiArrowLeft class='w-4 h-4' /> : <FiArrowRight class='w-4 h-4' />}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  )
}

export default CheckoutCartItems
