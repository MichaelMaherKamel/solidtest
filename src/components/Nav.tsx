import { Component, createSignal, onMount, onCleanup } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { Show } from 'solid-js'
import { AiOutlineClose } from 'solid-icons/ai'
import { IoMenu } from 'solid-icons/io'
import UserButton from './auth/UserBtn'
import { createEffect } from 'solid-js'
import { supabase } from '~/lib/supabase/supabase'
import { AuthSession } from '@supabase/supabase-js'

const MENU_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/stores', label: 'Stores' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/admin', label: 'Admin' },
]

const Nav: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [session, setSession] = createSignal<AuthSession | null>(null)
  const [isScrolled, setIsScrolled] = createSignal(false)
  const location = useLocation()

  const isHomePage = () => location.pathname === '/'

  const active = (path: string) =>
    path === location.pathname
      ? 'bg-sky-700/50 border-sky-400'
      : 'border-transparent hover:bg-sky-700/30 hover:border-sky-300'

  const textColor = () => {
    if (isHomePage()) {
      return isScrolled() ? 'text-gray-800 hover:text-gray-900' : 'text-white hover:text-white'
    }
    return 'text-gray-800 hover:text-gray-900'
  }

  const logoColor = () => {
    if (isHomePage()) {
      return isScrolled() ? 'text-gray-900 hover:text-gray-800' : 'text-white hover:text-white/90'
    }
    return 'text-gray-900 hover:text-gray-800'
  }

  const toggleMenu = () => setIsOpen(!isOpen())

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50)
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll)

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    })
  })

  // Determine nav styles based on page and scroll position
  const navStyles = () => {
    if (isHomePage()) {
      if (isScrolled()) {
        return 'fixed w-full supports-backdrop-blur:bg-white/95 backdrop-blur-md shadow-md'
      }
      return 'fixed w-full bg-transparent'
    }
    return 'fixed w-full supports-backdrop-blur:bg-white/95 backdrop-blur-md shadow-md'
  }

  // Determine mobile menu styles
  const mobileMenuStyles = () => {
    const baseStyle = 'supports-backdrop-blur:bg-white/95 backdrop-blur-md'
    if (isHomePage()) {
      return isScrolled() ? baseStyle : 'bg-black/60'
    }
    return baseStyle
  }

  return (
    <nav class={`z-50 transition-all duration-300 ${navStyles()}`}>
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
                class={`border-b-2 transition-all duration-200 ${active(item.path)} ${textColor()}`}
              >
                {item.label}
              </Button>
            ))}
            <UserButton session={session()} />
          </div>

          <div class='flex md:hidden'>
            <Button variant='ghost' size='icon' class={`hover:bg-white/10 ${textColor()}`} onClick={toggleMenu}>
              <Show when={isOpen()} fallback={<IoMenu class='h-5 w-5' />}>
                <AiOutlineClose class='h-5 w-5' />
              </Show>
            </Button>
          </div>
        </div>

        <Show when={isOpen()}>
          <div class='md:hidden'>
            <div class={`px-2 pt-2 pb-3 space-y-2 animate-in slide-in-from-top duration-200 ${mobileMenuStyles()}`}>
              {MENU_ITEMS.map((item) => (
                <Button
                  as={A}
                  href={item.path}
                  variant='ghost'
                  class={`w-full justify-start border-l-4 ${active(item.path)} ${textColor()}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Button>
              ))}
              <div class='pt-2'>
                <UserButton session={session()} />
              </div>
            </div>
          </div>
        </Show>
      </div>
    </nav>
  )
}

export default Nav
