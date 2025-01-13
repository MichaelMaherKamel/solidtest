import { Component, createSignal, Show, Switch, Match, For } from 'solid-js'
import { createAsync, useNavigate, useAction } from '@solidjs/router'
import { Button } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'
import { getCart } from '~/db/fetchers/cart'
import { updateCartItemQuantity, removeCartItem, clearCart } from '~/db/actions/cart'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { FiShoppingCart } from 'solid-icons/fi'
import { Skeleton } from '~/components/ui/skeleton'

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

  return (
    <Sheet open={isOpen()} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' class='relative'>
          <FiShoppingCart class='h-5 w-5' />
          <Show when={cartData()?.items?.length > 0}>
            <span class='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 text-[10px] font-medium text-black flex items-center justify-center'>
              {cartData().items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </Show>
        </Button>
      </SheetTrigger>

      <SheetContent position='bottom' class='h-[85vh]'>
        <div class='pt-4'>
          <h3 class='text-lg font-medium mb-4'>{t('cart.title')}</h3>
          <Switch fallback={<div class='text-sm text-gray-500 text-center py-4'>{t('cart.empty')}</div>}>
            <Match when={cartData.loading}>
              <div class='space-y-4'>
                <Skeleton class='h-20 w-full' />
                <Skeleton class='h-20 w-full' />
              </div>
            </Match>
            <Match when={cartData()?.items?.length > 0}>
              <div class='space-y-4 overflow-y-auto' style='max-height: calc(85vh - 200px)'>
                <For each={cartData()?.items}>
                  {(item) => {
                    const itemState = () => itemStates()[item.productId] || { isUpdating: false, isRemoving: false }
                    return (
                      <div
                        class={`flex gap-4 py-2 relative group transition-all duration-300
                          ${
                            itemState().isRemoving
                              ? 'opacity-0 transform translate-x-full'
                              : 'opacity-100 transform translate-x-0'
                          }
                          ${isClearingCart() ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}
                      >
                        <div class='w-16 h-16 bg-gray-100 rounded'>
                          <img src={item.image} alt={item.name} class='w-full h-full object-cover rounded' />
                        </div>
                        <div class='flex-1'>
                          <div class='flex justify-between items-start'>
                            <h4 class='font-medium line-clamp-1'>{item.name}</h4>
                            <Button
                              variant='ghost'
                              onClick={() => handleRemoveItem(item.productId)}
                              class={`text-gray-400 hover:text-red-500 transition-colors
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
                          <div class='flex items-center mt-2 space-x-2 rtl:space-x-reverse'>
                            <div
                              class={`flex items-center border rounded-md transition-transform duration-200 
                              ${itemState().isUpdating ? 'scale-110' : 'scale-100'}`}
                            >
                              <Button
                                variant='ghost'
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                class='px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
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
                              <span class='px-2 py-1 min-w-[2rem] text-center'>{item.quantity}</span>
                              <Button
                                variant='ghost'
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                class='px-2 py-1 hover:bg-gray-100'
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
                            <span class='text-sm font-medium'>
                              {t('currency', { value: item.price * item.quantity })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                </For>
              </div>
              <div class='border-t mt-4 pt-4 bg-white'>
                <div class='flex justify-between items-center mb-4'>
                  <span class='font-medium'>{t('cart.total')}</span>
                  <span class='font-medium'>
                    {t('currency', {
                      value: cartData()?.items.reduce((total, item) => total + item.price * item.quantity, 0),
                    })}
                  </span>
                </div>
                <div class='flex gap-2'>
                  <Button
                    variant='destructive'
                    class={`flex-1 transition-transform duration-200 ${isClearingCart() ? 'scale-95' : 'scale-100'}`}
                    onClick={handleClearCart}
                  >
                    {t('cart.clear')}
                  </Button>
                  <Button
                    variant='pay'
                    class='flex-1'
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/checkout')
                    }}
                  >
                    {t('cart.checkout')}
                  </Button>
                </div>
              </div>
            </Match>
          </Switch>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
