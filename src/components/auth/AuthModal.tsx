import { Component, createEffect, createSignal } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { AiOutlineGoogle } from 'solid-icons/ai'

interface AuthModalProps {
  onSuccess?: () => void
}

const AuthModal: Component<AuthModalProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const auth = useAuth()

  // Cleanup effect when modal closes
  createEffect(() => {
    if (!isOpen()) {
      setLoading(false)
    }
  })

  const handleGoogleSignIn = async () => {
    if (loading()) return // Prevent multiple clicks

    try {
      setLoading(true)
      await auth.signIn('google', {
        redirect: false,
        redirectTo: window.location.pathname,
      })
      setIsOpen(false)
      props.onSuccess?.()
    } catch (error) {
      if (error instanceof Error) {
        console.error('Sign in error:', error)
        // Use a more user-friendly error handling
        alert('Unable to sign in at the moment. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant='ghost'
        class='text-white hover:bg-sky-700/30 transition-colors duration-200'
        onClick={() => setIsOpen(true)}
      >
        Sign in
      </Button>

      <Dialog
        open={isOpen()}
        onOpenChange={(open) => {
          if (!loading()) setIsOpen(open)
        }}
      >
        <DialogContent class='sm:max-w-[400px]'>
          <DialogHeader>
            <DialogTitle class='text-xl text-center'>Welcome to Souq EL Rafay3</DialogTitle>
            <DialogDescription class='text-center text-muted-foreground'>
              Your destination for unique products and amazing deals
            </DialogDescription>
          </DialogHeader>

          <div class='space-y-4 mt-4'>
            <div class='space-y-3'>
              <Button
                type='button'
                variant='outline'
                class='w-full h-11 transition-all duration-200'
                onClick={handleGoogleSignIn}
                disabled={loading()}
              >
                <AiOutlineGoogle class='mr-2 h-5 w-5' />
                {loading() ? (
                  <span class='flex items-center justify-center'>
                    <svg class='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24' aria-label='Loading'>
                      <circle
                        class='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        stroke-width='4'
                        fill='none'
                      />
                      <path
                        class='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  'Continue with Google'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AuthModal
