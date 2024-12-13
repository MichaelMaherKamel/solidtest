import { Component, createEffect, createSignal } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { AiOutlineGoogle } from 'solid-icons/ai'
import { FaRegularUser } from 'solid-icons/fa'

interface AuthModalProps {
  onSuccess?: () => void
  buttonColorClass?: string
}

export const AuthModal: Component<AuthModalProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const auth = useAuth()

  createEffect(() => {
    if (!isOpen()) {
      setLoading(false)
    }
  })

  const handleGoogleSignIn = async () => {
    if (loading()) return

    try {
      setLoading(true)
      await auth.signIn('google')
      setIsOpen(false)
      props.onSuccess?.()
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Unable to sign in at the moment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant='ghost'
        size='icon'
        class={`hover:bg-white/10 ${props.buttonColorClass || 'text-gray-800 hover:text-gray-900'}`}
        aria-label='SignIn'
        onClick={() => setIsOpen(true)}
      >
        <FaRegularUser class='h-5 w-5' />
      </Button>

      <Dialog
        open={isOpen()}
        onOpenChange={(open) => {
          if (!loading()) setIsOpen(open)
        }}
      >
        <DialogContent class='max-w-xs lg:max-w-md rounded-lg'>
          <DialogHeader>
            <DialogTitle class='text-xl text-center'>Login</DialogTitle>
            <DialogDescription class='text-center text-muted-foreground'>Welcome to Souq EL Rafay3</DialogDescription>
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
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        stroke-width='4'
                        fill='none'
                        class='opacity-25'
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
