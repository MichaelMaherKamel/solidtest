// ~/components/cart/CartSheet.tsx
import { Component, createMemo, createSignal, For, Match, Show, Switch } from 'solid-js'
import { useNavigate, useAction, createAsync } from '@solidjs/router'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { Skeleton } from '~/components/ui/skeleton'
import { FiShoppingCart } from 'solid-icons/fi'
import { buttonVariants } from '~/components/ui/button'
import { cn, formatCurrency } from '~/lib/utils'
import { useI18n } from '~/contexts/i18n'
import { updateCartItemQuantity, removeCartItem, clearCart } from '~/db/actions/cart'
import type { CartItem } from '~/db/schema'
import { getCart } from '~/db/fetchers/cart'

const CartSheet: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [itemStates, setItemStates] = createSignal<Record<string, { isUpdating: boolean; isRemoving: boolean }>>({})
  const [isClearingCart, setIsClearingCart] = createSignal(false)

  const { t } = useI18n()
  const navigate = useNavigate()
  const cartData = createAsync(() => getCart())
  const updateQuantity = useAction(updateCartItemQuantity)
  const removeItem = useAction(removeCartItem)
  const clearCartAction = useAction(clearCart)

  // Handle quantity updates
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
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

  // Handle item removal
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

  // Handle cart clearing
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
      alert(t('cart.error'))
    } finally {
      setIsClearingCart(false)
    }
  }

  //Memos
  const cartTotal = createMemo(() => {
    const cart = cartData()
    if (!cart?.items) return 0

    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const cartItemsCount = createMemo(() => {
    const cart = cartData()
    if (!cart?.items) return 0

    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  const cartItemPrice = (item: CartItem) => {
    return formatCurrency(item.price * item.quantity)
  }

  return (
    <Sheet open={isOpen()} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button variant='ghost' size='icon' class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }), 'relative')}>
          <FiShoppingCart class='h-5 w-5' />
          <Show when={cartData()?.items?.length > 0}>
            <span class='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 text-[10px] font-medium text-black flex items-center justify-center gap-2'>
              {cartItemsCount()}
            </span>
          </Show>
        </Button>
      </SheetTrigger>

      <SheetContent position='bottom' class='h-[100dvh] px-0'>
        <div class='flex flex-col h-full'>
          {/* Header */}
          <SheetHeader class='border-b px-4 py-3 flex-shrink-0'>
            <SheetTitle class='text-lg font-semibold'>
              {t('cart.title')}
              <Show when={cartData()?.items?.length > 0}>
                <span class='text-sm font-normal text-muted-foreground'>
                  ({cartItemsCount()} {t('cart.items')})
                </span>
              </Show>
            </SheetTitle>
          </SheetHeader>

          {/* Content */}
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
              <Match when={cartData.loading}>
                <div class='space-y-4 p-4'>
                  <Skeleton class='h-24 w-full' />
                  <Skeleton class='h-24 w-full' />
                  <Skeleton class='h-24 w-full' />
                </div>
              </Match>
              <Match when={cartData()?.items?.length > 0}>
                <div class='divide-y'>
                  <For each={cartData()?.items}>
                    {(item) => {
                      const itemState = () => itemStates()[item.productId] || { isUpdating: false, isRemoving: false }
                      return (
                        <div
                          class={`flex gap-4 p-4 relative transition-all duration-300
                              ${
                                itemState().isRemoving
                                  ? 'opacity-0 transform translate-x-full'
                                  : 'opacity-100 transform translate-x-0'
                              }
                              ${isClearingCart() ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}
                        >
                          <div class='w-20 h-20 bg-gray-100 rounded-md overflow-hidden'>
                            <img src={item.image} alt={item.name} class='w-full h-full object-cover' />
                          </div>
                          <div class='flex-1 min-w-0'>
                            <div class='flex justify-between items-start'>
                              <div>
                                <h3 class='font-medium text-sm sm:text-base line-clamp-1'>{item.name}</h3>
                                <div class='text-xs sm:text-sm text-gray-500 mt-0.5'>{formatCurrency(item.price)}</div>
                              </div>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleRemoveItem(item.productId)}
                                class={`text-red-500 transition-colors
                                    ${itemState().isRemoving ? 'animate-spin' : ''}`}
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
                                class={`flex items-center border rounded-md transition-transform duration-200 
                                  ${itemState().isUpdating ? 'scale-110' : 'scale-100'}`}
                              >
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  class='h-8 w-8 hover:bg-gray-100 disabled:opacity-50'
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
                                <span class='w-8 text-center'>{item.quantity}</span>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                  class='h-8 w-8 hover:bg-gray-100'
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
                              <span class='font-medium'>{cartItemPrice(item)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  </For>
                </div>
              </Match>
            </Switch>
          </div>

          {/* Footer */}
          <Show when={cartData()?.items?.length > 0}>
            <div class='border-t flex-shrink-0'>
              <div class='p-4 space-y-4'>
                {/* Price breakdown */}
                <div class='space-y-3'>
                  <div class='flex justify-between font-medium'>
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatCurrency(cartTotal())}</span>
                  </div>
                  <div class='flex justify-between text-sm '>
                    <span>{t('cart.shipping')}</span>
                    <span>{t('cart.calculatedAtCheckout')}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div class='grid grid-cols-2 gap-3'>
                  <Button
                    variant='destructive'
                    class={`w-full transition-transform duration-200 ${isClearingCart() ? 'scale-95' : 'scale-100'}`}
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
