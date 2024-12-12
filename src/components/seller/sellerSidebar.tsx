import { Component, For, Show, createSignal, createEffect } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { createMediaQuery } from '@solid-primitives/media'
import { useAuth } from '@solid-mediakit/auth/client'
import type { Session } from '@solid-mediakit/auth'
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '~/components/ui/sidebar'
import { BiLogosChrome } from 'solid-icons/bi'
import { TbDeviceAnalytics } from 'solid-icons/tb'
import { BsBoxes } from 'solid-icons/bs'
import { BsReceipt } from 'solid-icons/bs'
import { FiSettings } from 'solid-icons/fi'
import SellerUserButton from './sellerUserbtn'
import { useI18n } from '~/contexts/i18n'

export function SellerSidebar() {
  const location = useLocation()
  const auth = useAuth()
  const { state, setOpenMobile } = useSidebar()
  const isMobile = createMediaQuery('(max-width: 767px)')
  const { locale, t, isLoading: i18nLoading } = useI18n()
  const isRTL = () => locale() === 'ar'

  // Add session management
  const [currentSession, setCurrentSession] = createSignal<Session | null>(null)
  const [isLoading, setIsLoading] = createSignal(true)

  const handleNavClick = () => {
    if (isMobile()) {
      setOpenMobile(false)
    }
  }

  // Effect to handle session changes
  createEffect(() => {
    const session = auth.session()
    // Handle the possibly undefined session value
    setCurrentSession(session ?? null)
    setIsLoading(false)
  })

  const getData = () => ({
    mainMenu: [
      {
        title: t('seller.sidebar.mainMenu'),
        items: [
          {
            name: t('seller.sidebar.dashboard'),
            url: '/seller',
            icon: TbDeviceAnalytics,
          },
          {
            name: t('seller.sidebar.products'),
            url: '/seller/products',
            icon: BsBoxes,
          },
          {
            name: t('seller.sidebar.orders'),
            url: '/seller/orders',
            icon: BsReceipt,
          },
        ],
      },
    ],
  })

  return (
    <Show when={!i18nLoading()} fallback={<div class='h-full' />}>
      <div class='flex flex-col h-full'>
        <SidebarHeader>
          <SidebarMenu dir={isRTL() ? 'rtl' : 'ltr'}>
            <SidebarMenuItem>
              <A href='/'>
                <SidebarMenuButton
                  size='lg'
                  class='group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <div class='flex items-center gap-3'>
                    <div class='flex-shrink-0'>
                      <BiLogosChrome class='size-4' />
                    </div>
                    {(state() !== 'collapsed' || isMobile()) && (
                      <span class='truncate font-semibold'>{t('seller.sidebar.storeName')}</span>
                    )}
                  </div>
                </SidebarMenuButton>
              </A>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent class='flex-1 overflow-y-auto'>
          <For each={getData().mainMenu}>
            {(section) => (
              <SidebarGroup>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <For each={section.items}>
                      {(item) => (
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            as={A}
                            href={item.url}
                            tooltip={item.name}
                            class='group/menu-item'
                            onClick={handleNavClick}
                            data-active={location.pathname === item.url}
                            data-state={location.pathname === item.url ? 'active' : 'inactive'}
                          >
                            <item.icon class='size-4' />
                            <span class='flex-1'>{item.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </For>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </For>
        </SidebarContent>

        <SidebarFooter class='min-h-[88px]'>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                as={A}
                href='/seller/settings'
                tooltip={t('seller.sidebar.settings')}
                class='group/menu-item'
                onClick={handleNavClick}
                data-active={location.pathname === '/seller/settings'}
                data-state={location.pathname === '/seller/settings' ? 'active' : 'inactive'}
              >
                <FiSettings class='size-4' />
                <span class='flex-1'>{t('seller.sidebar.settings')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Show when={!isLoading()}>
              <SidebarMenuItem>
                <SellerUserButton session={currentSession()} />
              </SidebarMenuItem>
            </Show>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </div>
    </Show>
  )
}
