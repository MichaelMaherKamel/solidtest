import { Component, createMemo, Show, Switch, Match, createSignal } from 'solid-js'
import { A, useNavigate, useLocation } from '@solidjs/router'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { FaRegularUser } from 'solid-icons/fa'
import { useI18n } from '~/contexts/i18n'
import { useAuthState } from '~/contexts/auth'
import { Skeleton } from '~/components/ui/skeleton'
import { showToast } from '~/components/ui/toast'
import { cn } from '~/lib/utils'
import { CgProfile } from 'solid-icons/cg'
import { TbDeviceAnalytics } from 'solid-icons/tb'
import { RiBuildingsStore2Line } from 'solid-icons/ri'
import { TbLogout2 } from 'solid-icons/tb'

interface UserButtonProps {
  buttonColorClass?: string
  forFooter?: boolean
  setIsUserOpen: (isOpen: boolean) => void
  setref: (el: HTMLDivElement | undefined) => void
  isUserOpen: boolean
}

const RETURN_PATH_KEY = 'auth_return_path'

const getDropdownStyles = (isOpen: boolean, isRTL: boolean, isBottom = false) => `
  absolute ${isRTL ? 'left-0' : 'right-0'} ${isBottom ? 'bottom-full mb-2' : 'top-full mt-2'}
  rounded-lg shadow-lg
  bg-white ring-1 ring-black ring-opacity-5
  transition-all duration-300 ease-in-out origin-top-right
  ${
    isOpen
      ? 'opacity-100 transform scale-100 translate-y-0'
      : 'opacity-0 transform scale-95 -translate-y-2 pointer-events-none'
  }
`

interface MenuItemProps {
  icon: Component
  text: string
  onClick: () => void
  isRTL: boolean
}

const MenuItem: Component<MenuItemProps> = (props) => {
  return (
    <button
      class={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center ${
        props.isRTL ? 'flex-row justify-start' : 'flex-row justify-start'
      }`}
      onClick={props.onClick}
    >
      <span>{props.text}</span>
      <props.icon class={`h-4 w-4 ${props.isRTL ? 'mr-2' : 'ml-2'}`} />
    </button>
  )
}

export const UserButton: Component<UserButtonProps> = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, locale } = useI18n()
  const auth = useAuthState()
  const isRTL = createMemo(() => locale() === 'ar')

  const userData = createMemo(() => ({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    image: auth.user?.image || '',
    initials: auth.user?.name?.[0]?.toUpperCase() || 'U',
    role: auth.user?.role || 'guest',
  }))

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSignOut = async () => {
    try {
      props.setIsUserOpen(false)
      await auth.signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      showToast({
        title: t('auth.error'),
        description: t('auth.signOutError'),
        variant: 'destructive',
      })
    }
  }

  const handleMenuItemClick = (path: string) => {
    props.setIsUserOpen(false)
    navigate(path)
  }

  const handleAuthClick = () => {
    // Save current path before redirecting
    localStorage.setItem(RETURN_PATH_KEY, location.pathname + location.search)
    // Redirect to auth page
    navigate('/login')
  }

  const buttonClasses = cn(
    'relative',
    props.forFooter ? 'h-10 w-10' : 'h-10 w-10 rounded-full',
    props.buttonColorClass || ''
  )

  return (
    <div class='relative' dir={isRTL() ? 'rtl' : 'ltr'}>
      <Switch
        fallback={
          <Button
            variant='ghost'
            size='icon'
            class={cn('hover:bg-white/10', props.buttonColorClass || 'text-gray-800 hover:text-gray-900')}
            onClick={handleAuthClick}
          >
            <FaRegularUser class='h-5 w-5' />
          </Button>
        }
      >
        <Match when={auth.status === 'loading'}>
          <Skeleton class='h-10 w-10 rounded-full' />
        </Match>
        <Match when={auth.status === 'authenticated'}>
          <>
            <Button
              ref={props.setref}
              variant='ghost'
              class={buttonClasses}
              onClick={() => props.setIsUserOpen(!props.isUserOpen)}
            >
              <Avatar>
                <AvatarImage src={userData().image} alt={userData().name} />
                <AvatarFallback>{getInitials(userData().name)}</AvatarFallback>
              </Avatar>
            </Button>

            <div
              ref={props.setref}
              class={getDropdownStyles(props.isUserOpen, isRTL(), props.forFooter) + ' w-64 z-50'}
            >
              <div class='py-1 bg-white rounded-lg shadow-lg'>
                <Show
                  when={!auth.loading}
                  fallback={
                    <div class='px-4 py-2'>
                      <Skeleton class='h-4 w-32 mb-2' />
                      <Skeleton class='h-3 w-24' />
                    </div>
                  }
                >
                  <div class='px-4 py-2 text-sm text-gray-700'>
                    <div class='font-medium line-clamp-1'>{userData().name}</div>
                    <div class='text-xs text-gray-500 line-clamp-1'>{userData().email}</div>
                  </div>
                </Show>

                <hr class='border-gray-200' />

                <MenuItem
                  icon={CgProfile}
                  text={t('nav.account')}
                  onClick={() => handleMenuItemClick('/account')}
                  isRTL={isRTL()}
                />

                <Show when={userData().role === 'admin'}>
                  <MenuItem
                    icon={TbDeviceAnalytics}
                    text={t('nav.admin')}
                    onClick={() => handleMenuItemClick('/admin')}
                    isRTL={isRTL()}
                  />
                </Show>

                <Show when={userData().role === 'seller'}>
                  <MenuItem
                    icon={RiBuildingsStore2Line}
                    text={t('nav.seller')}
                    onClick={() => handleMenuItemClick('/seller')}
                    isRTL={isRTL()}
                  />
                </Show>

                <hr class='my-1 border-gray-200' />

                <MenuItem icon={TbLogout2} text={t('auth.signOut')} onClick={handleSignOut} isRTL={isRTL()} />
              </div>
            </div>
          </>
        </Match>
      </Switch>
    </div>
  )
}
