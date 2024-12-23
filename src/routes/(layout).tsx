// import { RouteSectionProps } from '@solidjs/router'
// import Nav from '~/components/Nav'
// import { useLocation } from '@solidjs/router'
// import Header from '~/components/Header'

// export default function RootLayout(props: RouteSectionProps) {
//   const location = useLocation()
//   const isHomePage = () => location.pathname === '/'

//   return (
//     <div class='min-h-screen relative'>
//       <Nav />
//       {/* <Header /> */}
//       <main class={`${isHomePage() ? '' : 'pt-16'} relative`}>{props.children}</main>
//     </div>
//   )
// }

// import { RouteSectionProps } from '@solidjs/router'
// import { useLocation } from '@solidjs/router'
// import Nav from '~/components/Nav'
// import SiteFooter from '~/components/Footer'
// import { createMediaQuery } from '@solid-primitives/media'

// export default function RootLayout(props: RouteSectionProps) {
//   const location = useLocation()
//   const isLargeScreen = createMediaQuery('(min-width: 768px)')
//   const isHomePage = () => location.pathname === '/'

//   return (
//     <div class='min-h-screen flex flex-col relative'>
//       <Nav />
//       <main class={`${isHomePage() ? '' : 'pt-16'} flex-1 relative`}>{props.children}</main>
//       {/* Add padding bottom on mobile to account for the dock navigation */}
//       <div class={`${isLargeScreen() ? '' : 'pb-32'}`}>
//         <SiteFooter />
//       </div>
//     </div>
//   )
// }

import { RouteSectionProps } from '@solidjs/router'
import { useLocation } from '@solidjs/router'
import { createSignal, createEffect, createMemo, Component } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import type { Session } from '@auth/core/types'
import Nav from '~/components/Nav'
import SiteFooter from '~/components/Footer'
import { createMediaQuery } from '@solid-primitives/media'

// Types for auth context
export type AuthState = {
  isAuthenticated: boolean
  isSessionLoaded: boolean
  user: Session['user'] | null
  userRole: string
}

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isLargeScreen = createMediaQuery('(min-width: 768px)')
  const isHomePage = () => location.pathname === '/'
  const auth = useAuth()

  // Centralized auth state
  const [isSessionLoaded, setIsSessionLoaded] = createSignal(false)
  const [authState, setAuthState] = createSignal<AuthState>({
    isAuthenticated: false,
    isSessionLoaded: false,
    user: null,
    userRole: 'guest',
  })

  // Initialize and manage auth state
  createEffect(() => {
    const status = auth.status()
    const session = auth.session()

    if (status === 'unauthenticated' && !session) {
      const storedSession = localStorage.getItem('user-session')
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession) as Session
          if (parsedSession?.user) {
            auth.refetch()
          }
        } catch {
          localStorage.removeItem('user-session')
        }
      }
    }

    if (status !== 'loading' && session !== undefined) {
      setIsSessionLoaded(true)
      setAuthState({
        isAuthenticated: status === 'authenticated',
        isSessionLoaded: true,
        user: session?.user || null,
        userRole: session?.user?.role || 'guest',
      })
    }
  })

  // Sync session to localStorage
  createEffect(() => {
    const session = auth.session()
    if (session) {
      localStorage.setItem('user-session', JSON.stringify(session))
    }
  })

  // Centralized sign out handler
  const handleSignOut = async () => {
    try {
      await auth.signOut()
      localStorage.removeItem('user-session')
      // Clean up auth-related items
      for (const key of Object.keys(localStorage)) {
        if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('session')) {
          localStorage.removeItem(key)
        }
      }
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div class='min-h-screen flex flex-col relative'>
      <Nav authState={authState()} isSessionLoaded={isSessionLoaded()} signOut={handleSignOut} />
      <main class={`${isHomePage() ? '' : 'pt-16'} flex-1 relative`}>{props.children}</main>
      <div class={`${isLargeScreen() ? '' : 'pb-32'}`}>
        <SiteFooter authState={authState()} onSignOut={handleSignOut} />
      </div>
    </div>
  )
}
