import { Component, Show, createEffect, createSignal, Suspense } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { createAsync } from '@solidjs/router'
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
import { query } from '@solidjs/router'
import { getSession } from '@solid-mediakit/auth'
import { getRequestEvent } from 'solid-js/web'
import { authOptions } from '~/lib/auth/authOptions'

// Server query to get user session
const getUserSession = query(async () => {
  'use server'
  const event = getRequestEvent()!
  const session = await getSession(event, authOptions)
  return session
}, 'user-session')

const UserButton: Component = () => {
  const auth = useAuth()
  const [isOpen, setIsOpen] = createSignal(false)
  const session = createAsync(() => getUserSession(), { deferStream: true })
  const [currentUser, setCurrentUser] = createSignal(session()?.user)

  // Effect to update currentUser when session changes
  createEffect(() => {
    const user = session()?.user
    if (user !== currentUser()) {
      setCurrentUser(user || undefined)
    }
  })

  // Effect to sync with auth.session changes
  createEffect(() => {
    const authSession = auth.session()
    if (authSession?.user !== currentUser()) {
      setCurrentUser(authSession?.user || undefined)
    }
  })

  const handleSignOut = async () => {
    try {
      setIsOpen(false)
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
    <Suspense fallback={<Button variant='ghost' class='w-10 h-10 rounded-full animate-pulse' />}>
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
    </Suspense>
  )
}

export default UserButton
