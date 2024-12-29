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

// ~/routes/(layout).tsx
import { RouteSectionProps } from '@solidjs/router'
import { useLocation } from '@solidjs/router'
import { useAuth } from '@solid-mediakit/auth/client'
import Nav from '~/components/Nav'
import SiteFooter from '~/components/Footer'
import { handleSession, handleSignOut } from '~/db/actions/auth'

export interface AuthState {
  isAuthenticated: boolean
  isSessionLoaded: boolean
  user: any | null
  userRole: string
}

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()
  const auth = useAuth()

  // Handle session on component mount
  if (auth.session()) {
    handleSession(auth.session())
  }

  const authState: AuthState = {
    isAuthenticated: !!auth.session()?.user,
    isSessionLoaded: true,
    user: auth.session()?.user || null,
    userRole: auth.session()?.user?.role || 'guest',
  }

  const handleUserSignOut = async () => {
    try {
      await auth.signOut()
      await handleSignOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div class='min-h-screen flex flex-col relative'>
      <Nav authState={authState} isSessionLoaded={true} signOut={handleUserSignOut} />
      <main class={`${location.pathname === '/' ? '' : 'pt-16'} flex-1 relative`}>{props.children}</main>
      <SiteFooter authState={authState} onSignOut={handleUserSignOut} />
    </div>
  )
}
