import { Component, createSignal, Show } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'

const LoginPage: Component = () => {
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const auth = useAuth()

  const handleGoogleSignIn = async () => {
    if (loading()) return

    try {
      setLoading(true)
      setError(null)
      await auth.signIn('google')
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Unable to sign in at the moment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
      setError('Unable to sign out. Please try again.')
    }
  }

  const session = () => auth.session()
  const user = () => session()?.user

  return (
    <div class='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div class='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md'>
        <div class='text-center'>
          <h2 class='text-3xl font-extrabold text-gray-900'>Welcome to Souq EL Rafay3</h2>
          <p class='mt-2 text-sm text-gray-600'>Testing Authentication</p>
        </div>

        {error() && <div class='bg-red-50 text-red-800 p-4 rounded-md text-sm'>{error()}</div>}

        <Show
          when={user()}
          fallback={
            <button
              onClick={handleGoogleSignIn}
              disabled={loading()}
              class='w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <img src='https://www.google.com/favicon.ico' alt='Google logo' class='w-5 h-5' />
              {loading() ? 'Signing in...' : 'Continue with Google'}
            </button>
          }
        >
          <div class='space-y-6'>
            <div class='bg-white shadow rounded-lg p-6'>
              <div class='flex items-center space-x-4'>
                <img src={user()?.image ?? ''} alt={user()?.name ?? 'User'} class='h-12 w-12 rounded-full' />
                <div class='space-y-1'>
                  <h3 class='text-lg font-medium text-gray-900'>{user()?.name}</h3>
                  <p class='text-sm text-gray-500'>{user()?.email}</p>
                  <p class='text-sm text-gray-500'>Role: {user()?.role ?? 'N/A'}</p>
                </div>
              </div>
            </div>

            <div class='space-y-2'>
              <p class='text-sm text-gray-600'>Session Info:</p>
              <pre class='bg-gray-50 p-4 rounded-md overflow-auto text-xs'>{JSON.stringify(session(), null, 2)}</pre>
            </div>

            <button
              onClick={handleSignOut}
              class='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            >
              Sign Out
            </button>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default LoginPage
