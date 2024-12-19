import { Component, createEffect, createSignal } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { useNavigate, useSearchParams } from '@solidjs/router'
import { Card, CardHeader, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { useI18n } from '~/contexts/i18n'
import { siteConfig } from '~/config/site'

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

const FacebookIcon: Component = () => (
  <svg class='w-5 h-5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
      fill='#1877F2'
    />
  </svg>
)

const AuthPage: Component = () => {
  const [loading, setLoading] = createSignal<string | null>(null)
  const [error, setError] = createSignal('')
  const auth = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t, locale } = useI18n()

  const isRTL = () => locale() === 'ar'

  createEffect(() => {
    const session = auth.session()
    const status = auth.status()

    // If user is authenticated and we're on the login page
    if (status === 'authenticated' && session?.user && location.pathname === '/login') {
      const redirect = searchParams.redirect

      const redirectUrl = typeof redirect === 'string' ? decodeURIComponent(redirect) : '/'

      // Ensure redirect URL is safe
      const safeRedirectUrl = redirectUrl.startsWith('/') ? redirectUrl : '/'

      // Use replace to avoid adding to history stack
      navigate(safeRedirectUrl, { replace: true })
    }
  })

  const handleSignIn = async (provider: 'google' | 'facebook') => {
    if (loading()) return

    try {
      setLoading(provider)
      setError('')
      await auth.signIn(provider)

      // The navigation will be handled by the createEffect above
      // This prevents race conditions with auth state updates
    } catch (err) {
      console.error(`${provider} sign in error:`, err)
      setError(t('auth.error'))
      setLoading(null)
    }
  }

  // Prevent showing login page if already authenticated
  createEffect(() => {
    const status = auth.status()
    const session = auth.session()

    if (status === 'authenticated' && session?.user) {
      const currentPath = location.pathname
      if (currentPath === '/login') {
        const redirect = searchParams.redirect
        const redirectUrl = typeof redirect === 'string' ? decodeURIComponent(redirect) : '/'
        navigate(redirectUrl.startsWith('/') ? redirectUrl : '/', { replace: true })
      }
    }
  })

  const LoadingSpinner: Component = () => {
    return (
      <div
        class='w-4 h-4 rounded-full animate-spin
               bg-gradient-to-r from-purple-500 via-blue-500 to-green-500
               p-[1px]'
      >
        <div class='w-full h-full bg-gray-900 rounded-full'></div>
      </div>
    )
  }

  return (
    <div class='min-h-screen relative flex flex-col items-center justify-between' dir={isRTL() ? 'rtl' : 'ltr'}>
      {/* Background Image Layer */}
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
        <div class='absolute inset-0 bg-black bg-opacity-60' />
      </div>

      {/* Header */}
      <header class='relative z-10 w-full text-white py-4 text-center text-xl font-bold'>Souq El Rafay3</header>

      {/* Content Layer */}
      <div class='relative z-10 w-full max-w-md px-4 flex-grow flex items-center'>
        <Card class='w-full backdrop-blur-md bg-gray-800/70 border-gray-600 shadow-lg'>
          <CardHeader class='space-y-1'>
            <h1 class='text-2xl font-bold text-center text-gray-100'>{t('auth.title')}</h1>
            <p class='text-center text-gray-300'>{t('auth.subtitle')}</p>
          </CardHeader>

          <CardContent class='space-y-4'>
            {error() && (
              <Alert variant='destructive' class='bg-red-500/20 border-red-500/50 text-red-200'>
                <AlertDescription>{error()}</AlertDescription>
              </Alert>
            )}

            <div class='space-y-3'>
              <Button
                variant='outline'
                class='w-full h-12 relative bg-gray-700/80 hover:bg-gray-600/80 text-gray-100 border-gray-500 hover:border-gray-400 transition-all duration-200'
                onClick={() => handleSignIn('google')}
                disabled={loading() !== null}
              >
                {loading() === 'google' ? (
                  <LoadingSpinner />
                ) : (
                  <div class='flex items-center justify-center w-[180px]'>
                    <div class='w-5 h-5 flex-shrink-0'>
                      <GoogleIcon />
                    </div>
                    <span class='flex-1 text-sm font-medium ms-3'>{t('auth.googleButton')}</span>
                  </div>
                )}
              </Button>

              {/* Facebook button (commented out) */}
              {/* <Button
                variant='outline'
                class='w-full h-12 relative bg-gray-700/80 hover:bg-gray-600/80 text-gray-100 border-gray-500 hover:border-gray-400 transition-all duration-200'
                onClick={() => handleSignIn('facebook')}
                disabled={loading() !== null}
              >
                {loading() === 'facebook' ? (
                  <LoadingSpinner />
                ) : (
                  <div class='flex items-center justify-center w-[180px]'>
                    <div class='w-5 h-5 flex-shrink-0'>
                      <FacebookIcon />
                    </div>
                    <span class='flex-1 text-sm font-medium ms-3'>{t('auth.facebookButton')}</span>
                  </div>
                )}
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer class='relative z-10 w-full text-center py-4 mt-auto'>
        <p class='text-sm text-slate-100'>© 2024 Souq El Rafay3. Operated by Wark Maze. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default AuthPage
