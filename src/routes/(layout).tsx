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
import { createSignal, createEffect, onMount } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import Nav from '~/components/Nav'
import SiteFooter from '~/components/Footer'
import { createMediaQuery } from '@solid-primitives/media'

export type AuthState = {
  isAuthenticated: boolean
  isSessionLoaded: boolean
  user: any | null
  userRole: string
}

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isLargeScreen = createMediaQuery('(min-width: 768px)')
  const isHomePage = () => location.pathname === '/'
  const auth = useAuth()

  const [isSessionLoaded, setIsSessionLoaded] = createSignal(false)
  const [authState, setAuthState] = createSignal<AuthState>({
    isAuthenticated: false,
    isSessionLoaded: false,
    user: null,
    userRole: 'guest',
  })

  // Initial session check on mount
  onMount(() => {
    const storedSession = localStorage.getItem('user-session')
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession)
        if (parsedSession?.user) {
          setAuthState({
            isAuthenticated: true,
            isSessionLoaded: true,
            user: parsedSession.user,
            userRole: parsedSession.user?.role || 'guest',
          })
        }
      } catch (error) {
        console.error('Error parsing stored session:', error)
        localStorage.removeItem('user-session')
      }
    }
  })

  // Handle authentication state changes
  createEffect(() => {
    const status = auth.status()
    const session = auth.session()

    // Attempt to recover session if unauthenticated
    if (status === 'unauthenticated' && !session) {
      const storedSession = localStorage.getItem('user-session')
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession)
          if (parsedSession?.user) {
            auth.refetch()
          }
        } catch {
          localStorage.removeItem('user-session')
        }
      }
    }

    // Update state when session or status changes
    if (status !== 'loading' && session !== undefined) {
      const newState = {
        isAuthenticated: status === 'authenticated',
        isSessionLoaded: true,
        user: session?.user || null,
        userRole: session?.user?.role || 'guest',
      }

      setIsSessionLoaded(true)
      setAuthState(newState)

      // Store valid session
      if (session?.user) {
        localStorage.setItem('user-session', JSON.stringify(session))
      }
    }
  })

  // Watch for session changes to keep localStorage in sync
  createEffect(() => {
    const session = auth.session()
    const status = auth.status()

    if (status === 'authenticated' && session?.user) {
      localStorage.setItem('user-session', JSON.stringify(session))
    }
  })

  const handleSignOut = async () => {
    try {
      await auth.signOut()

      // Clear session storage
      localStorage.removeItem('user-session')
      for (const key of Object.keys(localStorage)) {
        if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('session')) {
          localStorage.removeItem(key)
        }
      }

      // Reset auth state
      setAuthState({
        isAuthenticated: false,
        isSessionLoaded: true,
        user: null,
        userRole: 'guest',
      })

      // Use replace for cleaner navigation
      window.location.replace('/')
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
