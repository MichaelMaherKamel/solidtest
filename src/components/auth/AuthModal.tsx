import { Component, createSignal, Show } from 'solid-js'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { supabase } from '~/lib/supabase/supabase'
import { AiOutlineGoogle } from 'solid-icons/ai'
import { IoMailOutline } from 'solid-icons/io'

interface AuthModalProps {
  onSuccess?: () => void
}

const AuthModal: Component<AuthModalProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')
  const [emailSent, setEmailSent] = createSignal(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
      setIsOpen(false)
    } catch (error) {
      if (error instanceof Error) alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLinkAuth = async (e: Event) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email: email(),
      })
      if (error) throw error
      setEmailSent(true)
    } catch (error) {
      if (error instanceof Error) alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset the state after the modal is closed
    setTimeout(() => {
      setEmailSent(false)
      setEmail('')
    }, 300) // Wait for the modal close animation
  }

  return (
    <>
      <Button variant='ghost' class='text-white hover:bg-sky-700/30' onClick={() => setIsOpen(true)}>
        Sign in
      </Button>

      <Dialog open={isOpen()} onOpenChange={setIsOpen}>
        <DialogContent class='sm:max-w-[400px]'>
          <Show
            when={!emailSent()}
            fallback={
              <div class='space-y-6 py-6'>
                <div class='flex flex-col items-center gap-4'>
                  <div class='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
                    <IoMailOutline class='h-6 w-6 text-primary' />
                  </div>
                  <div class='text-center space-y-2'>
                    <DialogTitle class='text-xl'>Check your inbox</DialogTitle>
                    <DialogDescription>
                      We've sent a magic link to
                      <br />
                      <span class='font-medium text-foreground'>{email()}</span>
                    </DialogDescription>
                  </div>
                </div>
                <div class='space-y-4'>
                  <p class='text-center text-sm text-muted-foreground'>
                    Click the link in the email to sign in to your account. The link will expire in 1 hour.
                  </p>
                  <Button variant='secondary' class='w-full' onClick={handleClose}>
                    Got it
                  </Button>
                  <Button variant='ghost' class='w-full' onClick={() => setEmailSent(false)}>
                    Use a different email
                  </Button>
                </div>
              </div>
            }
          >
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
                  class='w-full h-11'
                  onClick={handleGoogleSignIn}
                  disabled={loading()}
                >
                  <AiOutlineGoogle class='mr-2 h-5 w-5' />
                  Continue with Google
                </Button>
              </div>

              <div class='relative'>
                <div class='absolute inset-0 flex items-center'>
                  <span class='w-full border-t' />
                </div>
                <div class='relative flex justify-center text-xs uppercase'>
                  <span class='bg-background px-2 text-muted-foreground'>Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleMagicLinkAuth} class='space-y-3'>
                <div class='space-y-2'>
                  <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    value={email()}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    disabled={loading()}
                    required
                  />
                </div>

                <Button type='submit' class='w-full h-11' variant='secondary' disabled={loading()}>
                  {loading() ? (
                    <span class='flex items-center justify-center'>
                      <svg class='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24'>
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
                      Loading...
                    </span>
                  ) : (
                    'Send magic link'
                  )}
                </Button>
              </form>
            </div>
          </Show>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AuthModal
