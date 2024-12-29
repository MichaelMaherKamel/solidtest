// ~/components/Nav.tsx
import { Component, createSignal, onMount, createEffect, createMemo, Show } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { A, useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useI18n } from '~/contexts/i18n'
import { FiShoppingCart } from 'solid-icons/fi'
import { RiEditorTranslate2 } from 'solid-icons/ri'
import { handleSession } from '~/db/actions/auth'
import UserButton from './auth/UserBtn'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import type { Session } from '@auth/core/types'

interface Language {
  code: 'en' | 'ar'
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
]

const Nav: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [isLangOpen, setIsLangOpen] = createSignal(false)
  const [isScrolled, setIsScrolled] = createSignal(false)
  const [isClient, setIsClient] = createSignal(false)
  const [currentSession, setCurrentSession] = createSignal<Session | null>(null)

  const location = useLocation()
  const auth = useAuth()
  const { t, locale, setLocale } = useI18n()

  // Handle session initialization and refresh
  createEffect(() => {
    const status = auth.status()
    const session = auth.session()

    if (session) {
      setCurrentSession(session)
      handleSession(session)
    } else if (status === 'unauthenticated') {
      auth.refetch()
    }
  })

  const isRTL = createMemo(() => locale() === 'ar')
  const isHomePage = createMemo(() => location.pathname === '/')

  // Menu items configuration
  const MENU_ITEMS = [
    { path: '/', key: 'nav.home' },
    { path: '/about', key: 'nav.about' },
    { path: '/stores', key: 'nav.stores' },
    { path: '/gallery', key: 'nav.gallery' },
    { path: '/admin', key: 'nav.admin', roles: ['admin'] },
    { path: '/seller', key: 'nav.seller', roles: ['seller'] },
  ]

  const filteredMenuItems = createMemo(() => {
    const userRole = currentSession()?.user?.role
    return MENU_ITEMS.filter((item) => {
      if (!item.roles) return true
      return userRole && item.roles.includes(userRole)
    })
  })

  // Handle mobile menu
  const handleMenuClick = () => {
    setIsOpen(!isOpen())
  }

  // Language handling
  const handleLanguageChange = (lang: Language) => {
    document.documentElement.dir = lang.direction
    document.documentElement.lang = lang.code
    setLocale(lang.code)
    setIsLangOpen(false)
  }

  // Scroll handling
  onMount(() => {
    setIsClient(true)
    let scrollRAF: number

    const handleScroll = () => {
      if (scrollRAF) cancelAnimationFrame(scrollRAF)
      scrollRAF = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollRAF) cancelAnimationFrame(scrollRAF)
    }
  })

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

  return (
    <Show when={isClient()}>
      <nav class='fixed inset-x-0 z-50' dir={isRTL() ? 'rtl' : 'ltr'}>
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
                {/* Cart Button */}
                <Button variant='ghost' size='icon' class={`hidden md:flex hover:bg-white/10 ${textColor()}`}>
                  <FiShoppingCart class='h-5 w-5' />
                </Button>

                {/* Language Dropdown */}
                <div class='hidden md:block'>
                  <DropdownMenu open={isLangOpen()} onOpenChange={setIsLangOpen}>
                    <DropdownMenuTrigger>
                      <Button variant='ghost' size='icon' class={`hover:bg-white/10 ${textColor()}`}>
                        <RiEditorTranslate2 class='w-5 h-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          onClick={() => handleLanguageChange(lang)}
                          class={locale() === lang.code ? 'bg-primary/10 font-medium' : ''}
                        >
                          <span class={`${isRTL() ? 'text-right' : 'text-left'} flex-1`}>{lang.nativeName}</span>
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
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* User Menu - Desktop Only */}
                <div class='hidden md:block'>
                  <UserButton buttonColorClass={textColor()} />
                </div>

                {/* Mobile Menu Button */}
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
