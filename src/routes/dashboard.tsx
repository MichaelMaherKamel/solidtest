import { RouteSectionProps } from '@solidjs/router'
import { useLocation } from '@solidjs/router'
import { createEffect } from 'solid-js'
import { createMediaQuery } from '@solid-primitives/media'
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '~/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import { DashboardSidebarContent } from '~/components/dashboard/DashboardSidebarContent'

export default function DashboardLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isMobile = createMediaQuery('(max-width: 767px)')

  return (
    <div class='flex h-screen overflow-hidden' dir='rtl'>
      <SidebarProvider>
        <DashboardContent location={location} isMobile={isMobile} children={props.children} />
      </SidebarProvider>
    </div>
  )
}

function DashboardContent(props: { location: ReturnType<typeof useLocation>; isMobile: () => boolean; children: any }) {
  const { setOpen, setOpenMobile } = useSidebar()

  createEffect(() => {
    if (props.isMobile()) {
      setOpenMobile(false)
    }
  })

  return (
    <div class='flex flex-1 overflow-hidden'>
      <Sidebar collapsible='icon' side='right' class='h-screen'>
        <DashboardSidebarContent />
      </Sidebar>
      <SidebarInset class='flex flex-col flex-1 min-w-0'>
        <header class='flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div class='flex items-center gap-2 px-4'>
            <SidebarTrigger class='-mr-1' lang='AR' />
            <Separator orientation='vertical' class='ml-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class='hidden md:block'>
                  <BreadcrumbLink href='/admin'>Admin Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbLink current>Overview</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div class='flex-1 overflow-y-auto relative'>{props.children}</div>
      </SidebarInset>
    </div>
  )
}
