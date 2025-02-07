import { Component, createEffect, createSignal } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { useNavigate } from '@solidjs/router'
import { Card, CardHeader, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { useI18n } from '~/contexts/i18n'
import { siteConfig } from '~/config/site'

const RETURN_PATH_KEY = 'auth_return_path'

const GoogleIcon: Component = () => (
  <svg class='w-5 h-5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      fill='#4285F4'
    />
    <path
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      fill='#34A853'
    />
    <path
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      fill='#FBBC05'
    />
    <path
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      fill='#EA4335'
    />
  </svg>
)

const LoadingSpinner: Component = () => (
  <div class='relative w-6 h-6'>
    <div class='w-6 h-6 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin'></div>
  </div>
)

const AuthPage: Component = () => {
  const [loading, setLoading] = createSignal<string | null>(null)
  const [error, setError] = createSignal('')
  const auth = useAuth()
  const navigate = useNavigate()
  const { t, locale } = useI18n()

  const isRTL = () => locale() === 'ar'

  // Effect to handle authentication state
  createEffect(() => {
    const session = auth.session()
    const status = auth.status()

    if (status === 'authenticated' && session?.user) {
      const returnPath = localStorage.getItem(RETURN_PATH_KEY) || '/'
      localStorage.removeItem(RETURN_PATH_KEY)
      navigate(returnPath, { replace: true })
    }
  })

  const handleSignIn = async (provider: 'google') => {
    if (loading()) return

    try {
      setLoading(provider)
      setError('')
      await auth.signIn(provider)
    } catch (err) {
      console.error(`${provider} sign in error:`, err)
      setError(t('auth.error'))
      setLoading(null)
    }
  }

  return (
    <div class='min-h-screen relative flex flex-col items-center justify-between' dir={isRTL() ? 'rtl' : 'ltr'}>
      {/* Background with Gradient Overlay */}
      <div class='absolute inset-0'>
        <img
          src={siteConfig.images.siteResponsiveImage}
          alt={t('hero.imageAlt')}
          class='w-full h-full object-cover object-center block md:hidden'
        />
        <img
          src={siteConfig.images.siteImage}
          alt={t('hero.imageAlt')}
          class='w-full h-full object-cover object-center hidden md:block'
        />
        <div class='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70' />
      </div>

      {/* Header */}
      <header class='relative z-10 w-full py-6 text-center'>
        <h1 class='text-3xl font-bold text-white tracking-wider'>Souq El Rafay3</h1>
      </header>

      {/* Main Content */}
      <div class='relative z-10 w-full max-w-md px-6 flex-grow flex items-center'>
        <Card class='w-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl'>
          <CardHeader class='space-y-3 pb-8'>
            <h2 class='text-2xl font-bold text-center text-white'>{t('auth.title')}</h2>
            <p class='text-center text-gray-200 text-sm'>{t('auth.subtitle')}</p>
          </CardHeader>

          <CardContent class='space-y-6'>
            {error() && (
              <Alert variant='destructive' class='bg-red-500/20 border-red-500/50'>
                <AlertDescription class='text-red-200'>{error()}</AlertDescription>
              </Alert>
            )}

            <Button
              variant='outline'
              class='w-full h-12 relative bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/40 
                     transition-all duration-300 backdrop-blur-lg group overflow-hidden'
              onClick={() => handleSignIn('google')}
              disabled={loading() !== null}
            >
              <div
                class='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-white/5 to-green-500/10 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-500'
              ></div>
              {loading() === 'google' ? (
                <LoadingSpinner />
              ) : (
                <div class='flex items-center justify-center gap-3'>
                  <GoogleIcon />
                  <span class='text-sm font-medium'>{t('auth.googleButton')}</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer class='relative z-10 w-full text-center py-6'>
        <p class='text-sm text-gray-300'>
          © 2024 Souq El Rafay3
          <span class='mx-2'>•</span>
          <span class='text-gray-400'>Operated by Wark Maze</span>
        </p>
      </footer>
    </div>
  )
}

export default AuthPage
