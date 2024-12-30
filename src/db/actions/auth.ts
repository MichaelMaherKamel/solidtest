// ~/server/auth.ts
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

// Get the current session
export async function getSession() {
  'use server'

  const event = getRequestEvent()!.nativeEvent
  const sessionCookie = getCookie(event, COOKIE_NAME)

  if (!sessionCookie) {
    return { user: null }
  }

  try {
    const session = JSON.parse(sessionCookie) as Session

    // Check if session is expired
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

// Handle session update
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

  // Clear cookie if no session
  setCookie(event, COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })

  return { success: false, user: null }
}

// Handle sign out
export async function handleSignOut() {
  'use server'

  const event = getRequestEvent()!.nativeEvent

  // Clear the cookie
  setCookie(event, COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })

  throw redirect('/')
}

// Check if user has required role
export async function checkRole(allowedRoles: string[]) {
  'use server'

  const { user } = await getSession()
  if (!user) return false
  return allowedRoles.includes(user.role)
}

// Protect server actions
export async function requireRole(allowedRoles: string[]) {
  'use server'

  const hasRole = await checkRole(allowedRoles)
  if (!hasRole) {
    throw new Error('Unauthorized')
  }
  return true
}
