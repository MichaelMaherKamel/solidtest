import { Component, Show, createEffect, createSignal } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import type { Session } from '@solid-mediakit/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import AuthModal from './AuthModal'

interface UserButtonProps {
  session: Session | null
}

const UserButton: Component<UserButtonProps> = (props) => {
  const auth = useAuth()
  const [isOpen, setIsOpen] = createSignal(false)
  const [currentUser, setCurrentUser] = createSignal(props.session?.user || undefined)

  // Effect to update currentUser when session changes
  createEffect(() => {
    const user = props.session?.user
    if (user !== currentUser()) {
      setCurrentUser(user || undefined)
    }
  })

  const handleSignOut = async () => {
    try {
      setIsOpen(false) // Close dropdown before signing out
      await auth.signOut({ redirect: false })
      setCurrentUser(undefined)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error signing out:', error.message)
        alert('Unable to sign out. Please try again.')
      }
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

  const userName = () => currentUser()?.name || currentUser()?.email || 'User'
  const userEmail = () => currentUser()?.email || ''
  const userImage = () => currentUser()?.image || ''
  const userRole = () => currentUser()?.role

  return (
    <Show when={currentUser()} fallback={<AuthModal />}>
      {(user) => (
        <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger>
            <Button
              variant='ghost'
              class='relative h-10 w-10 rounded-full transition-colors duration-200'
              aria-label='User menu'
            >
              <Avatar>
                <AvatarImage src={userImage()} alt={userName()} />
                <AvatarFallback>{getInitials(userName())}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class='w-56'>
            <DropdownMenuLabel>
              <div class='flex flex-col space-y-1'>
                <p class='text-sm font-medium'>{userName()}</p>
                <p class='text-xs text-muted-foreground truncate'>{userEmail()}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>Account</DropdownMenuItem>
              <Show when={userRole() === 'admin'}>
                <DropdownMenuItem disabled>Admin Dashboard</DropdownMenuItem>
              </Show>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleSignOut()}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Show>
  )
}

export default UserButton
