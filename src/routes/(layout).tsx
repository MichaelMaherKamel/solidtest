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
import { createSignal, createEffect, createMemo } from 'solid-js'
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

  // Directly use auth hook for session
  const user = () => auth.session()?.user
  const [isSessionLoaded, setIsSessionLoaded] = createSignal(false)

  // Simplified auth state
  const authState = createMemo(() => ({
    isAuthenticated: !!user(),
    isSessionLoaded: isSessionLoaded(),
    user: user(),
    userRole: user()?.role || 'guest',
  }))

  // Simple session loading check
  createEffect(() => {
    if (auth.status() !== 'loading') {
      setIsSessionLoaded(true)
    }
  })

  // Session recovery
  createEffect(() => {
    const status = auth.status()
    if (status === 'unauthenticated' && !user()) {
      const storedSession = localStorage.getItem('user-session')
      if (storedSession) {
        auth.refetch()
      }
    }
  })

  // Keep localStorage in sync
  createEffect(() => {
    const session = auth.session()
    if (session?.user) {
      localStorage.setItem('user-session', JSON.stringify(session))
    }
  })

  const handleSignOut = async () => {
    try {
      await auth.signOut()

      // Clear auth storage
      localStorage.removeItem('user-session')
      for (const key of Object.keys(localStorage)) {
        if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('session')) {
          localStorage.removeItem(key)
        }
      }

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
