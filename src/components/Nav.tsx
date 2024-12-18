import { Component, createSignal, onMount, onCleanup, createEffect, createMemo, Suspense, Show } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { A, useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { IoMenu } from 'solid-icons/io'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import UserButton from './auth/UserBtn'
import { useI18n } from '~/contexts/i18n'
import { LocalizationButton } from './LocalizationButton'

const isBrowser = () => typeof window !== 'undefined'

interface NavItem {
  path: string
  key: string
  roles?: string[]
}

const Nav: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [isScrolled, setIsScrolled] = createSignal(false)
  const [isClient, setIsClient] = createSignal(false)
  const [isSessionLoaded, setIsSessionLoaded] = createSignal(false)
  const location = useLocation()
  const auth = useAuth()
  const { t, locale } = useI18n()

  const isRTL = createMemo(() => locale() === 'ar')

  // Initialize and track session state
  createEffect(() => {
    const session = auth.session()
    const status = auth.status()

    if (status !== 'loading' && session !== undefined) {
      setIsSessionLoaded(true)
      console.log('Nav session loaded:', { status, session })
    }
  })

  const userRole = createMemo(() => {
    const session = auth.session()
    return session?.user?.role || 'guest'
  })

  const MENU_ITEMS: NavItem[] = [
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

  // Media query handling
  const mdBreakpoint = '(min-width: 768px)'
  let scrollPosition = 0

  const lockScroll = () => {
    if (!isBrowser()) return
    scrollPosition = window.pageYOffset
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = '100%'
  }

  const unlockScroll = () => {
    if (!isBrowser()) return
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('position')
    document.body.style.removeProperty('top')
    document.body.style.removeProperty('width')
    window.scrollTo(0, scrollPosition)
  }

  const handleSheetChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }

  const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches && isOpen()) {
      handleSheetChange(false)
    }
  }

  onMount(() => {
    setIsClient(true)
    if (!isBrowser()) return

    const mediaQuery = window.matchMedia(mdBreakpoint)
    handleMediaChange(mediaQuery)
    mediaQuery.addEventListener('change', handleMediaChange)

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
      mediaQuery.removeEventListener('change', handleMediaChange)
      window.removeEventListener('scroll', handleScroll)
      if (scrollRAF) {
        cancelAnimationFrame(scrollRAF)
      }
      if (isOpen()) {
        unlockScroll()
      }
    })
  })

  // Reset mobile menu on auth state change
  createEffect(() => {
    const session = auth.session()
    const status = auth.status()

    if (status === 'unauthenticated' || session === null) {
      handleSheetChange(false)
    }
  })

  // Reset mobile menu on route change
  createEffect(() => {
    location.pathname
    handleSheetChange(false)
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

  const renderUserButton = () => (
    <Show when={isSessionLoaded()} fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}>
      <Suspense fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}>
        <UserButton buttonColorClass={textColor()} />
      </Suspense>
    </Show>
  )

  return (
    <Show when={isClient()}>
      <nav
        class={`fixed w-full transition-all duration-300 z-50 ${
          isHomePage() && !isScrolled()
            ? 'bg-transparent'
            : 'supports-backdrop-blur:bg-white/95 backdrop-blur-md shadow-md'
        }`}
        dir={isRTL() ? 'rtl' : 'ltr'}
      >
        <div class='container mx-auto px-4'>
          {/* Desktop Navigation */}
          <div class='hidden md:flex h-16 items-center justify-between'>
            <A href='/' class={`font-bold text-xl transition-colors ${logoColor()}`}>
              Souq El Rafay3
            </A>

            <div class='flex items-center gap-4'>
              <div class='flex items-center gap-2'>
                {filteredMenuItems().map((item) => (
                  <Button
                    as={A}
                    href={item.path}
                    variant='ghost'
                    class={`border-b-2 transition-all duration-200 ${
                      active(item.path)
                        ? 'bg-sky-700/50 border-sky-400'
                        : 'border-transparent hover:bg-sky-700/30 hover:border-sky-300'
                    } ${textColor()}`}
                  >
                    {t(item.key)}
                  </Button>
                ))}
              </div>

              <div class='flex items-center gap-2'>
                <LocalizationButton />
                <div class='w-10'>{renderUserButton()}</div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div class='md:hidden flex h-16 items-center justify-between'>
            <A href='/' class={`font-bold text-xl transition-colors ${logoColor()}`}>
              Souq El Rafay3
            </A>

            <div class='flex items-center gap-2'>
              {renderUserButton()}

              <Sheet open={isOpen()} onOpenChange={handleSheetChange}>
                <SheetTrigger>
                  <Button
                    variant='ghost'
                    size='icon'
                    class={`hover:bg-white/10 ${textColor()}`}
                    aria-label={t('nav.menuLabel')}
                  >
                    <IoMenu class='h-5 w-5' />
                  </Button>
                </SheetTrigger>
                <SheetContent position={isRTL() ? 'right' : 'left'}>
                  <div class='flex flex-col space-y-4 pt-6'>
                    {filteredMenuItems().map((item) => (
                      <Button
                        as={A}
                        href={item.path}
                        variant='ghost'
                        class={`justify-start w-full text-start ${
                          active(item.path)
                            ? 'bg-sky-700/50 border-sky-400'
                            : 'border-transparent hover:bg-sky-700/30 hover:border-sky-300'
                        }`}
                      >
                        {t(item.key)}
                      </Button>
                    ))}
                    <LocalizationButton onLocaleChange={() => handleSheetChange(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </Show>
  )
}

export default Nav
