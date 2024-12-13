import { Component, Show, createSignal, createEffect } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { useLocation } from '@solidjs/router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import AuthModal from './AuthModal'

interface UserButtonProps {
  onAuthChange?: () => void
  buttonColorClass?: string
}

export const UserButton: Component<UserButtonProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const auth = useAuth()
  const location = useLocation()

  createEffect(() => {
    const session = auth.session()
    setIsOpen(false)
    props.onAuthChange?.()
  })

  const handleSignOut = async () => {
    try {
      setIsOpen(false)
      await auth.signOut()
      // Redirect to the current page after sign out
      window.location.href = location.pathname
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Unable to sign out. Please try again.')
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  const user = () => auth.session()?.user
  const userName = () => user()?.name || user()?.email || 'User'
  const userEmail = () => user()?.email || ''
  const userImage = () => user()?.image || ''
  const userRole = () => user()?.role

  // The original Show condition worked better
  return (
    <Show
      when={auth.session()?.user}
      fallback={<AuthModal onSuccess={props.onAuthChange} buttonColorClass={props.buttonColorClass} />}
    >
      <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger>
          <Button
            variant='ghost'
            class={`relative h-10 w-10 rounded-full transition-colors duration-200 ${props.buttonColorClass}`}
            aria-label='User menu'
          >
            <Avatar>
              <AvatarImage src={userImage()} alt={userName()} />
              <AvatarFallback>{getInitials(userName())}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div class='flex flex-col space-y-1'>
              <p class='text-sm font-medium'>{userName()}</p>
              <p class='text-xs text-muted-foreground truncate'>{userEmail()}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Account</DropdownMenuItem>
          <Show when={userRole() === 'admin'}>
            <DropdownMenuItem disabled>Admin Dashboard</DropdownMenuItem>
          </Show>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Show>
  )
}

export default UserButton
