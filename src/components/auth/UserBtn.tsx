// ~/components/auth/UserBtn.tsx
import { Component, createSignal } from 'solid-js'
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
import { useAuthState } from '~/contexts/auth'
import { signOutUser } from '~/db/actions/auth'
import { useAuth } from '@solid-mediakit/auth/client'

interface UserButtonProps {
  buttonColorClass?: string
}

export const UserButton: Component<UserButtonProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const authClient = useAuth()
  const auth = useAuthState()
  const location = useLocation()
  const { t } = useI18n()

  // Early return for loading state
  if (!auth.initialized) {
    return <div class='w-10 h-10 rounded-full animate-pulse bg-gray-200' />
  }

  const getLoginUrl = () => {
    const currentPath = location.pathname
    return currentPath === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(currentPath)}`
  }

  const onSignOut = async () => {
    try {
      setIsOpen(false)
      await auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      alert(t('auth.signOutError'))
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

  if (!auth.user) {
    return (
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
    )
  }

  return (
    <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <Button
          variant='ghost'
          class={`relative h-10 w-10 rounded-full transition-colors duration-200 ${props.buttonColorClass}`}
          aria-label={t('nav.userMenu')}
        >
          <Avatar>
            <AvatarImage src={auth.user.image} alt={auth.user.name} />
            <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div class='flex flex-col space-y-1'>
            <p class='text-sm font-medium'>{auth.user.name}</p>
            <p class='text-xs text-muted-foreground truncate'>{auth.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem as={A} href='/account'>
          {t('nav.account')}
        </DropdownMenuItem>

        {auth.user.role === 'admin' && (
          <DropdownMenuItem as={A} href='/admin'>
            {t('nav.admin')}
          </DropdownMenuItem>
        )}

        {auth.user.role === 'seller' && (
          <DropdownMenuItem as={A} href='/seller'>
            {t('nav.seller')}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>{t('auth.signOut')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
