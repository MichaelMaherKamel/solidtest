import { Component, createSignal, onMount, onCleanup, createEffect, createMemo, Suspense, Show } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { A, useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { Input } from './ui/input'
import UserButton from './auth/UserBtn'
import { useI18n } from '~/contexts/i18n'
import { LocalizationButton } from './LocalizationButton'
import { FiShoppingCart } from 'solid-icons/fi'

const Nav: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [isScrolled, setIsScrolled] = createSignal(false)
  const [isClient, setIsClient] = createSignal(false)
  const [isSessionLoaded, setIsSessionLoaded] = createSignal(false)
  const location = useLocation()
  const auth = useAuth()
  const { t, locale } = useI18n()

  const isRTL = createMemo(() => locale() === 'ar')
  const menuRef = createSignal<HTMLDivElement>()

  // Initialize and track session state
  createEffect(() => {
    const session = auth.session()
    const status = auth.status()
    if (status !== 'loading' && session !== undefined) {
      setIsSessionLoaded(true)
    }
  })

  // Handle escape key
  createEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen()) {
        setIsOpen(false)
      }
    }

    if (isOpen()) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => window.removeEventListener('keydown', handleEscape)
  })

  // Handle click outside
  createEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = menuRef[0]()
      if (menu && !menu.contains(e.target as Node) && isOpen()) {
        setIsOpen(false)
      }
    }

    if (isOpen()) {
      document.addEventListener('click', handleClickOutside)
    }

    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside)
    })
  })

  // Close menu on route change
  createEffect(() => {
    location.pathname
    setIsOpen(false)
  })

  const userRole = createMemo(() => {
    const session = auth.session()
    return session?.user?.role || 'guest'
  })

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
      return item.roles.includes(userRole())
    })
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

  const isHomePage = createMemo(() => location.pathname === '/')
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

  return (
    <Show when={isClient()}>
      <nav class='fixed inset-x-0 z-50' dir={isRTL() ? 'rtl' : 'ltr'} ref={menuRef[1]}>
        <div class='w-full md:container md:mx-auto'>
          <div
            class={`transition-all duration-300 md:mx-4 md:rounded-lg ${
              isHomePage() && !isScrolled() && !isOpen()
                ? 'bg-transparent'
                : 'supports-backdrop-blur:bg-white/95 backdrop-blur-md shadow-md'
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
                {/* Cart - Desktop Only */}
                <Button variant='ghost' size='icon' class={`hidden md:flex hover:bg-white/10 ${textColor()}`}>
                  <FiShoppingCart class='h-5 w-5' />
                </Button>

                {/* Language Switch - Desktop Only */}
                <div class='hidden md:block'>
                  <LocalizationButton iconOnly variant='ghost' size='icon' class={`hover:bg-white/10 ${textColor()}`} />
                </div>

                {/* User Button - Desktop Only */}
                <div class='w-10 hidden md:block'>
                  <Show
                    when={isSessionLoaded()}
                    fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}
                  >
                    <Suspense fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}>
                      <UserButton buttonColorClass={textColor()} />
                    </Suspense>
                  </Show>
                </div>

                {/* Mobile Menu Button */}
                <Button
                  variant='ghost'
                  size='icon'
                  class={`hover:bg-white/10 h-10 w-10 p-0 ${textColor()}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen())
                  }}
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

            {/* Mobile Menu */}
            <div
              class='overflow-hidden transition-all duration-300 ease-in-out'
              style={{
                height: isOpen() ? 'auto' : '0',
              }}
            >
              <div class='px-4 py-4'>
                <ul class='space-y-2'>
                  {/* Language Switch in Mobile Menu */}
                  <li class='md:hidden'>
                    <Button
                      variant='ghost'
                      class={`justify-start w-full text-start border-transparent hover:bg-sky-700/30 hover:border-sky-300 ${textColor()}`}
                      onClick={() => {
                        // Toggle language logic here
                      }}
                    >
                      {t('nav.language')}
                    </Button>
                  </li>

                  {/* Regular Menu Items */}
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
