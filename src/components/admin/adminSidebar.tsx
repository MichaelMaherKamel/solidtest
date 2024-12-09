import { createSignal, For, createEffect } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { createMediaQuery } from '@solid-primitives/media'
import {
  Sidebar,
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
import { supabase } from '~/lib/supabase/supabase'
import { AuthSession } from '@supabase/supabase-js'
import { BiLogosChrome } from 'solid-icons/bi'
import { TbDeviceAnalytics, TbUsers } from 'solid-icons/tb'
import { RiBuildingsStore2Line } from 'solid-icons/ri'
import { BsReceipt } from 'solid-icons/bs'
import { FiSettings } from 'solid-icons/fi'
import AdminUserButton from './adminUserBtn'

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
        icon: RiBuildingsStore2Line,
      },
      {
        title: 'Orders',
        url: '/admin/orders',
        icon: BsReceipt,
      },
    ],
  },
]

export function AdminSidebar() {
  const location = useLocation()
  const [session, setSession] = createSignal<AuthSession | null>(null)
  const isMobile = createMediaQuery('(max-width: 767px)')
  const { state, setOpenMobile } = useSidebar()

  const handleNavClick = () => {
    if (isMobile()) {
      setOpenMobile(false)
    }
  }

  createEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  })

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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              as={A}
              href='/admin/settings'
              tooltip='settings'
              class='group/menu-item'
              onClick={handleNavClick}
              data-active={location.pathname === '/admin/settings'}
              data-state={location.pathname === '/admin/settings' ? 'active' : 'inactive'}
            >
              <FiSettings class='size-4' />
              <span class='flex-1'>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <AdminUserButton session={session()} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
