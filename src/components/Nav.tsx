import { Component, createSignal, onMount, onCleanup, createEffect, createMemo, Suspense } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { useAuth } from '@solid-mediakit/auth/client'
import type { Session } from '@solid-mediakit/auth'
import { Button } from './ui/button'
import { Show } from 'solid-js'
import { AiOutlineClose } from 'solid-icons/ai'
import { IoMenu } from 'solid-icons/io'
import UserButton from './auth/UserBtn'

const MENU_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/stores', label: 'Stores' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/admin', label: 'Admin' },
] as const

// Helper function to check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined'

const Nav: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [isScrolled, setIsScrolled] = createSignal(false)
  const [currentSession, setCurrentSession] = createSignal<Session | null>(null)
  const location = useLocation()
  const auth = useAuth()

  // Prevent body scroll when mobile menu is open
  createEffect(() => {
    if (!isBrowser()) return

    if (isOpen()) {
      document.body.style.overflow = 'hidden'
      // Add padding right to body equal to scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  })

  // Debounced scroll handler with RAF for better performance
  let scrollRAF: number
  const handleScroll = () => {
    if (!isBrowser()) return

    if (scrollRAF) {
      cancelAnimationFrame(scrollRAF)
    }
    scrollRAF = requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 50)
    })
  }

  const isHomePage = createMemo(() => location.pathname === '/')

  createEffect(() => {
    const session = auth.session()
    if (session !== currentSession()) {
      setCurrentSession(session || null)
    }
  })

  // Close mobile menu on route change
  createEffect(() => {
    location.pathname
    setIsOpen(false)
  })

  onMount(() => {
    if (!isBrowser()) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onCleanup(() => {
    if (!isBrowser()) return

    window.removeEventListener('scroll', handleScroll)
    if (scrollRAF) {
      cancelAnimationFrame(scrollRAF)
    }
  })

  const active = createMemo(
    () => (path: string) =>
      path === location.pathname
        ? 'bg-sky-700/50 border-sky-400'
        : 'border-transparent hover:bg-sky-700/30 hover:border-sky-300'
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

  const navStyles = createMemo(() => {
    const baseStyles = 'fixed w-full transition-all duration-300 z-50'
    if (isHomePage()) {
      if (isScrolled()) {
        return `${baseStyles} supports-backdrop-blur:bg-white/95 backdrop-blur-md shadow-md`
      }
      return `${baseStyles} bg-transparent`
    }
    return `${baseStyles} supports-backdrop-blur:bg-white/95 backdrop-blur-md shadow-md`
  })

  const mobileMenuStyles = createMemo(() => {
    const baseStyle = 'supports-backdrop-blur:bg-white/95 backdrop-blur-md'
    if (isHomePage()) {
      return isScrolled() ? baseStyle : 'bg-black/60'
    }
    return baseStyle
  })

  return (
    <nav class={navStyles()}>
      <div class='container mx-auto px-4'>
        <div class='flex items-center justify-between h-16'>
          <div class='flex-shrink-0'>
            <A href='/' class={`font-bold text-xl transition-colors ${logoColor()}`}>
              Souq El Rafay3
            </A>
          </div>

          <div class='hidden md:flex items-center gap-2'>
            {MENU_ITEMS.map((item) => (
              <Button
                as={A}
                href={item.path}
                variant='ghost'
                class={`border-b-2 transition-all duration-200 ${active()(item.path)} ${textColor()}`}
              >
                {item.label}
              </Button>
            ))}
            <div class='w-10'>
              <Suspense fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}>
                <UserButton session={currentSession()} />
              </Suspense>
            </div>
          </div>

          <div class='flex md:hidden'>
            <Button
              variant='ghost'
              size='icon'
              class={`hover:bg-white/10 ${textColor()}`}
              onClick={() => setIsOpen(!isOpen())}
              aria-label={isOpen() ? 'Close menu' : 'Open menu'}
            >
              <Show when={isOpen()} fallback={<IoMenu class='h-5 w-5' />}>
                <AiOutlineClose class='h-5 w-5' />
              </Show>
            </Button>
          </div>
        </div>

        <Show when={isOpen()}>
          <div class='md:hidden'>
            <div
              class={`px-2 pt-2 pb-3 space-y-2 animate-in slide-in-from-top duration-200 ${mobileMenuStyles()}`}
              role='menu'
            >
              {MENU_ITEMS.map((item) => (
                <Button
                  as={A}
                  href={item.path}
                  variant='ghost'
                  class={`w-full justify-start border-l-4 ${active()(item.path)} ${textColor()}`}
                  onClick={() => setIsOpen(false)}
                  role='menuitem'
                >
                  {item.label}
                </Button>
              ))}
              <div class='pt-2'>
                <Suspense fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}>
                  <UserButton session={currentSession()} />
                </Suspense>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </nav>
  )
}

export default Nav
