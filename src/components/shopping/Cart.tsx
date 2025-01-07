// ~/components/cart/Cart.tsx
import { Component, Show, createEffect, createSignal, onMount } from 'solid-js'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from 'solid-icons/fi'
import { useI18n } from '~/contexts/i18n'
import { useAction } from '@solidjs/router'
import { getCartItems, updateCartItemQuantity, removeCartItem, clearCart } from '~/db/actions/cart'
import type { CartItem } from '~/db/schema'

const Cart: Component = () => {
  const { t, locale } = useI18n()
  const [isOpen, setIsOpen] = createSignal(false)
  const [items, setItems] = createSignal<CartItem[]>([])
  const [isLoading, setIsLoading] = createSignal(false)
  const isRTL = () => locale() === 'ar'

  // Load cart items
  const fetchCartItems = async () => {
    setIsLoading(true)
    try {
      const cartItems = await getCartItems()
      setItems(cartItems || [])
    } catch (error) {
      console.error('Error loading cart items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize cart on mount
  onMount(() => {
    fetchCartItems()
  })

  // Refresh cart when sheet opens
  createEffect(() => {
    if (isOpen()) {
      fetchCartItems()
    }
  })

  const totalAmount = () => {
    return items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(productId)
      return
    }

    const formData = new FormData()
    formData.append('productId', productId)
    formData.append('quantity', newQuantity.toString())

    try {
      const result = await updateCartItemQuantity(formData)
      if (result.success) {
        setItems(result.items)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    const formData = new FormData()
    formData.append('productId', productId)

    try {
      const result = await removeCartItem(formData)
      if (result.success) {
        setItems(result.items)
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleClearCart = async () => {
    try {
      const result = await clearCart()
      if (result.success) {
        setItems([])
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  return (
    <Sheet open={isOpen()} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button variant='ghost' size='icon' class='relative'>
          <FiShoppingCart class='h-5 w-5' />
          <Show when={items().length > 0}>
            <span class='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center'>
              {items().length}
            </span>
          </Show>
        </Button>
      </SheetTrigger>
      <SheetContent position={isRTL() ? 'left' : 'right'} class='flex flex-col w-full max-w-sm'>
        <SheetHeader>
          <SheetTitle>{t('cart.title')}</SheetTitle>
        </SheetHeader>

        <Show
          when={!isLoading()}
          fallback={
            <div class='flex-1 flex items-center justify-center'>
              <div class='size-8 border-2 border-current border-r-transparent rounded-full animate-spin' />
            </div>
          }
        >
          <Show
            when={items().length > 0}
            fallback={
              <div class='flex-1 flex flex-col items-center justify-center gap-4 text-center'>
                <FiShoppingCart class='h-12 w-12 text-gray-400' />
                <div class='space-y-1'>
                  <p class='text-lg font-medium'>{t('cart.empty')}</p>
                  <p class='text-sm text-gray-500'>{t('cart.emptyMessage')}</p>
                </div>
              </div>
            }
          >
            <div class='flex-1 overflow-auto py-6'>
              <div class='space-y-4'>
                {items().map((item) => (
                  <div class='flex items-center gap-4'>
                    <div class='h-16 w-16 rounded-lg overflow-hidden bg-gray-100'>
                      <img src={item.image} alt={item.name} class='h-full w-full object-cover' />
                    </div>
                    <div class='flex-1 min-w-0'>
                      <h3 class='font-medium text-sm line-clamp-1'>{item.name}</h3>
                      <p class='text-sm text-gray-500'>${item.price.toFixed(2)}</p>
                      <div class='mt-1 flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          class='h-7 w-7 p-0'
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        >
                          <FiMinus class='h-3 w-3' />
                        </Button>
                        <span class='w-8 text-center text-sm'>{item.quantity}</span>
                        <Button
                          variant='outline'
                          size='sm'
                          class='h-7 w-7 p-0'
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <FiPlus class='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      class='h-8 w-8'
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <FiTrash2 class='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer */}
            <div class='border-t pt-6 space-y-4'>
              <div class='flex items-center justify-between text-sm'>
                <span class='font-medium'>{t('cart.total')}</span>
                <span class='font-bold'>${totalAmount().toFixed(2)}</span>
              </div>
              <div class='grid grid-cols-2 gap-4'>
                <Button variant='outline' onClick={handleClearCart}>
                  {t('cart.clear')}
                </Button>
                <Button>{t('cart.checkout')}</Button>
              </div>
            </div>
          </Show>
        </Show>
      </SheetContent>
    </Sheet>
  )
}

export default Cart
