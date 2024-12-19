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
import SellerUserButton from './SellerUserButton'
import { useI18n } from '~/contexts/i18n'

export function SellerSidebar() {
  const location = useLocation()
  const auth = useAuth()
  const { state, setOpenMobile } = useSidebar()
  const isMobile = createMediaQuery('(max-width: 767px)')
  const { locale, t, isLoading: i18nLoading } = useI18n()
  const isRTL = () => locale() === 'ar'

  const [currentSession, setCurrentSession] = createSignal<Session | null>(null)
  const [isLoading, setIsLoading] = createSignal(true)

  const handleNavClick = () => {
    if (isMobile()) {
      setOpenMobile(false)
    }
  }

  createEffect(() => {
    const session = auth.session()
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

  // Function to render menu item content with left-aligned icons
  const renderMenuContent = (icon: any, text: string, collapsed = false) => {
    const Icon = icon
    if (collapsed && !isMobile()) {
      return <Icon class='size-4' />
    }
    return (
      <div class='w-full flex items-center gap-3'>
        {/* Icon always on the left */}
        <div class='flex-shrink-0'>
          <Icon class='size-4' />
        </div>
        {/* Text with proper alignment based on language */}
        <span class={`truncate flex-1 ${isRTL() ? 'text-right' : 'text-left'}`}>{text}</span>
      </div>
    )
  }

  return (
    <Show when={!i18nLoading()} fallback={<div class='h-full' />}>
      <div
        class='flex flex-col h-full'
        style={{
          direction: isRTL() ? 'rtl' : 'ltr',
        }}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <A href='/'>
                <SidebarMenuButton
                  size='lg'
                  class='group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full'
                >
                  {renderMenuContent(BiLogosChrome, t('seller.sidebar.storeName'), state() === 'collapsed')}
                </SidebarMenuButton>
              </A>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent class='flex-1 overflow-y-auto'>
          <For each={getData().mainMenu}>
            {(section) => (
              <SidebarGroup>
                <SidebarGroupLabel class={`w-full ${isRTL() ? 'text-right pr-2' : 'text-left pl-2'}`}>
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <For each={section.items}>
                      {(item) => (
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            as={A}
                            href={item.url}
                            tooltip={item.name}
                            class='group/menu-item w-full'
                            onClick={handleNavClick}
                            data-active={location.pathname === item.url}
                            data-state={location.pathname === item.url ? 'active' : 'inactive'}
                          >
                            {renderMenuContent(item.icon, item.name, state() === 'collapsed')}
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
                class='group/menu-item w-full'
                onClick={handleNavClick}
                data-active={location.pathname === '/seller/settings'}
                data-state={location.pathname === '/seller/settings' ? 'active' : 'inactive'}
              >
                {renderMenuContent(FiSettings, t('seller.sidebar.settings'), state() === 'collapsed')}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Show when={!isLoading()}>
              <SidebarMenuItem>
                <div class='w-full'>
                  <SellerUserButton session={currentSession()} />
                </div>
              </SidebarMenuItem>
            </Show>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </div>
    </Show>
  )
}

export default SellerSidebar
