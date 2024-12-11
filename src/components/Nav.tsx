import { Component, createSignal, onMount, onCleanup, createEffect, createMemo, Suspense } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { A, useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { Show } from 'solid-js'
import { IoMenu } from 'solid-icons/io'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import UserButton from './auth/UserBtn'

const MENU_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/stores', label: 'Stores' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/admin', label: 'Admin' },
] as const

const isBrowser = () => typeof window !== 'undefined'

const Nav: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [isScrolled, setIsScrolled] = createSignal(false)
  const [isClient, setIsClient] = createSignal(false)
  const location = useLocation()
  const auth = useAuth()

  // Media query for md breakpoint
  const mdBreakpoint = '(min-width: 768px)'
  let initialScrollPosition = 0

  const lockScroll = () => {
    if (!isBrowser()) return
    initialScrollPosition = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${initialScrollPosition}px`
    document.body.style.width = '100%'
  }

  const unlockScroll = () => {
    if (!isBrowser()) return
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, initialScrollPosition)
  }

  const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches) {
      setIsOpen(false)
      unlockScroll()
    }
  }

  createEffect(() => {
    if (isOpen()) {
      lockScroll()
    } else {
      unlockScroll()
    }
  })

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
      unlockScroll()
    })
  })

  createEffect(() => {
    const session = auth.session()
    if (session === null || session === undefined) {
      setIsOpen(false)
      unlockScroll()
    }
  })

  createEffect(() => {
    if (isClient()) {
      setIsOpen(false)
      unlockScroll()
    }
  })

  const isHomePage = createMemo(() => location.pathname === '/')

  createEffect(() => {
    location.pathname
    setIsOpen(false)
    unlockScroll()
  })

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

  return (
    <Show when={isClient()}>
      <nav class={navStyles()}>
        {/* Rest of the navigation component remains the same */}
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
                  class={`border-b-2 transition-all duration-200 ${
                    active(item.path)
                      ? 'bg-sky-700/50 border-sky-400'
                      : 'border-transparent hover:bg-sky-700/30 hover:border-sky-300'
                  } ${textColor()}`}
                >
                  {item.label}
                </Button>
              ))}
              <div class='w-10'>
                <Suspense fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}>
                  <UserButton buttonColorClass={textColor()} />
                </Suspense>
              </div>
            </div>

            <div class='md:hidden flex items-center gap-2'>
              <Suspense fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}>
                <UserButton buttonColorClass={textColor()} />
              </Suspense>

              <Sheet open={isOpen()} onOpenChange={setIsOpen}>
                <SheetTrigger>
                  <Button variant='ghost' size='icon' class={`hover:bg-white/10 ${textColor()}`} aria-label='Menu'>
                    <IoMenu class='h-5 w-5' />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div class='flex flex-col space-y-4 pt-6'>
                    {MENU_ITEMS.map((item) => (
                      <Button
                        as={A}
                        href={item.path}
                        variant='ghost'
                        class={`justify-start ${
                          active(item.path)
                            ? 'bg-sky-700/50 border-sky-400'
                            : 'border-transparent hover:bg-sky-700/30 hover:border-sky-300'
                        }`}
                      >
                        {item.label}
                      </Button>
                    ))}
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
