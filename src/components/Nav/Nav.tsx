import {
  Component,
  createSignal,
  onMount,
  onCleanup,
  createEffect,
  createMemo,
  Show,
  Switch,
  Match,
  For,
} from 'solid-js'
import { Skeleton } from '~/components/ui/skeleton'
import { A, useLocation, createAsync, useNavigate, useAction } from '@solidjs/router'
import { Button } from '../ui/button'
import { useI18n } from '~/contexts/i18n'
import { FiShoppingCart } from 'solid-icons/fi'
import { RiEditorTranslate2 } from 'solid-icons/ri'
import { getCart } from '~/db/fetchers/cart'
import { updateCartItemQuantity, removeCartItem, clearCart } from '~/db/actions/cart'
import { cn, formatCurrency } from '~/lib/utils'
import { BiSolidStore } from 'solid-icons/bi'
import { showToast } from '~/components/ui/toast'
import { UserButton } from '~/components/auth/UserBtn'
import { createMediaQuery } from '@solid-primitives/media'
import { useAuth } from '@solid-mediakit/auth/client'
import { Search } from '~/components/Search'

// Types
interface Language {
  code: 'en' | 'ar'
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
}

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  selectedColor: string
  storeId: string
  storeName: string
}

type DropdownType = 'menu' | 'lang' | 'user' | 'cart'

// Constants
const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
]

const MENU_ITEMS = [
  { path: '/', key: 'nav.home' },
  { path: '/about', key: 'nav.about' },
  { path: '/stores', key: 'nav.stores' },
  { path: '/gallery', key: 'nav.gallery' },
  { path: '/admin', key: 'nav.admin', roles: ['admin'] },
  { path: '/seller', key: 'nav.seller', roles: ['seller'] },
]

// Helper function for dropdown styles
const getDropdownStyles = (isOpen: boolean, isRTL: boolean) => `
absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 rounded-lg shadow-lg 
bg-white ring-1 ring-black ring-opacity-5 
transition-all duration-300 ease-in-out origin-top-right
${
  isOpen
    ? 'opacity-100 transform scale-100 translate-y-0'
    : 'opacity-0 transform scale-95 -translate-y-2 pointer-events-none'
}
`

// Helper function for mobile menu item styles
const getMobileMenuItemStyles = (isActive: boolean, textColor: string) => `
justify-start w-full text-start transition-colors duration-200
${
  isActive ? 'bg-sky-700/50 border-sky-400' : 'border-transparent hover:bg-sky-700/30 hover:border-sky-300'
} ${textColor}
`

const Nav: Component = () => {
  // State signals
  const [isOpen, setIsOpen] = createSignal(false)
  const [isLangOpen, setIsLangOpen] = createSignal(false)
  const [isUserOpen, setIsUserOpen] = createSignal(false)
  const [isCartOpen, setIsCartOpen] = createSignal(false)
  const [isScrolled, setIsScrolled] = createSignal(false)
  const [itemStates, setItemStates] = createSignal<Record<string, { isUpdating: boolean; isRemoving: boolean }>>({})
  const [isClearingCart, setIsClearingCart] = createSignal(false)
  const [isSearchOpen, setIsSearchOpen] = createSignal(false)

  // Refs
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement | undefined>()
  const [langRef, setLangRef] = createSignal<HTMLDivElement | undefined>()
  const [userRef, setUserRef] = createSignal<HTMLDivElement | undefined>() // ADDED
  const [cartRef, setCartRef] = createSignal<HTMLDivElement | undefined>()
  const [searchRef, setSearchRef] = createSignal<HTMLDivElement | undefined>()

  // Hooks
  const location = useLocation()
  // const auth = useAuthState() REMOVED
  const auth = useAuth() // ADDED
  const { t, locale, setLocale } = useI18n()
  const cartData = createAsync(() => getCart())
  const navigate = useNavigate()
  const updateQuantity = useAction(updateCartItemQuantity)
  const removeItem = useAction(removeCartItem)
  const clearCartAction = useAction(clearCart)
  const isLargeScreen = createMediaQuery('(min-width: 768px)') // MEDIA

  // Memos
  const isRTL = createMemo(() => locale() === 'ar')
  const isHomePage = createMemo(() => location.pathname === '/')

  // Group cart items by store with proper typing
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

  const userData = createMemo(() => {
    const session = auth.session()
    return {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      image: session?.user?.image || '',
      initials: session?.user?.name?.[0]?.toUpperCase() || 'U',
      role: session?.user?.role || 'guest',
    }
  })

  const filteredMenuItems = createMemo(() =>
    MENU_ITEMS.filter((item) => !item.roles || item.roles.includes(userData().role))
  )

  const textColor = createMemo(() => {
    if (isHomePage()) {
      return isScrolled() ? 'text-gray-800 hover:text-gray-900' : 'text-white hover:text-white'
    }
    return 'text-gray-800 hover:text-gray-900'
  })

  const logoColor = createMemo(() => {
    if (isHomePage()) {
      return isScrolled() ? 'text-gray-900 hover:text-gray-800' : 'text-white hover:text-white/90'
    }
    return 'text-gray-900 hover:text-gray-800'
  })

  // Computed value for whether any dropdown is open
  const isAnyDropdownOpen = createMemo(() => isOpen() || isCartOpen() || isLangOpen() || isUserOpen() || isSearchOpen()) // ADDED || isUserOpen()

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

  // Effects
  onMount(() => {
    let scrollRAF: number

    const handleScroll = () => {
      if (scrollRAF) cancelAnimationFrame(scrollRAF)
      scrollRAF = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollRAF) cancelAnimationFrame(scrollRAF)
    })
  })

  createEffect(() => {
    if (!isAnyDropdownOpen()) return

    const handleClickOutside = (e: MouseEvent) => {
      const clickedEl = e.target as Node
      const menu = menuRef()
      const lang = langRef()
      const user = userRef() // ADDED
      const cart = cartRef()
      const search = searchRef()

      if (menu && menu && !menu.contains(clickedEl) && isOpen()) setIsOpen(false)
      if (lang && lang && !lang.contains(clickedEl) && isLangOpen()) setIsLangOpen(false)
      if (user && user && !user.contains(clickedEl) && isUserOpen()) setIsUserOpen(false) // ADDED
      if (cart && cart && !cart.contains(clickedEl) && isCartOpen()) setIsCartOpen(false)
      if (search && search && !search.contains(clickedEl) && isSearchOpen()) setIsSearchOpen(false)
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAllDropdowns()
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    })
  })

  // Route change effect
  createEffect(() => {
    location.pathname
    closeAllDropdowns()
  })

  // Handlers
  const closeAllDropdowns = (except?: DropdownType) => {
    if (except !== 'menu') setIsOpen(false)
    if (except !== 'lang') setIsLangOpen(false)
    if (except !== 'user') setIsUserOpen(false) // ADDED
    if (except !== 'cart') setIsCartOpen(false)
  }

  const handleDropdownClick = (type: DropdownType, e: Event) => {
    e.stopPropagation()
    closeAllDropdowns(type)
    switch (type) {
      case 'menu':
        setIsOpen(!isOpen())
        break
      case 'lang':
        setIsLangOpen(!isLangOpen())
        break
      case 'user': // ADDED
        setIsUserOpen(!isUserOpen())
        break
      case 'cart':
        setIsCartOpen(!isCartOpen())
        break
    }
  }

  // Update the handleUpdateQuantity function in Nav.tsx
  const handleUpdateQuantity = async (productId: string, newQuantity: number, selectedColor: string) => {
    try {
      // Set the item state to "isUpdating"
      setItemStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isUpdating: true },
      }))

      // Prepare the form data to send to the backend
      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('quantity', newQuantity.toString())
      formData.append('selectedColor', selectedColor)
      formData.append('locale', locale() || 'en') // Use the `locale` variable from `useI18n`

      // Call the backend API to update the quantity
      const result = await updateQuantity(formData)
      console.log('Update quantity result:', result) // Debug log

      // Handle errors from the backend
      if (!result.success) {
        showToast({
          title: t('common.error'),
          description: result.error || t('cart.errorMsg'),
          variant: 'destructive',
        })
        return
      }

      // Handle inventory limit cases
      if (result.adjusted) {
        const maxAllowed = result.max
        const currentInCart = result.existing

        if (result.added && result.added > 0) {
          // Partial update case
          showToast({
            title: t('product.addedToCart'),
            description: `${t('product.adjustedCart.line1', {
              max: maxAllowed,
              existing: currentInCart,
            })}\n${t('product.adjustedCart.line2', {
              added: result.added,
            })}`,
            variant: 'warning',
          })
        } else {
          // No update possible case
          showToast({
            title: t('common.error'),
            description: t('product.adjustedCart.line1', {
              max: maxAllowed,
              existing: currentInCart,
            }),
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Error updating quantity:', error)
      showToast({
        title: t('cart.errorTitle'),
        description: t('cart.errorMsg'),
        variant: 'destructive',
      })
    } finally {
      // Reset the "isUpdating" state after a short delay
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
      if (!result.success) throw new Error(result.error)
    } catch (error) {
      console.error('Error removing item:', error)
      showToast({
        title: t('cart.errorTitle'),
        description: t('cart.errorMsg'),
        variant: 'destructive',
      })
    } finally {
      // Reset the "isUpdating" state after a short delay
      setTimeout(() => {
        setItemStates((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], isRemoving: false },
        }))
      }, 300)
    }
  }

  const handleClearCart = async () => {
    try {
      setIsClearingCart(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      const result = await clearCartAction()
      if (!result.success) throw new Error(result.error)
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

  const handleLanguageChange = (lang: Language) => {
    document.documentElement.dir = lang.direction
    document.documentElement.lang = lang.code
    setLocale(lang.code)
    setIsLangOpen(false)
  }

  // Get available text for a color
  const getColor = (colorName: string) => {
    const colorTranslation = t(`product.colors.${colorName}`)
    return locale() === 'ar' ? `${colorTranslation}` : `${colorTranslation}`
  }

  const handleSearchOpen = (isOpen: boolean) => {
    setIsSearchOpen(isOpen)
  }

  return (
    <>
      <nav class='fixed inset-x-0 z-50' dir={isRTL() ? 'rtl' : 'ltr'}>
        <div class='w-full md:container md:mx-auto md:!px-0'>
          <div
            class={`transition-all duration-300 md:rounded-lg ${
              isHomePage() && !isScrolled() && !isAnyDropdownOpen()
                ? 'bg-transparent'
                : 'supports-backdrop-blur:bg-white/95 backdrop-blur-md shadow-sm'
            }`}
          >
            {/* Top Bar */}
            <div class='flex h-16 items-center justify-between px-4'>
              {/* Logo */}
              <div class='flex items-center gap-4'>
                <A href='/' class={`font-bold text-xl transition-colors ${logoColor()}`}>
                  Souq El Rafay3
                </A>
              </div>

              {/* Search */}
              <div class='hidden md:flex flex-1 max-w-xl mx-4' ref={setSearchRef}>
                <Search onOpenChange={handleSearchOpen} isSearchOpen={isSearchOpen()} />
              </div>

              {/* Actions */}
              <div class='flex items-center gap-2'>
                {/* Cart */}
                <div class='hidden md:block relative' ref={setCartRef}>
                  <Show
                    when={!cartData.loading}
                    fallback={<div class='w-10 h-10 bg-gray-200/50 rounded-md animate-pulse' />}
                  >
                    <Button
                      variant='ghost'
                      size='icon'
                      class={`hover:bg-white/10 ${textColor()}`}
                      onClick={[handleDropdownClick, 'cart']}
                    >
                      <FiShoppingCart class='h-5 w-5' />
                      <Show when={cartData()?.items?.length > 0}>
                        <span
                          class='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 
    text-[10px] font-medium text-black flex items-center justify-center'
                        >
                          {cartItemsCount()}
                        </span>
                      </Show>
                    </Button>
                  </Show>

                  {/* Cart Dropdown */}
                  <div class={getDropdownStyles(isCartOpen(), isRTL()) + ' w-80'}>
                    <div class='p-2'>
                      <div class='flex items-center justify-between border-b pb-2'>
                        <h3 class='text-base font-semibold'>
                          {t('cart.title')}
                          <Show when={cartItemsCount() > 0}>
                            <span class='text-sm font-normal text-muted-foreground ml-1'>
                              ({cartItemsCount()} {t('cart.items')})
                            </span>
                          </Show>
                        </h3>
                      </div>

                      <Switch
                        fallback={
                          <div class='flex flex-col items-center justify-center pt-6 text-center'>
                            <FiShoppingCart class='h-8 w-8 text-muted-foreground mb-2' />
                            <p class='text-base font-medium mb-1'>{t('cart.emptyTitle')}</p>
                            <p class='text-sm text-muted-foreground mb-3'>{t('cart.emptyMessage')}</p>
                          </div>
                        }
                      >
                        <Match when={cartData.loading}>
                          <div class='space-y-2 py-2'>
                            <Skeleton class='h-16 w-full' />
                            <Skeleton class='h-16 w-full' />
                            <Skeleton class='h-16 w-full' />
                          </div>
                        </Match>
                        <Match when={cartData()?.items?.length > 0}>
                          <div class='max-h-[60vh] overflow-auto py-2 space-y-2'>
                            <For each={groupedCartItems()}>
                              {({ store, items }) => (
                                <div class='bg-card rounded-lg overflow-hidden border'>
                                  {/* Store Header */}
                                  <div class='bg-primary/5 px-2 py-1.5 flex items-center gap-1.5'>
                                    <BiSolidStore class='h-3 w-3' />
                                    <span class='text-xs font-medium truncate'>{store.storeName}</span>
                                  </div>

                                  {/* Store Items */}
                                  <div class='divide-y divide-border'>
                                    <For each={items}>
                                      {(item) => {
                                        const itemState = () =>
                                          itemStates()[item.productId] || { isUpdating: false, isRemoving: false }
                                        return (
                                          <div
                                            class={cn(
                                              'p-2 transition-all duration-300',
                                              itemState().isRemoving && 'opacity-0 translate-x-full',
                                              isClearingCart() && 'opacity-0 scale-95'
                                            )}
                                          >
                                            <div class='flex gap-2'>
                                              {/* Image container */}
                                              <div class='w-14 flex-shrink-0'>
                                                <div class='aspect-square w-full relative'>
                                                  <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    class='absolute inset-0 w-full h-full object-cover rounded'
                                                  />
                                                </div>
                                              </div>
                                              {/* Content container */}
                                              <div class='flex-1 min-w-0 flex flex-col justify-between'>
                                                <div class='flex justify-between items-start gap-1'>
                                                  <div>
                                                    <h3 class='font-medium text-xs line-clamp-1'>
                                                      {item.name} ({getColor(item.selectedColor)})
                                                    </h3>
                                                    <div class='text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1'>
                                                      <span>{formatCurrency(item.price)}</span>
                                                    </div>
                                                  </div>
                                                  <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => handleRemoveItem(item.productId, item.selectedColor)}
                                                    class={cn(
                                                      'text-destructive h-5 w-5 -mr-1',
                                                      itemState().isRemoving && 'animate-spin'
                                                    )}
                                                    title={t('cart.remove')}
                                                  >
                                                    <svg
                                                      xmlns='http://www.w3.org/2000/svg'
                                                      class='h-3 w-3'
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
                                                <div class='flex items-center justify-between mt-1'>
                                                  <div
                                                    class={cn(
                                                      'flex items-center border rounded',
                                                      itemState().isUpdating &&
                                                        'scale-110 transition-transform duration-200'
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
                                                      class='h-5 w-5 hover:bg-secondary/20'
                                                      title={t('cart.decrease')}
                                                    >
                                                      <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        class='h-2.5 w-2.5'
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
                                                    <span class='w-5 text-center text-xs'>{item.quantity}</span>
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
                                                      class='h-5 w-5 hover:bg-secondary/20'
                                                      title={t('cart.increase')}
                                                    >
                                                      <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        class='h-2.5 w-2.5'
                                                        viewBox='0 0 20 20'
                                                        fill='currentColor'
                                                      >
                                                        <path
                                                          fill-rule='evenodd'
                                                          d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 011-1z'
                                                          clip-rule='evenodd'
                                                        />
                                                      </svg>
                                                    </Button>
                                                  </div>
                                                  <span class='font-medium text-xs'>
                                                    {formatCurrency(item.price * item.quantity)}
                                                  </span>
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

                          <div class='border-t mt-2 pt-2 space-y-2'>
                            {/* Price breakdown */}
                            <div class='space-y-1.5'>
                              <div class='flex justify-between text-sm font-medium'>
                                <span>{t('cart.subtotal')}</span>
                                <span>{formatCurrency(cartTotal())}</span>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div class='grid grid-cols-2 gap-2'>
                              <Button
                                variant='pay'
                                size='sm'
                                class='w-full'
                                onClick={() => {
                                  setIsCartOpen(false)
                                  navigate('/checkout')
                                }}
                              >
                                {t('cart.checkout')}
                              </Button>
                              <Button
                                variant='destructive'
                                size='sm'
                                class={cn('w-full transition-transform duration-200', isClearingCart() && 'scale-95')}
                                onClick={handleClearCart}
                              >
                                {t('cart.clear')}
                              </Button>
                            </div>
                          </div>
                        </Match>
                      </Switch>
                    </div>
                  </div>
                </div>

                {/* Language Selector */}
                <div class='hidden md:block relative' ref={setLangRef}>
                  <Button
                    variant='ghost'
                    size='icon'
                    class={`hover:bg-white/10 ${textColor()}`}
                    onClick={[handleDropdownClick, 'lang']}
                  >
                    <RiEditorTranslate2 class='w-5 h-5' />
                  </Button>

                  <div class={getDropdownStyles(isLangOpen(), isRTL()) + ' w-36'}>
                    <div class='py-1'>
                      {languages.map((lang) => (
                        <button
                          class={`w-full px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between
                          transition-colors duration-200
                          ${locale() === lang.code ? 'bg-primary/10 font-medium' : ''}`}
                          onClick={() => handleLanguageChange(lang)}
                        >
                          <span class={`${isRTL() ? 'text-right' : 'text-left'}`}>{lang.nativeName}</span>
                          {locale() === lang.code && (
                            <svg
                              class='w-4 h-4 text-primary'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            >
                              <polyline points='20 6 9 17 4 12' />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Menu  REPLACED */}
                <Show when={isLargeScreen()}>
                  <UserButton
                    buttonColorClass={textColor()}
                    setIsUserOpen={setIsUserOpen}
                    setref={setUserRef}
                    isUserOpen={isUserOpen()}
                  />
                </Show>

                {/* Mobile Menu Button */}
                <div ref={setMenuRef}>
                  <Button
                    variant='ghost'
                    size='icon'
                    class={`hover:bg-white/10 h-10 w-10 p-0 ${textColor()}`}
                    onClick={[handleDropdownClick, 'menu']}
                    aria-label={isOpen() ? 'Close menu' : 'Open menu'}
                  >
                    <div class='w-5 h-5 flex items-center justify-center'>
                      <span
                        class={`absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out 
                        ${isOpen() ? 'rotate-45' : '-translate-y-1'}`}
                      />
                      <span
                        class={`absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out 
                        ${isOpen() ? '-rotate-45' : 'translate-y-1'}`}
                      />
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <div
              class='overflow-hidden transition-all duration-300 ease-in-out'
              style={{
                height: isOpen() ? 'auto' : '0',
              }}
            >
              <div class='px-4 py-4'>
                <ul class='space-y-2'>
                  {filteredMenuItems().map((link, index) => (
                    <li
                      style={{
                        animation: isOpen() ? `menuItemSlideDown 0.4s ease-out forwards` : '',
                        'animation-delay': `${index * 0.05}s`,
                        opacity: '0',
                      }}
                    >
                      <Button
                        as={A}
                        href={link.path}
                        variant='ghost'
                        class={getMobileMenuItemStyles(location.pathname === link.path, textColor())}
                      >
                        {t(link.key)}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style>
        {`
      @keyframes menuItemSlideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}
      </style>
    </>
  )
}

export default Nav
