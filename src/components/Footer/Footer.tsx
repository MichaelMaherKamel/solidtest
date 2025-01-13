// ~/components/SiteFooter.tsx
import { Component, createSignal, For, Match, Show, Suspense, Switch } from 'solid-js'
import { A } from '@solidjs/router'
import { BiRegularHomeAlt } from 'solid-icons/bi'
import { BiRegularMessageRounded } from 'solid-icons/bi'
import { BiRegularSearch } from 'solid-icons/bi'
import { FiShoppingCart } from 'solid-icons/fi'
import { Separator } from '~/components/ui/separator'
import { Dock, DockIcon } from '~/components/Dock'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { createMediaQuery } from '@solid-primitives/media'
import { UserButton } from '../auth/UserBtn'
import { LocalizationButton } from '../LocalizationButton'
import { useI18n } from '~/contexts/i18n'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { createAsync, useNavigate, useAction } from '@solidjs/router'
import { getCart } from '~/db/fetchers/cart'
import { updateCartItemQuantity, removeCartItem, clearCart } from '~/db/actions/cart'
import { Skeleton } from '~/components/ui/skeleton'

// Cart Sheet Component
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
        <Button variant='ghost' size='icon' class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }), 'relative')}>
          <FiShoppingCart class='h-5 w-5' />
          <Show when={cartData()?.items?.length > 0}>
            <span class='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 text-[10px] font-medium text-black flex items-center justify-center'>
              {cartData().items.reduce((sum, item) => sum + item.quantity, 0)}
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
                  ({cartData().items.reduce((sum, item) => sum + item.quantity, 0)} {t('cart.items')})
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
                              <h4 class='font-medium line-clamp-2 leading-tight'>{item.name}</h4>
                              <Button
                                variant='ghost'
                                size='icon'
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
                              <span class='font-medium'>{t('currency', { value: item.price * item.quantity })}</span>
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
                  <div class='flex justify-between text-sm'>
                    <span class='text-muted-foreground'>{t('cart.subtotal')}</span>
                    <span>
                      {t('currency', {
                        value: cartData()?.items.reduce((total, item) => total + item.price * item.quantity, 0),
                      })}
                    </span>
                  </div>
                  <div class='flex justify-between text-sm'>
                    <span class='text-muted-foreground'>{t('cart.shipping')}</span>
                    <span>{t('currency', { value: 50 })}</span>
                  </div>
                  <div class='flex justify-between font-medium text-lg pt-2 border-t'>
                    <span>{t('cart.total')}</span>
                    <span>
                      {t('currency', {
                        value: cartData()?.items.reduce((total, item) => total + item.price * item.quantity, 0) + 50,
                      })}
                    </span>
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

// Mobile navigation component
const MobileNavigation: Component = () => {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <div class='fixed bottom-0 left-0 right-0 z-50'>
      <Dock direction='middle' class='bg-white shadow-md'>
        <DockIcon>
          <A href='/' class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}>
            <BiRegularHomeAlt class='w-5 h-5' />
          </A>
        </DockIcon>

        <Separator orientation='vertical' class='h-full' />

        <DockIcon>
          <BiRegularSearch class='w-5 h-5' />
        </DockIcon>

        <DockIcon>
          <A
            href='https://wa.me/201022618610'
            target='_blank'
            class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}
          >
            <BiRegularMessageRounded class='w-5 h-5' />
          </A>
        </DockIcon>

        <DockIcon>
          <CartSheet />
        </DockIcon>

        <DockIcon>
          <LocalizationButton iconOnly size='icon' variant='ghost' />
        </DockIcon>

        <Separator orientation='vertical' class='h-full py-2' />

        <DockIcon>
          <Suspense fallback={<div class='w-10 h-10 rounded-full animate-pulse bg-gray-200' />}>
            <UserButton />
          </Suspense>
        </DockIcon>
      </Dock>

      <div class='px-4 h-8 text-gray-600 supports-backdrop-blur:bg-white/10 backdrop-blur-md' dir='ltr'>
        <div class='flex items-center justify-center h-full text-xs'>
          <span class='truncate'>{t('footer.companyInfo', { year: currentYear })}</span>
        </div>
      </div>
    </div>
  )
}

// Desktop footer component
const DesktopFooter: Component = () => {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer class='bg-gray-100 shadow-md'>
      <div class='container mx-auto px-4 py-3 text-gray-600' dir='ltr'>
        <div class='flex items-center justify-center'>
          <div class='flex items-center gap-4'>
            <p class='text-base'>{t('footer.copyright', { year: currentYear })}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main SiteFooter component
const SiteFooter: Component = () => {
  const isLargeScreen = createMediaQuery('(min-width: 768px)')

  return (
    <Show when={isLargeScreen()} fallback={<MobileNavigation />}>
      <DesktopFooter />
    </Show>
  )
}

export default SiteFooter
