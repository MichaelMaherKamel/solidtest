// ~/components/auth/AuthModal.tsx
import { Component, Show, createSignal } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { useI18n } from '~/contexts/i18n'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Alert, AlertDescription } from '~/components/ui/alert'
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

const LoadingSpinner: Component = () => (
  <div class='relative w-6 h-6'>
    <div class='w-6 h-6 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin'></div>
  </div>
)

interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const AuthModal: Component<AuthModalProps> = (props) => {
  const [loading, setLoading] = createSignal<string | null>(null)
  const [error, setError] = createSignal('')
  const auth = useAuth()
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'

  const handleSignIn = async (provider: 'google') => {
    if (loading()) return

    try {
      setLoading(provider)
      setError('')
      await auth.signIn(provider)
      props.onOpenChange(false)
    } catch (err) {
      console.error(`${provider} sign in error:`, err)
      setError(t('auth.error'))
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent
        class='max-w-sm lg:max-w-md rounded-lg supports-backdrop-blur:bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl'
        dir={isRTL() ? 'rtl' : 'ltr'}
      >
        <div class='p-6 space-y-6'>
          {/* Header */}
          <div class='text-center space-y-2'>
            <h2 class='text-2xl font-bold'>{t('auth.title')}</h2>
            <p class='text-sm text-muted-foreground'>{t('auth.subtitle')}</p>
          </div>

          {/* Error Alert */}
          <Show when={error()}>
            <Alert variant='destructive'>
              <AlertDescription>{error()}</AlertDescription>
            </Alert>
          </Show>

          {/* Sign in buttons */}
          <div class='space-y-4'>
            <Button
              variant='outline'
              class='w-full h-12 relative bg-white hover:bg-gray-50 border-gray-300
                     transition-all duration-300 group overflow-hidden'
              onClick={() => handleSignIn('google')}
              disabled={loading() !== null}
            >
              {loading() === 'google' ? (
                <LoadingSpinner />
              ) : (
                <div class='flex items-center justify-center gap-3'>
                  <GoogleIcon />
                  <span class='text-sm font-medium'>{t('auth.googleButton')}</span>
                </div>
              )}
            </Button>
          </div>

          {/* Footer */}
          {/* <div class='mt-6 pt-6 border-t text-center'>
            <p class='text-xs text-muted-foreground'>{t('auth.termsNotice')}</p>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
