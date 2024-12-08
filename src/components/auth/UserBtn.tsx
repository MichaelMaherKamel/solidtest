import { Component, Show } from 'solid-js'
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
import { supabase } from '~/lib/supabase/supabase'
import { AuthSession } from '@supabase/supabase-js'
import AuthModal from './AuthModal'

interface UserButtonProps {
  session: AuthSession | null
}

const UserButton: Component<UserButtonProps> = (props) => {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error signing out:', error.message)
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Show when={props.session} fallback={<AuthModal />}>
      <DropdownMenu>
        <DropdownMenuTrigger >
          <Button variant='ghost' class='relative h-10 w-10 rounded-full'>
            <Avatar>
              <AvatarImage src={props.session?.user.user_metadata.avatar_url} />
              <AvatarFallback>
                {getInitials(props.session?.user.user_metadata.full_name || props.session?.user.email || 'U')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class='w-56' >
          <DropdownMenuLabel>
            <div class='flex flex-col space-y-1'>
              <p class='text-sm font-medium'>{props.session?.user.user_metadata.full_name || 'User'}</p>
              <p class='text-xs text-muted-foreground truncate'>{props.session?.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>Account</DropdownMenuItem>
            <DropdownMenuItem disabled>Admin Dashboard</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Show>
  )
}

export default UserButton
