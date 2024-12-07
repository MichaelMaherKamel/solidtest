import { For } from 'solid-js'
import type { ComponentProps } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { createMediaQuery } from '@solid-primitives/media'
import {
  Sidebar,
  SidebarContent,
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
import { TbDeviceAnalytics, TbUsers } from 'solid-icons/tb'
import { BiSolidStore } from 'solid-icons/bi'
import { FaSolidReceipt } from 'solid-icons/fa'

const MENU_DATA = [
  {
    title: 'Main Menu',
    items: [
      {
        title: 'Dashboard',
        url: '/admin',
        icon: TbDeviceAnalytics,
      },
      {
        title: 'Users',
        url: '/admin/users',
        icon: TbUsers,
      },
      {
        title: 'Stores',
        url: '/admin/stores',
        icon: BiSolidStore,
      },
      {
        title: 'Orders',
        url: '/admin/orders',
        icon: FaSolidReceipt,
      },
    ],
  },
]

export function AdminSidebar() {
  const location = useLocation()
  const isMobile = createMediaQuery('(max-width: 767px)')
  const { state, setOpenMobile } = useSidebar()

  // Handle navigation and mobile menu closing
  const handleNavClick = () => {
    if (isMobile()) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible='icon' side='left'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <A href='/'>
              <SidebarMenuButton
                size='lg'
                class='group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div class='flex aspect-square items-center justify-center rounded-lg text-sidebar-primary-foreground transition-all'>
                  <BiLogosChrome class='size-4' />
                </div>
                {(state() !== 'collapsed' || isMobile()) && (
                  <div class='grid flex-1 text-left text-sm leading-tight'>
                    <span class='truncate font-semibold'>Souq El Rafay3</span>
                  </div>
                )}
              </SidebarMenuButton>
            </A>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <For each={MENU_DATA}>
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
                          tooltip={item.title}
                          class='group/menu-item'
                          onClick={handleNavClick}
                          data-active={location.pathname === item.url}
                          data-state={location.pathname === item.url ? 'active' : 'inactive'}
                        >
                          <item.icon class='size-4' />
                          <span class='flex-1'>{item.title}</span>
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
      <SidebarRail />
    </Sidebar>
  )
}
