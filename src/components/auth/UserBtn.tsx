// UserBtn.tsx
import { Component, createSignal, createEffect, createMemo, Show } from 'solid-js'
import { useAuth } from '@solid-mediakit/auth/client'
import { A, useLocation } from '@solidjs/router'
import type { Session } from '@solid-mediakit/auth'
import NavDropdown from '../NavDropDown'
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

interface UserButtonProps {
  buttonColorClass?: string
}

export const UserButton: Component<UserButtonProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [localSession, setLocalSession] = createSignal<Session | null>(null)
  const auth = useAuth()
  const location = useLocation()
  const { t } = useI18n()

  // Create an effect to sync the session state
  createEffect(() => {
    const currentSession = auth.session()
    if (currentSession !== undefined) {
      setLocalSession(currentSession)
      if (currentSession) {
        localStorage.setItem('user-session', JSON.stringify(currentSession))
      } else {
        localStorage.removeItem('user-session')
      }
    }
  })

  // Initialize session from localStorage if available
  createEffect(() => {
    if (!localSession()) {
      const storedSession = localStorage.getItem('user-session')
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession) as Session
          setLocalSession(parsedSession)
        } catch (e) {
          console.error('Error parsing stored session:', e)
          localStorage.removeItem('user-session')
        }
      }
    }
  })

  // Memoized values
  const user = createMemo(() => localSession()?.user)
  const isAuthenticated = createMemo(() => !!user())
  const userName = createMemo(() => user()?.name || user()?.email || 'User')
  const userEmail = createMemo(() => user()?.email || '')
  const userImage = createMemo(() => user()?.image || '')
  const userRole = createMemo(() => user()?.role || 'user')

  const handleSignOut = async () => {
    try {
      setIsOpen(false)
      await auth.signOut()
      setLocalSession(null)
      localStorage.removeItem('user-session')
      for (const key of Object.keys(localStorage)) {
        if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('session')) {
          localStorage.removeItem(key)
        }
      }
      window.location.href = '/'
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
                  <p class='text-sm font-medium'>{userName()}</p>
                </Show>
                <Show when={userEmail()}>
                  <p class='text-xs text-muted-foreground truncate'>{userEmail()}</p>
                </Show>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </Show>

          {/* Always show Account option */}
          <DropdownMenuItem as={A} href='/account'>
            {t('nav.account')}
          </DropdownMenuItem>

          {/* Show Admin Dashboard for admin users */}
          <Show when={userRole() === 'admin'}>
            <DropdownMenuItem as={A} href='/admin'>
              {t('nav.admin')}
            </DropdownMenuItem>
          </Show>

          {/* Show Seller Dashboard for seller users */}
          <Show when={userRole() === 'seller'}>
            <DropdownMenuItem as={A} href='/seller'>
              {t('nav.seller')}
            </DropdownMenuItem>
          </Show>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>{t('auth.signOut')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Show>
  )
}

export default UserButton
