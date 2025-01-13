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
import { Input } from '../ui/input'
import { useI18n } from '~/contexts/i18n'
import { FiShoppingCart } from 'solid-icons/fi'
import { RiEditorTranslate2 } from 'solid-icons/ri'
import { FaRegularUser } from 'solid-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useAuthState } from '~/contexts/auth'
import { getCart } from '~/db/fetchers/cart'
import { updateCartItemQuantity, removeCartItem, clearCart } from '~/db/actions/cart'

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

  // Refs
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>()
  const [langRef, setLangRef] = createSignal<HTMLDivElement>()
  const [userRef, setUserRef] = createSignal<HTMLDivElement>()
  const [cartRef, setCartRef] = createSignal<HTMLDivElement>()

  // Hooks
  const location = useLocation()
  const auth = useAuthState()
  const { t, locale, setLocale } = useI18n()
  const cartData = createAsync(() => getCart())
  const navigate = useNavigate()
  const updateQuantity = useAction(updateCartItemQuantity)
  const removeItem = useAction(removeCartItem)
  const clearCartAction = useAction(clearCart)

  // Memos
  const isRTL = createMemo(() => locale() === 'ar')
  const isHomePage = createMemo(() => location.pathname === '/')

  const userData = createMemo(() => ({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    image: auth.user?.image || '',
    initials: auth.user?.name?.[0]?.toUpperCase() || 'U',
    role: auth.user?.role || 'guest',
  }))

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
  const isAnyDropdownOpen = createMemo(() => isOpen() || isCartOpen() || isLangOpen() || isUserOpen())

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
      const user = userRef()
      const cart = cartRef()

      if (menu && !menu.contains(clickedEl) && isOpen()) setIsOpen(false)
      if (lang && !lang.contains(clickedEl) && isLangOpen()) setIsLangOpen(false)
      if (user && !user.contains(clickedEl) && isUserOpen()) setIsUserOpen(false)
      if (cart && !cart.contains(clickedEl) && isCartOpen()) setIsCartOpen(false)
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
    if (except !== 'user') setIsUserOpen(false)
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
      case 'user':
        setIsUserOpen(!isUserOpen())
        break
      case 'cart':
        setIsCartOpen(!isCartOpen())
        break
    }
  }

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
      if (!result.success) throw new Error(result.error)
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
      if (!result.success) throw new Error(result.error)
    } catch (error) {
      console.error('Error removing item:', error)
      alert(t('cart.error'))
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
      alert(t('cart.error'))
    } finally {
      setIsClearingCart(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsUserOpen(false)
      await auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      alert(t('auth.signOutError'))
    }
  }

  const handleLanguageChange = (lang: Language) => {
    document.documentElement.dir = lang.direction
    document.documentElement.lang = lang.code
    setLocale(lang.code)
    setIsLangOpen(false)
  }

  const getLoginUrl = () => {
    const currentPath = location.pathname || '/'
    return currentPath === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(currentPath)}`
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
              <div class='hidden md:flex flex-1 max-w-xl mx-4'>
                <Input type='search' placeholder={t('common.search')} class={`w-full ${textColor()}`} />
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
                          {cartData().items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      </Show>
                    </Button>
                  </Show>

                  {/* Cart Dropdown */}
                  <div class={getDropdownStyles(isCartOpen(), isRTL()) + ' w-80'}>
                    <div class='p-4'>
                      <h3 class='text-lg font-medium mb-4'>{t('cart.title')}</h3>
                      <Switch fallback={<div class='text-sm text-gray-500 text-center py-4'>{t('cart.empty')}</div>}>
                        <Match when={cartData.loading}>
                          <div class='space-y-4'>
                            <Skeleton class='h-20 w-full' />
                            <Skeleton class='h-20 w-full' />
                          </div>
                        </Match>
                        <Match when={cartData()?.items?.length > 0}>
                          <div class='space-y-4 max-h-[60vh] overflow-auto'>
                            <For each={cartData().items}>
                              {(item) => {
                                const itemState = () =>
                                  itemStates()[item.productId] || { isUpdating: false, isRemoving: false }

                                return (
                                  <div
                                    class={`flex gap-4 py-2 relative group transition-all duration-300
                                      ${
                                        itemState().isRemoving
                                          ? 'opacity-0 transform translate-x-full'
                                          : 'opacity-100 transform translate-x-0'
                                      }
                                      ${
                                        isClearingCart()
                                          ? 'opacity-0 transform scale-95'
                                          : 'opacity-100 transform scale-100'
                                      }`}
                                  >
                                    <div class='w-16 h-16 bg-gray-100 rounded'>
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        class='w-full h-full object-cover rounded'
                                      />
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
                                            class='px-2 py-1 hover:bg-gray-100 disabled:opacity-50'
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
                          <div class='border-t mt-4 pt-4'>
                            <div class='flex justify-between items-center mb-4'>
                              <span class='font-medium'>{t('cart.total')}</span>
                              <span class='font-medium'>
                                {t('currency', {
                                  value: cartData()?.items.reduce(
                                    (total, item) => total + item.price * item.quantity,
                                    0
                                  ),
                                })}
                              </span>
                            </div>
                            <div class='flex gap-2'>
                              <Button
                                variant='destructive'
                                class={`flex-1 transition-transform duration-200 ${
                                  isClearingCart() ? 'scale-95' : 'scale-100'
                                }`}
                                onClick={handleClearCart}
                              >
                                {t('cart.clear')}
                              </Button>
                              <Button
                                variant='pay'
                                class='flex-1'
                                onClick={() => {
                                  setIsCartOpen(false)
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

                {/* User Menu */}
                <div class='hidden md:block relative' ref={setUserRef}>
                  <Switch
                    fallback={
                      <A
                        href={getLoginUrl()}
                        class={`inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10 ${textColor()}`}
                      >
                        <FaRegularUser class='h-5 w-5' />
                      </A>
                    }
                  >
                    <Match when={auth.status === 'loading'}>
                      <div class='h-10 w-10'>
                        <Skeleton height={40} width={40} radius={20} />
                      </div>
                    </Match>
                    <Match when={auth.status === 'authenticated'}>
                      <>
                        <Button
                          variant='ghost'
                          class={`relative h-10 w-10 rounded-full ${textColor()}`}
                          onClick={[handleDropdownClick, 'user']}
                        >
                          <Avatar>
                            <AvatarImage src={userData().image} alt={userData().name || 'User avatar'} />
                            <AvatarFallback>{userData().initials}</AvatarFallback>
                          </Avatar>
                        </Button>

                        <div class={getDropdownStyles(isUserOpen(), isRTL()) + ' w-64'}>
                          <div class='py-1'>
                            <Show
                              when={!auth.loading}
                              fallback={
                                <div class='px-4 py-2'>
                                  <Skeleton class='h-4 w-32 mb-2' />
                                  <Skeleton class='h-3 w-24' />
                                </div>
                              }
                            >
                              <div class='px-4 py-2 text-sm text-gray-700'>
                                <div class='font-medium line-clamp-1'>{userData().name}</div>
                                <div class='text-xs text-gray-500 line-clamp-1'>{userData().email}</div>
                              </div>
                            </Show>
                            <hr class='border-gray-200' />
                            <A
                              href='/account'
                              class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                            >
                              {t('nav.account')}
                            </A>
                            {userData().role === 'admin' && (
                              <A
                                href='/admin'
                                class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                              >
                                {t('nav.admin')}
                              </A>
                            )}
                            {userData().role === 'seller' && (
                              <A
                                href='/seller'
                                class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                              >
                                {t('nav.seller')}
                              </A>
                            )}
                            <hr class='my-1 border-gray-200' />
                            <button
                              class={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200
                                ${isRTL() ? 'text-right' : 'text-left'}`}
                              onClick={handleSignOut}
                            >
                              {t('auth.signOut')}
                            </button>
                          </div>
                        </div>
                      </>
                    </Match>
                  </Switch>
                </div>

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
