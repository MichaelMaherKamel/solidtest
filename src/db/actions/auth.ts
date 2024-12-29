// ~/server/auth.ts
import { redirect } from '@solidjs/router'
import { setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'

// Server function to handle session
export async function handleSession(session: any) {
  'use server'

  const event = getRequestEvent()!.nativeEvent

  if (session?.user) {
    setCookie(event, 'auth-session', JSON.stringify(session), {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
    return { success: true, user: session.user }
  }

  // Clear cookie if no session
  setCookie(event, 'auth-session', '', {
    maxAge: 0,
    path: '/',
  })

  return { success: false, user: null }
}

// Server function to handle sign out
export async function handleSignOut() {
  'use server'

  const event = getRequestEvent()!.nativeEvent

  // Clear the cookie
  setCookie(event, 'auth-session', '', {
    maxAge: 0,
    path: '/',
  })

  throw redirect('/')
}
