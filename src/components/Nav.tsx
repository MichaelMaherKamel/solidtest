import { Component, createSignal, onMount, onCleanup, createEffect, createMemo, Show, Switch, Match } from 'solid-js'
import { Skeleton } from '~/components/ui/skeleton'
import { A, useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useI18n } from '~/contexts/i18n'
import { FiShoppingCart } from 'solid-icons/fi'
import { RiEditorTranslate2 } from 'solid-icons/ri'
import { FaRegularUser } from 'solid-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useAuthState } from '~/contexts/auth'

interface Language {
  code: 'en' | 'ar'
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
  },
]

const Nav: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [isLangOpen, setIsLangOpen] = createSignal(false)
  const [isUserOpen, setIsUserOpen] = createSignal(false)
  const [isScrolled, setIsScrolled] = createSignal(false)
  const [isClient, setIsClient] = createSignal(false)

  const location = useLocation()
  const auth = useAuthState()
  const { t, locale, setLocale } = useI18n()

  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>()
  const [langRef, setLangRef] = createSignal<HTMLDivElement>()
  const [userRef, setUserRef] = createSignal<HTMLDivElement>()

  const isRTL = createMemo(() => locale() === 'ar')
  const isHomePage = createMemo(() => location.pathname === '/')

  // Auth effect to handle user state updates
  createEffect(() => {
    if (auth.user) {
      // Handle any nav-specific user state updates
    }
  })

  // Scroll handling
  onMount(() => {
    setIsClient(true)
    let scrollRAF: number
    const handleScroll = () => {
      if (scrollRAF) {
        cancelAnimationFrame(scrollRAF)
      }
      scrollRAF = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollRAF) {
        cancelAnimationFrame(scrollRAF)
      }
    })
  })

  const handleSignOut = async () => {
    try {
      setIsUserOpen(false)
      await auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      alert(t('auth.signOutError'))
    }
  }

  // User data from auth context
  const userData = createMemo(() => ({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    image: auth.user?.image || '',
    initials: auth.user?.name?.[0]?.toUpperCase() || 'U',
    role: auth.user?.role || 'guest',
  }))

  // Dropdown handlers
  const closeAllDropdowns = (except?: 'menu' | 'lang' | 'user') => {
    if (except !== 'menu') setIsOpen(false)
    if (except !== 'lang') setIsLangOpen(false)
    if (except !== 'user') setIsUserOpen(false)
  }

  // Click outside handling
  createEffect(() => {
    if (!isOpen() && !isLangOpen() && !isUserOpen()) return

    const handleClickOutside = (e: MouseEvent) => {
      const clickedEl = e.target as Node
      const menu = menuRef()
      const lang = langRef()
      const user = userRef()

      if (menu && !menu.contains(clickedEl) && isOpen()) {
        setIsOpen(false)
      }
      if (lang && !lang.contains(clickedEl) && isLangOpen()) {
        setIsLangOpen(false)
      }
      if (user && !user.contains(clickedEl) && isUserOpen()) {
        setIsUserOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllDropdowns()
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    })
  })

  const handleMenuClick = (e: Event) => {
    e.stopPropagation()
    closeAllDropdowns('menu')
    setIsOpen(!isOpen())
  }

  const handleLangClick = (e: Event) => {
    e.stopPropagation()
    closeAllDropdowns('lang')
    setIsLangOpen(!isLangOpen())
  }

  const handleUserClick = (e: Event) => {
    e.stopPropagation()
    closeAllDropdowns('user')
    setIsUserOpen(!isUserOpen())
  }

  // Style helpers
  const active = (path: string) => location.pathname === path

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

  // Language handling
  const handleLanguageChange = async (lang: Language) => {
    document.documentElement.dir = lang.direction
    document.documentElement.lang = lang.code
    setLocale(lang.code)
    setIsLangOpen(false)
  }

  // Menu configuration
  const MENU_ITEMS = [
    { path: '/', key: 'nav.home' },
    { path: '/about', key: 'nav.about' },
    { path: '/stores', key: 'nav.stores' },
    { path: '/gallery', key: 'nav.gallery' },
    { path: '/admin', key: 'nav.admin', roles: ['admin'] },
    { path: '/seller', key: 'nav.seller', roles: ['seller'] },
  ]

  const filteredMenuItems = createMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (!item.roles) return true
      return item.roles.includes(userData().role)
    })
  })

  const getLoginUrl = () => {
    const currentPath = location.pathname || '/'
    return currentPath === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(currentPath)}`
  }

  // Close dropdowns on route change
  createEffect(() => {
    location.pathname
    closeAllDropdowns()
  })

  return (
    <Show when={isClient()}>
      <nav class='fixed inset-x-0 z-50' dir={isRTL() ? 'rtl' : 'ltr'}>
        <div class='w-full md:container md:mx-auto md:!px-0'>
          <div
            class={`transition-all duration-300 md:rounded-md ${
              isHomePage() && !isScrolled() && !isOpen()
                ? 'bg-transparent'
                : 'supports-backdrop-blur:bg-white/95 backdrop-blur-md shadow-sm'
            }`}
          >
            <div class='flex h-16 items-center justify-between px-4'>
              {/* Logo Section */}
              <div class='flex items-center gap-4'>
                <A href='/' class={`font-bold text-xl transition-colors ${logoColor()}`}>
                  Souq El Rafay3
                </A>
              </div>

              {/* Search Bar - Desktop Only */}
              <div class='hidden md:flex flex-1 max-w-xl mx-4'>
                <Input type='search' placeholder={t('search.placeholder')} class={`w-full ${textColor()}`} />
              </div>

              {/* Right Actions */}
              <div class='flex items-center gap-2'>
                {/* Cart Button */}
                <Button variant='ghost' size='icon' class={`hidden md:flex hover:bg-white/10 ${textColor()}`}>
                  <FiShoppingCart class='h-5 w-5' />
                </Button>

                {/* Language Dropdown - Desktop Only */}
                <div class='hidden md:block relative' ref={setLangRef}>
                  <Button
                    variant='ghost'
                    size='icon'
                    class={`hover:bg-white/10 ${textColor()}`}
                    onClick={handleLangClick}
                  >
                    <RiEditorTranslate2 class='w-5 h-5' />
                  </Button>

                  <div
                    class={`absolute ${
                      isRTL() ? 'left-0' : 'right-0'
                    } mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                      isLangOpen()
                        ? 'opacity-100 transform scale-100'
                        : 'opacity-0 transform scale-95 pointer-events-none'
                    }`}
                  >
                    <div class='py-1'>
                      {languages.map((lang) => (
                        <button
                          class={`w-full px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                            locale() === lang.code ? 'bg-primary/10 font-medium' : ''
                          }`}
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

                {/* User Dropdown - Desktop Only */}
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
                          onClick={handleUserClick}
                        >
                          <Avatar>
                            <AvatarImage src={userData().image} alt={userData().name || 'User avatar'} />
                            <AvatarFallback>{userData().initials}</AvatarFallback>
                          </Avatar>
                        </Button>

                        <div
                          class={`absolute ${
                            isRTL() ? 'left-0' : 'right-0'
                          } mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                            isUserOpen()
                              ? 'opacity-100 transform scale-100'
                              : 'opacity-0 transform scale-95 pointer-events-none'
                          }`}
                        >
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
                            <hr />
                            <A
                              href='/account'
                              class={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                isRTL() ? 'text-right' : 'text-left'
                              }`}
                            >
                              {t('nav.account')}
                            </A>
                            {userData().role === 'admin' && (
                              <A href='/admin' class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                {t('nav.admin')}
                              </A>
                            )}
                            {userData().role === 'seller' && (
                              <A href='/seller' class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                {t('nav.seller')}
                              </A>
                            )}
                            <hr class='my-1 border-gray-200' />
                            <button
                              class={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                isRTL() ? 'text-right' : 'text-left'
                              }`}
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
                    onClick={handleMenuClick}
                    aria-label={isOpen() ? 'Close menu' : 'Open menu'}
                  >
                    <div class='w-5 h-5 flex items-center justify-center'>
                      <span
                        class={`absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out origin-${
                          isRTL() ? 'left' : 'right'
                        } ${isOpen() ? 'rotate-45' : `${isRTL() ? 'translate-x-0' : '-translate-x-0'} -translate-y-1`}`}
                      />
                      <span
                        class={`absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out origin-${
                          isRTL() ? 'left' : 'right'
                        } ${isOpen() ? '-rotate-45' : `${isRTL() ? 'translate-x-0' : '-translate-x-0'} translate-y-1`}`}
                      />
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu - Only Navigation Items */}
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
                        class={`justify-start w-full text-start ${
                          active(link.path)
                            ? 'bg-sky-700/50 border-sky-400'
                            : 'border-transparent hover:bg-sky-700/30 hover:border-sky-300'
                        } ${textColor()}`}
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
    </Show>
  )
}

export default Nav
