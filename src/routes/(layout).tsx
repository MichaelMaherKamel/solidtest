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
import { createSignal, createEffect, createMemo, onMount } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import Nav from '~/components/Nav'
import SiteFooter from '~/components/Footer'

export interface AuthState {
  isAuthenticated: boolean
  isSessionLoaded: boolean
  user: any | null
  userRole: string
}

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()
  const auth = useAuth()
  const [isSessionLoaded, setIsSessionLoaded] = createSignal(false)

  // Initialize session as soon as possible
  onMount(async () => {
    try {
      // Attempt to initialize session from stored data
      const storedSession = localStorage.getItem('user-session')
      if (storedSession) {
        await auth.refetch()
      }
    } catch (error) {
      console.error('Error initializing session:', error)
    } finally {
      setIsSessionLoaded(true)
    }
  })

  // Watch for session changes and store them
  createEffect(() => {
    const session = auth.session()
    if (session?.user) {
      // Update localStorage when session changes
      localStorage.setItem('user-session', JSON.stringify(session))
    } else {
      // Clear stored session if user is not authenticated
      localStorage.removeItem('user-session')
    }
  })

  // Watch for auth status changes
  createEffect(() => {
    const status = auth.status()
    if (status === 'unauthenticated') {
      // Clear session storage on logout
      localStorage.removeItem('user-session')
    }
  })

  const authState = createMemo(() => ({
    isAuthenticated: !!auth.session()?.user,
    isSessionLoaded: isSessionLoaded(),
    user: auth.session()?.user,
    userRole: auth.session()?.user?.role || 'guest',
  }))

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      localStorage.removeItem('user-session')
      window.location.replace('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div class='min-h-screen flex flex-col relative'>
      <Nav authState={authState()} isSessionLoaded={isSessionLoaded()} signOut={handleSignOut} />
      <main class={`${location.pathname === '/' ? '' : 'pt-16'} flex-1 relative`}>{props.children}</main>
      <SiteFooter authState={authState()} onSignOut={handleSignOut} />
    </div>
  )
}
