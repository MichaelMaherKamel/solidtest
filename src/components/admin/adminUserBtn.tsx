import { Component } from 'solid-js'
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
import { supabase } from '~/lib/supabase/supabase'
import { AuthSession } from '@supabase/supabase-js'
import { SidebarMenuButton } from '~/components/ui/sidebar'

interface AdminUserButtonProps {
  session: AuthSession | null
}

const AdminUserButton: Component<AdminUserButtonProps> = (props) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SidebarMenuButton
          size='lg'
          class='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <Avatar class='h-8 w-8 rounded-lg'>
            <AvatarImage src={props.session?.user.user_metadata.avatar_url} />
            <AvatarFallback class='rounded-lg'>
              {getInitials(props.session?.user.user_metadata.full_name || props.session?.user.email || 'U')}
            </AvatarFallback>
          </Avatar>
          <div class='grid flex-1 text-left text-sm leading-tight'>
            <span class='truncate font-semibold'>{props.session?.user.user_metadata.full_name || 'User'}</span>
            <span class='truncate text-xs text-muted-foreground'>{props.session?.user.email}</span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent class='w-56'>
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
  )
}

export default AdminUserButton
