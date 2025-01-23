import { Component, createMemo, createSignal, For, Match, Show, Switch } from 'solid-js'
import { useNavigate, useAction, createAsync } from '@solidjs/router'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { Skeleton } from '~/components/ui/skeleton'
import { Card } from '~/components/ui/card'
import { FiShoppingCart } from 'solid-icons/fi'
import { BiSolidStore } from 'solid-icons/bi'
import { buttonVariants } from '~/components/ui/button'
import { cn, formatCurrency } from '~/lib/utils'
import { useI18n } from '~/contexts/i18n'
import { updateCartItemQuantity, removeCartItem, clearCart } from '~/db/actions/cart'
import type { CartItem } from '~/db/schema'
import { getCart } from '~/db/fetchers/cart'
import { showToast } from '~/components/ui/toast'

const CartSheet: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [itemStates, setItemStates] = createSignal<Record<string, { isUpdating: boolean; isRemoving: boolean }>>({})
  const [isClearingCart, setIsClearingCart] = createSignal(false)

  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const cartData = createAsync(async () => await getCart())
  const updateQuantity = useAction(updateCartItemQuantity)
  const removeItem = useAction(removeCartItem)
  const clearCartAction = useAction(clearCart)

  // Group cart items by store
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
    if (newQuantity < 1) return

    try {
      setItemStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isUpdating: true },
      }))

      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('quantity', newQuantity.toString())
      formData.append('selectedColor', selectedColor) // Include selectedColor

      const result = await updateQuantity(formData)
      if (!result.success) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      showToast({
        title: t('cart.errorTitle'),
        description: t('cart.errorMsg'),
        variant: 'destructive',
      })
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
      formData.append('selectedColor', selectedColor) // Include selectedColor

      await new Promise((resolve) => setTimeout(resolve, 300))
      const result = await removeItem(formData)
      if (!result.success) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error removing item:', error)
      showToast({
        title: t('cart.errorTitle'),
        description: t('cart.errorMsg'),
        variant: 'destructive',
      })
    }
  }

  const handleClearCart = async () => {
    try {
      setIsClearingCart(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      const result = await clearCartAction()
      if (!result.success) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      showToast({
        title: t('cart.errorTitle'),
        description: t('cart.errorMsg'),
        variant: 'destructive',
      })
    } finally {
      setIsClearingCart(false)
    }
  }

  const cartTotal = createMemo(() => {
    const cart = cartData()
    return cart?.items?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0
  })

  const cartItemsCount = createMemo(() => {
    const cart = cartData()
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  })

  const cartItemPrice = (item: CartItem) => {
    return formatCurrency(item.price * item.quantity)
  }

  const getColor = (colorName: string) => {
    const colorTranslation = t(`product.colors.${colorName}`)
    return locale() === 'ar' ? `اللون: ${colorTranslation}` : `Color: ${colorTranslation}`
  }

  return (
    <Sheet open={isOpen()} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button variant='ghost' size='icon' class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }), 'relative')}>
          <FiShoppingCart class='h-5 w-5' />
          <Show when={cartItemsCount() > 0}>
            <span class='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 text-[10px] font-medium text-black flex items-center justify-center'>
              {cartItemsCount()}
            </span>
          </Show>
        </Button>
      </SheetTrigger>

      <SheetContent position='bottom' class='h-[100dvh] px-0'>
        <div class='flex flex-col h-full'>
          <SheetHeader class='border-b px-4 py-3 flex-shrink-0'>
            <SheetTitle class='text-lg font-semibold'>
              {t('cart.title')}
              <Show when={cartItemsCount() > 0}>
                <span class='text-sm font-normal text-muted-foreground'>
                  ({cartItemsCount()} {t('cart.items')})
                </span>
              </Show>
            </SheetTitle>
          </SheetHeader>

          <div class='flex-1 overflow-auto'>
            <Switch
              fallback={
                <div class='flex flex-col items-center justify-center h-full text-center p-4'>
                  <FiShoppingCart class='h-12 w-12 text-muted-foreground mb-4' />
                  <p class='text-lg font-medium mb-2'>{t('cart.emptyTitle')}</p>
                  <p class='text-sm text-muted-foreground mb-6'>{t('cart.emptyMessage')}</p>
                  <Button variant='outline' onClick={() => setIsOpen(false)}>
                    {t('cart.continueShopping')}
                  </Button>
                </div>
              }
            >
              <Match when={!cartData()}>
                <div class='space-y-4 p-4'>
                  <Skeleton class='h-24 w-full' />
                  <Skeleton class='h-24 w-full' />
                  <Skeleton class='h-24 w-full' />
                </div>
              </Match>
              <Match when={cartData()?.items?.length > 0}>
                <div class='p-4 space-y-6'>
                  <For each={groupedCartItems()}>
                    {({ store, items }) => (
                      <Card class='overflow-hidden'>
                        <div class='bg-primary/5 p-3 flex items-center gap-2'>
                          <BiSolidStore class='h-4 w-4' />
                          <span class='font-semibold'>{store.storeName}</span>
                        </div>
                        <div class='divide-y'>
                          <For each={items}>
                            {(item) => {
                              const itemState = () =>
                                itemStates()[item.productId] || { isUpdating: false, isRemoving: false }
                              return (
                                <div
                                  class={cn(
                                    'p-3 transition-all duration-300',
                                    itemState().isRemoving && 'opacity-0 translate-x-full',
                                    isClearingCart() && 'opacity-0 scale-95'
                                  )}
                                >
                                  <div class='flex gap-3'>
                                    <div class='w-24 flex-shrink-0'>
                                      <div class='aspect-square w-full relative'>
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          class='absolute inset-0 w-full h-full object-cover rounded-md'
                                        />
                                      </div>
                                    </div>
                                    <div class='flex-1 min-w-0 flex flex-col'>
                                      <div class='flex justify-between items-start flex-1'>
                                        <div>
                                          <h3 class='font-medium text-sm line-clamp-1'>{item.name}</h3>
                                          <div class='text-xs text-muted-foreground mt-0.5'>
                                            {getColor(item.selectedColor)}
                                          </div>
                                          <div class='text-xs text-muted-foreground mt-0.5'>
                                            {formatCurrency(item.price)}
                                          </div>
                                        </div>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          onClick={() => handleRemoveItem(item.productId, item.selectedColor)}
                                          class={cn('text-destructive', itemState().isRemoving && 'animate-spin')}
                                          title={t('cart.remove')}
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
                                        </Button>
                                      </div>
                                      <div class='flex items-center justify-between mt-2'>
                                        <div
                                          class={cn(
                                            'flex items-center border rounded-md',
                                            itemState().isUpdating && 'scale-110 transition-transform duration-200'
                                          )}
                                        >
                                          <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() =>
                                              handleUpdateQuantity(
                                                item.productId,
                                                item.quantity - 1,
                                                item.selectedColor
                                              )
                                            }
                                            disabled={item.quantity <= 1}
                                            class='h-7 w-7 hover:bg-secondary/20'
                                            title={t('cart.decrease')}
                                          >
                                            <svg
                                              xmlns='http://www.w3.org/2000/svg'
                                              class='h-4 w-4'
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
                                          <span class='w-7 text-center'>{item.quantity}</span>
                                          <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() =>
                                              handleUpdateQuantity(
                                                item.productId,
                                                item.quantity + 1,
                                                item.selectedColor
                                              )
                                            }
                                            class='h-7 w-7 hover:bg-secondary/20'
                                            title={t('cart.increase')}
                                          >
                                            <svg
                                              xmlns='http://www.w3.org/2000/svg'
                                              class='h-4 w-4'
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
                                        <span class='font-medium text-sm'>{cartItemPrice(item)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }}
                          </For>
                        </div>
                      </Card>
                    )}
                  </For>
                </div>
              </Match>
            </Switch>
          </div>

          <Show when={cartItemsCount() > 0}>
            <div class='border-t flex-shrink-0'>
              <div class='p-4 space-y-4'>
                <div class='space-y-3'>
                  <div class='flex justify-between font-medium'>
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatCurrency(cartTotal())}</span>
                  </div>
                  <div class='flex justify-between text-sm text-muted-foreground'>
                    <span>{t('cart.shipping')}</span>
                    <span>{t('cart.calculatedAtCheckout')}</span>
                  </div>
                </div>

                <div class='grid grid-cols-2 gap-3'>
                  <Button
                    variant='destructive'
                    class={cn('w-full transition-transform duration-200', isClearingCart() && 'scale-95')}
                    onClick={handleClearCart}
                  >
                    {t('cart.clear')}
                  </Button>
                  <Button
                    variant='pay'
                    class='w-full'
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/checkout')
                    }}
                  >
                    {t('cart.checkout')}
                  </Button>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
