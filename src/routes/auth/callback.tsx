// src/routes/auth/callback.tsx
import { useNavigate } from '@solidjs/router'
import { createEffect } from 'solid-js'
import { supabase } from '~/lib/supabase/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  createEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the OAuth code from URL
        const params = new URLSearchParams(window.location.search)
        const redirectTo = params.get('redirect') || '/'

        // Get session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error

        if (session) {
          // Successful sign in - redirect back to the page they came from or home
          window.location.href = decodeURIComponent(redirectTo)
        } else {
          // No session - redirect to login
          navigate('/login')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        navigate('/login')
      }
    }

    handleCallback()
  })

  return (
    <div class='flex items-center justify-center min-h-screen'>
      <div class='text-center'>
        <h2 class='text-2xl font-bold mb-4'>Completing sign in...</h2>
        <div class='loading loading-spinner loading-lg'></div>
      </div>
    </div>
  )
}
