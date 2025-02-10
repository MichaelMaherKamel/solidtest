// CheckoutNav.tsx
import { Component, Show, createSignal, onCleanup, createEffect, Match, Switch } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { useI18n } from '~/contexts/i18n'
import { useAuth } from '@solid-mediakit/auth/client'
import { FaRegularUser } from 'solid-icons/fa'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Skeleton } from '~/components/ui/skeleton'
import { Logo } from '../Icons'

const CheckoutNav: Component = () => {
  const { t, locale } = useI18n()
  // const auth = useAuthState() REMOVED
  const auth = useAuth() // ADDED
  const location = useLocation()
  const isRTL = () => locale() === 'ar'

  const [isUserOpen, setIsUserOpen] = createSignal(false)
  const [userRef, setUserRef] = createSignal<HTMLDivElement>()

  // Handle click outside
  createEffect(() => {
    if (!isUserOpen()) return

    const handleClickOutside = (e: MouseEvent) => {
      const clickedEl = e.target as Node
      const user = userRef()

      if (user && !user.contains(clickedEl)) {
        setIsUserOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsUserOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    })
  })

  const getLoginUrl = () => {
    const currentPath = location.pathname || '/'
    return currentPath === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(currentPath)}`
  }

  const userData = () => {
    const session = auth.session()
    return {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      image: session?.user?.image || '',
      initials: session?.user?.name?.[0]?.toUpperCase() || 'U',
      role: session?.user?.role || 'guest',
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

  return (
    <nav class='fixed top-0 inset-x-0 z-50 bg-white border-b' dir={isRTL() ? 'rtl' : 'ltr'}>
      <div class='container mx-auto px-4'>
        <div class='h-16 flex items-center justify-between overflow-hidden'>
          {/* Logo */}
          <A href='/' class='text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors'>
            {/* Souq El Rafay3 */}
            <Logo width='100' height='75' />
          </A>

          {/* User Menu */}
          <div class='relative' ref={setUserRef}>
            <Switch
              fallback={
                <A
                  href={getLoginUrl()}
                  class='inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100'
                >
                  <FaRegularUser class='h-5 w-5' />
                </A>
              }
            >
              <Match when={auth.status() === 'loading'}>
                <div class='h-10 w-10'>
                  <Skeleton class='h-10 w-10 rounded-full' />
                </div>
              </Match>
              <Match when={auth.status() === 'authenticated'}>
                <>
                  <Button
                    variant='ghost'
                    class='relative h-10 w-10 rounded-full'
                    onClick={() => setIsUserOpen(!isUserOpen())}
                  >
                    <Avatar>
                      <AvatarImage src={userData().image} alt={userData().name || 'User avatar'} />
                      <AvatarFallback>{userData().initials}</AvatarFallback>
                    </Avatar>
                  </Button>

                  <div
                    class={`absolute ${isRTL() ? 'left-0' : 'right-0'} mt-2 w-64 rounded-lg shadow-lg
                    bg-white ring-1 ring-black ring-opacity-5 
                    transition-all duration-300 ease-in-out origin-top-right
                    ${
                      isUserOpen()
                        ? 'opacity-100 transform scale-100 translate-y-0'
                        : 'opacity-0 transform scale-95 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div class='py-1'>
                      <Show
                        when={auth.status() === 'authenticated'} // CHANGED
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
              <Match when={auth.status() === 'unauthenticated'}>
                <A
                  href={getLoginUrl()}
                  class='inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100'
                >
                  <FaRegularUser class='h-5 w-5' />
                </A>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default CheckoutNav
