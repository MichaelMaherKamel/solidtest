import { Component, createEffect, createSignal } from 'solid-js'
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
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { SidebarMenuButton } from '~/components/ui/sidebar'

interface AdminUserButtonProps {
  session: Session | null
}

const AdminUserButton: Component<AdminUserButtonProps> = (props) => {
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

  return (
    <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <SidebarMenuButton
          size='lg'
          class='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <Avatar class='h-8 w-8 rounded-lg'>
            <AvatarImage src={userImage()} alt={userName()} />
            <AvatarFallback class='rounded-lg'>{getInitials(userName())}</AvatarFallback>
          </Avatar>
          <div class='grid flex-1 text-left text-sm leading-tight'>
            <span class='truncate font-semibold'>{userName()}</span>
            <span class='truncate text-xs text-muted-foreground'>{userEmail()}</span>
          </div>
        </SidebarMenuButton>
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
          <DropdownMenuItem disabled>Admin Dashboard</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleSignOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AdminUserButton
