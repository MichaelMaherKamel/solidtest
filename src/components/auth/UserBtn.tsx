import { Component, createSignal, createMemo, Show } from 'solid-js'
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
import type { AuthState } from '~/routes/(layout)'

interface UserButtonProps {
  buttonColorClass?: string
  authState: AuthState
  onSignOut: () => Promise<void>
}

export const UserButton: Component<UserButtonProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const location = useLocation()
  const { t } = useI18n()

  // Memoized values from props instead of auth hook
  const user = createMemo(() => props.authState.user)
  const isAuthenticated = createMemo(() => props.authState.isAuthenticated)
  const userName = createMemo(() => user()?.name || user()?.email || 'User')
  const userEmail = createMemo(() => user()?.email || '')
  const userImage = createMemo(() => user()?.image || '')
  const userRole = createMemo(() => user()?.role || 'user')

  const handleSignOut = async () => {
    try {
      setIsOpen(false)
      await props.onSignOut()
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
          <DropdownMenuItem onClick={handleSignOut}>{t('auth.signOut')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Show>
  )
}

export default UserButton
