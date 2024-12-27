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
import { createSignal, createEffect, createMemo, onMount, Show } from 'solid-js'
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

  // Initialize session synchronously if possible
  onMount(async () => {
    try {
      // Check for stored session first
      const storedSession = localStorage.getItem('user-session')
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession)
        if (parsedSession?.user) {
          // If we have a stored session, mark as loaded immediately
          setIsSessionLoaded(true)
        }
      }

      // Then refresh the session state
      await auth.refetch()
    } catch (error) {
      console.error('Error initializing session:', error)
    } finally {
      setIsSessionLoaded(true)
    }
  })

  // Reactive session management
  createEffect(() => {
    const session = auth.session()
    if (session?.user) {
      localStorage.setItem('user-session', JSON.stringify(session))
    } else if (auth.status() === 'unauthenticated') {
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

  // We wrap the entire layout in a Show component to ensure consistent state
  return (
    <Show when={true} fallback={null}>
      <div class='min-h-screen flex flex-col relative'>
        <Nav authState={authState()} isSessionLoaded={isSessionLoaded()} signOut={handleSignOut} />
        <main class={`${location.pathname === '/' ? '' : 'pt-16'} flex-1 relative`}>{props.children}</main>
        <SiteFooter authState={authState()} onSignOut={handleSignOut} />
      </div>
    </Show>
  )
}
