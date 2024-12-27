import { RouteSectionProps } from '@solidjs/router'
import { useLocation } from '@solidjs/router'
import { createSignal, createEffect, createMemo, Show } from 'solid-js'
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

  // Session state management
  const sessionState = createMemo(() => {
    const session = auth.session()
    return {
      isAuthenticated: !!session?.user,
      user: session?.user,
      userRole: session?.user?.role || 'guest',
    }
  })

  // Init session state
  createEffect(() => {
    const initSession = async () => {
      try {
        // Try to restore session from storage
        const storedSession = localStorage.getItem('user-session')
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession)
          if (parsedSession?.user) {
            // We have stored session data
            setIsSessionLoaded(true)
          }
        }

        // Always refetch latest session state
        await auth.refetch()
      } catch (error) {
        console.error('Error initializing session:', error)
      } finally {
        setIsSessionLoaded(true)
      }
    }

    initSession()
  })

  // Handle session changes
  createEffect(() => {
    const session = auth.session()
    if (session?.user) {
      localStorage.setItem('user-session', JSON.stringify(session))
    } else if (auth.status() === 'unauthenticated') {
      localStorage.removeItem('user-session')
    }
  })

  const authState = createMemo(() => ({
    isAuthenticated: sessionState().isAuthenticated,
    isSessionLoaded: isSessionLoaded(),
    user: sessionState().user,
    userRole: sessionState().userRole,
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

  // Wrap everything in a Show component to ensure consistent render
  return (
    <Show when={isSessionLoaded()}>
      <div class='min-h-screen flex flex-col relative'>
        <Nav authState={authState()} isSessionLoaded={isSessionLoaded()} signOut={handleSignOut} />
        <main class={`${location.pathname === '/' ? '' : 'pt-16'} flex-1 relative`}>{props.children}</main>
        <SiteFooter authState={authState()} onSignOut={handleSignOut} />
      </div>
    </Show>
  )
}
