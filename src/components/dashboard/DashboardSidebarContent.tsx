import { Component, Show } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { IoAlertSharp } from 'solid-icons/io'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  useSidebar,
} from '~/components/ui/sidebar'

const data = {
  قائمة: [
    {
      name: 'العنوان',
      url: '/dashboard/address',
      icon: IoAlertSharp,
    },
    {
      name: 'الطلبات',
      url: '/dashboard/orders',
      icon: IoAlertSharp,
    },
    {
      name: 'الحساب',
      url: '/dashboard',
      icon: IoAlertSharp,
    },
  ],
}

interface SidebarContentsProps {}

export const DashboardSidebarContent: Component<SidebarContentsProps> = (props) => {
  const { state } = useSidebar()
  const location = useLocation()
  const { isMobile } = useSidebar()

  const isCollapsed = () => state() === 'collapsed'
  const logoSize = () => (isMobile() || !isCollapsed() ? '56px' : '40px')

  return (
    <div class='flex flex-col h-full'>
      <SidebarHeader>
        <SidebarMenu dir='rtl'>
          <SidebarMenuItem>
            <A href='/'>
              <SidebarMenuButton
                size='lg'
                class='group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div class='flex items-center gap-3'>
                  <div class='flex-shrink-0 text-2xl'>
                    <IoAlertSharp />
                  </div>
                  <Show when={!isCollapsed() || isMobile()}>
                    <div class='grid flex-1 text-right text-sm leading-tight'>
                      <span class='truncate font-semibold'>SOUQ EL RAFAY3</span>
                      <span class='truncate text-xs text-muted-foreground'>سوق الرفايع</span>
                    </div>
                  </Show>
                </div>
              </SidebarMenuButton>
            </A>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent class='flex-1 overflow-y-auto'>
        <SidebarGroup dir='rtl'>
          <SidebarGroupLabel>قائمة</SidebarGroupLabel>
          <SidebarMenu>
            {data.قائمة.map((item) => (
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <A
                    href={item.url}
                    class={`flex items-center gap-3 ${
                      location.pathname === item.url ? 'bg-accent text-accent-foreground' : ''
                    }`}
                  >
                    <div class='flex-shrink-0'>
                      <item.icon />
                    </div>
                    <Show when={!isCollapsed() || isMobile()}>
                      <span class='flex-1'>{item.name}</span>
                    </Show>
                  </A>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem dir='rtl'>
            {/* <UserDropdownMenu profile={props.profile} profileRole={props.profileRole} env={props.env} /> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  )
}
