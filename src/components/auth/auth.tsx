import { createSignal } from 'solid-js'
import { supabase } from '~/lib/supabase/supabase'

export default function Auth() {
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email: email() })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class='w-full'>
      <form onSubmit={handleLogin} class='space-y-6'>
        <div class='space-y-2'>
          <label for='email' class='block text-sm font-medium text-white'>
            Email
          </label>
          <input
            id='email'
            type='email'
            placeholder='Your email'
            value={email()}
            onChange={(e) => setEmail(e.currentTarget.value)}
            class='w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <button type='submit' class='w-full btn btn-primary' disabled={loading()}>
          {loading() ? (
            <span class='flex items-center justify-center'>
              <svg class='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24'>
                <circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4' fill='none' />
                <path
                  class='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Loading...
            </span>
          ) : (
            'Send magic link'
          )}
        </button>
      </form>
    </div>
  )
}
