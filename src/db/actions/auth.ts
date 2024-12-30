import { redirect } from '@solidjs/router'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'

const COOKIE_NAME = 'auth-session'

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax' as const,
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: 'admin' | 'seller' | 'user' | 'guest'
}

export interface Session {
  user: User
  expiresAt: number
}

export async function getSession() {
  'use server'
  
  const event = getRequestEvent()!.nativeEvent
  const sessionCookie = getCookie(event, COOKIE_NAME)

  if (!sessionCookie) {
    return { user: null }
  }

  try {
    const session = JSON.parse(sessionCookie) as Session

    if (session.expiresAt && Date.now() > session.expiresAt) {
      await handleSignOut()
      return { user: null }
    }

    return { user: session.user }
  } catch (error) {
    console.error('Error parsing session:', error)
    return { user: null }
  }
}

export async function handleSession(session: any) {
  'use server'
  
  const event = getRequestEvent()!.nativeEvent

  if (session?.user) {
    const serverSession: Session = {
      user: session.user,
      expiresAt: Date.now() + COOKIE_OPTIONS.maxAge * 1000,
    }

    setCookie(event, COOKIE_NAME, JSON.stringify(serverSession), COOKIE_OPTIONS)
    return { success: true, user: session.user }
  }

  setCookie(event, COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 })
  return { success: false, user: null }
}

export async function handleSignOut() {
  'use server'
  
  const event = getRequestEvent()!.nativeEvent

  // Clear the server-side cookie
  setCookie(event, COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 })

  // Throw a special redirect error that we can handle differently
  const error = new Error('RedirectError: Sign out redirect')
  error.name = 'RedirectError'
  throw redirect('/')
}

export async function signOutUser(auth: any) {
  try {
    // Clear client-side state first
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-session')
      // Clean up any other auth-related items
      for (const key of Object.keys(localStorage)) {
        if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('session')) {
          localStorage.removeItem(key)
        }
      }
    }

    // Clear auth provider state
    await auth.signOut()

    // Finally clear server-side session
    await handleSignOut()
  } catch (error) {
    if (error instanceof Error && error.message.includes('RedirectError')) {
      // Let the redirect happen normally
      throw error
    }
    // For other errors, log and handle gracefully
    console.error('Error in signOutUser:', error)
    // Still clear local storage even if there was an error
    localStorage.clear()
    // Redirect manually as fallback
    window.location.href = '/'
  }
}

export async function checkRole(allowedRoles: string[]) {
  'use server'
  
  const { user } = await getSession()
  if (!user) return false
  return allowedRoles.includes(user.role)
}

export async function requireRole(allowedRoles: string[]) {
  'use server'
  
  const hasRole = await checkRole(allowedRoles)
  if (!hasRole) {
    throw new Error('Unauthorized')
  }
  return true
}