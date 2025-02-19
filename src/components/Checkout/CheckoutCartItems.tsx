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
import { BiSolidStore } from 'solid-icons/bi'
import { Card } from '~/components/ui/card'

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

  const groupedCartItems = createMemo(() => {
    const cart = cartData()
    if (!cart?.items) return []

    const grouped: Record<
      string,
      {
        store: { storeId: string; storeName: string }
        items: CartItem[]
      }
    > = {}

    cart.items.forEach((item) => {
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

  const handleUpdateQuantity = async (productId: string, newQuantity: number, selectedColor: string) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(productId, selectedColor)
        return
      }

      setItemStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isUpdating: true },
      }))

      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('quantity', newQuantity.toString())
      formData.append('selectedColor', selectedColor)

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

  const handleRemoveItem = async (productId: string, selectedColor: string) => {
    try {
      setItemStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isRemoving: true },
      }))

      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('selectedColor', selectedColor)

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

  const getColor = (colorName: string) => {
    const colorTranslation = t(`product.colors.${colorName}`)
    return locale() === 'ar' ? `اللون: ${colorTranslation}` : `Color: ${colorTranslation}`
  }

  return (
    <div class='space-y-3'>
      <Switch
        fallback={
          <div class='flex flex-col items-center justify-center py-6 text-center'>
            <FiShoppingCart class='h-10 w-10 text-muted-foreground mb-3' />
            <p class='text-lg font-medium mb-2'>{t('cart.emptyTitle')}</p>
            <p class='text-sm text-muted-foreground mb-2'>{t('cart.emptyMessage')}</p>
            <A
              href='/shopping'
              class={cn(
                buttonVariants({
                  variant: 'secondary',
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
          <div class='space-y-3'>
            <Skeleton class='h-24 w-full' />
            <Skeleton class='h-24 w-full' />
            <Skeleton class='h-24 w-full' />
          </div>
        </Match>
        <Match when={cartData()?.items?.length > 0}>
          <div class='bg-white rounded-lg p-2 sm:p-4'>
            <div class='space-y-2 sm:space-y-4'>
              <For each={groupedCartItems()}>
                {({ store, items }) => (
                  <div class='bg-card rounded-lg overflow-hidden border'>
                    <div class='bg-primary/5 px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1.5 sm:gap-2'>
                      <BiSolidStore class='h-3 w-3 sm:h-4 sm:w-4' />
                      <span class='text-xs sm:text-sm font-medium truncate'>{store.storeName}</span>
                    </div>
                    <div class='divide-y divide-border'>
                      <For each={items}>
                        {(item) => {
                          const itemState = () =>
                            itemStates()[item.productId] || { isUpdating: false, isRemoving: false }

                          return (
                            <div
                              class={cn(
                                'p-2 sm:p-3 transition-all duration-300',
                                itemState().isRemoving && 'opacity-0 translate-x-full'
                              )}
                            >
                              <div class='flex gap-2 sm:gap-3'>
                                <div class='w-14 sm:w-24 flex-shrink-0'>
                                  <div class='aspect-square w-full relative'>
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      class='absolute inset-0 w-full h-full object-cover rounded'
                                      loading='lazy'
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder-product.png'
                                      }}
                                    />
                                  </div>
                                </div>
                                <div class='flex-1 min-w-0 flex flex-col justify-between'>
                                  <div class='flex justify-between items-start gap-1'>
                                    <div>
                                      <h3 class='font-medium text-xs sm:text-sm line-clamp-1'>
                                        {item.name} ({getColor(item.selectedColor)})
                                      </h3>
                                      <div class='text-[10px] sm:text-xs text-muted-foreground mt-0.5'>
                                        {formatCurrency(item.price)}
                                      </div>
                                    </div>
                                    <Button
                                      variant='ghost'
                                      size='icon'
                                      onClick={() => handleRemoveItem(item.productId, item.selectedColor)}
                                      class={cn(
                                        'text-destructive h-5 w-5 sm:h-8 sm:w-8 -mr-1',
                                        itemState().isRemoving && 'animate-spin'
                                      )}
                                      title={t('cart.remove')}
                                    >
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        class='h-3 w-3 sm:h-4 sm:w-4'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                      >
                                        <path
                                          fill-rule='evenodd'
                                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                          clip-rule='evenodd'
                                        />
                                      </svg>
                                    </Button>
                                  </div>
                                  <div class='flex items-center justify-between mt-1 sm:mt-2'>
                                    <div
                                      class={cn(
                                        'flex items-center border rounded',
                                        itemState().isUpdating && 'scale-105 transition-transform duration-200'
                                      )}
                                    >
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        class='h-5 w-5 sm:h-7 sm:w-7 hover:bg-secondary/20'
                                        onClick={() =>
                                          handleUpdateQuantity(item.productId, item.quantity - 1, item.selectedColor)
                                        }
                                        disabled={item.quantity <= 1}
                                        title={t('cart.decrease')}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          class='h-2.5 w-2.5 sm:h-4 sm:w-4'
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
                                      <span class='w-5 sm:w-7 text-center text-xs sm:text-sm'>{item.quantity}</span>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        class='h-5 w-5 sm:h-7 sm:w-7 hover:bg-secondary/20'
                                        onClick={() =>
                                          handleUpdateQuantity(item.productId, item.quantity + 1, item.selectedColor)
                                        }
                                        title={t('cart.increase')}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          class='h-2.5 w-2.5 sm:h-4 sm:w-4'
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
                                    <span class='font-medium text-xs sm:text-sm'>{cartItemPrice(item)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }}
                      </For>
                    </div>
                  </div>
                )}
              </For>
            </div>

            <div class='mt-4 border-t pt-4'>
              <div class='space-y-2'>
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
