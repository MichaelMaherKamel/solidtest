// ~/components/auth/UserBtn.tsx
import { Component, createSignal, createMemo, Show, createEffect, Suspense } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
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
import { FaRegularUser } from 'solid-icons/fa'
import { useI18n } from '~/contexts/i18n'
import { useAuth } from '@solid-mediakit/auth/client'
import { handleSession, handleSignOut } from '~/db/actions/auth'
import type { Session } from '@solid-mediakit/auth'

interface UserButtonProps {
  buttonColorClass?: string
}

const UserButtonContent: Component<UserButtonProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [currentSession, setCurrentSession] = createSignal<Session | null>(null)
  const location = useLocation()
  const { t } = useI18n()
  const auth = useAuth()

  // Handle session initialization and updates
  createEffect(() => {
    const session = auth.session()
    if (session) {
      handleSession(session)
      setCurrentSession(session)
    } else {
      setCurrentSession(null)
    }
  })

  // Memoized user data
  const user = createMemo(() => currentSession()?.user)
  const isAuthenticated = createMemo(() => !!user())
  const userName = createMemo(() => user()?.name || user()?.email || 'User')
  const userEmail = createMemo(() => user()?.email || '')
  const userImage = createMemo(() => user()?.image || '')
  const userRole = createMemo(() => user()?.role || 'user')

  const handleSignOutClick = async () => {
    try {
      setIsOpen(false)
      await auth.signOut()
      await handleSignOut()
    } catch (error) {
      console.error('Error signing out:', error)
      alert(t('auth.signOutError'))
    }
  }

  const getLoginUrl = createMemo(() => {
    const currentPath = location.pathname
    return currentPath === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(currentPath)}`
  })

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Show
      when={isAuthenticated()}
      fallback={
        <Button
          as={A}
          href={getLoginUrl()}
          variant='ghost'
          size='icon'
          class={`hover:bg-white/10 ${props.buttonColorClass || 'text-gray-800 hover:text-gray-900'}`}
          aria-label={t('auth.signIn')}
        >
          <FaRegularUser class='h-5 w-5' />
        </Button>
      }
    >
      <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger>
          <Button
            variant='ghost'
            class={`relative h-10 w-10 rounded-full transition-colors duration-200 ${props.buttonColorClass}`}
            aria-label={t('nav.userMenu')}
          >
            <Avatar>
              <AvatarImage src={userImage()} alt={userName()} />
              <AvatarFallback>{getInitials(userName())}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Show when={userName() || userEmail()}>
            <DropdownMenuLabel>
              <div class='flex flex-col space-y-1'>
                <Show when={userName()}>
                  <p class='text-sm font-medium leading-none'>{userName()}</p>
                </Show>
                <Show when={userEmail()}>
                  <p class='text-xs text-muted-foreground truncate'>{userEmail()}</p>
                </Show>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </Show>

          <DropdownMenuItem as={A} href='/account'>
            {t('nav.account')}
          </DropdownMenuItem>

          <Show when={userRole() === 'admin'}>
            <DropdownMenuItem as={A} href='/admin'>
              {t('nav.admin')}
            </DropdownMenuItem>
          </Show>

          <Show when={userRole() === 'seller'}>
            <DropdownMenuItem as={A} href='/seller'>
              {t('nav.seller')}
            </DropdownMenuItem>
          </Show>

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleSignOutClick}>{t('auth.signOut')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Show>
  )
}

export const UserButton: Component<UserButtonProps> = (props) => {
  return (
    <Suspense fallback={<div class='h-10 w-10 rounded-full bg-gray-200 animate-pulse' />}>
      <UserButtonContent {...props} />
    </Suspense>
  )
}

export default UserButton
