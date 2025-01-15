// ~/components/Checkout/CheckoutCartItems.tsx
import { Component, createSignal, For, Show, Match, Switch } from 'solid-js'
import { Button } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'
import { createAsync, useAction } from '@solidjs/router'
import { getCart } from '~/db/fetchers/cart'
import { updateCartItemQuantity, removeCartItem } from '~/db/actions/cart'
import { Skeleton } from '~/components/ui/skeleton'
import { FiShoppingCart } from 'solid-icons/fi'

interface CheckoutCartItemsProps {
  onNext: (step: string) => void
}

const CheckoutCartItems: Component<CheckoutCartItemsProps> = (props) => {
  const { t } = useI18n()
  const cartData = createAsync(() => getCart())
  const updateQuantity = useAction(updateCartItemQuantity)
  const removeItem = useAction(removeCartItem)

  const [itemStates, setItemStates] = createSignal<Record<string, { isUpdating: boolean; isRemoving: boolean }>>({})

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

  const totalAmount = () => {
    if (!cartData() || !cartData().items) return 0
    return cartData().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  return (
    <div class='space-y-6'>
      <Switch
        fallback={
          <div class='flex flex-col items-center justify-center py-8 text-center'>
            <FiShoppingCart class='h-12 w-12 text-muted-foreground mb-4' />
            <p class='text-lg font-medium mb-2'>{t('cart.emptyTitle')}</p>
            <p class='text-sm text-muted-foreground'>{t('cart.emptyMessage')}</p>
          </div>
        }
      >
        <Match when={cartData.loading}>
          <div class='space-y-4'>
            <Skeleton class='h-24 w-full' />
            <Skeleton class='h-24 w-full' />
            <Skeleton class='h-24 w-full' />
          </div>
        </Match>
        <Match when={cartData()?.items?.length > 0}>
          <div class='bg-white rounded-lg p-6'>
            <div class='space-y-4'>
              <For each={cartData().items}>
                {(item) => {
                  const itemState = () => itemStates()[item.productId] || { isUpdating: false, isRemoving: false }

                  return (
                    <div
                      class={`flex items-center gap-4 p-4 border rounded-lg relative transition-all duration-300
                        ${
                          itemState().isRemoving ? 'opacity-0 transform translate-x-full' : 'opacity-100 translate-x-0'
                        }`}
                    >
                      <div class='w-16 h-16 bg-gray-100 rounded-md overflow-hidden'>
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
                      <div class='flex-1 min-w-0'>
                        <div class='flex justify-between items-start gap-2'>
                          <h3 class='font-medium line-clamp-1'>{item.name}</h3>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            class={`text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors
                              ${itemState().isRemoving ? 'animate-spin' : ''}`}
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
                        <p class='text-sm text-gray-500'>{t('currency', { value: item.price })}</p>
                        <div class='mt-2 flex items-center gap-2'>
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
                          <span class='font-medium'>{t('currency', { value: item.price * item.quantity })}</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </For>
            </div>

            <div class='mt-6 border-t pt-4'>
              <div class='flex justify-between items-center mb-4'>
                <span class='font-medium'>{t('cart.subtotal')}</span>
                <span class='font-bold'>{t('currency', { value: totalAmount() })}</span>
              </div>

              <div class='flex flex-col sm:flex-row sm:justify-end gap-2'>
                <Button
                  variant='pay'
                  class='w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1'
                  onClick={() => props.onNext('cart')}
                  disabled={!cartData()?.items?.length}
                >
                  {t('checkout.buttons.checkoutAddress')}
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
