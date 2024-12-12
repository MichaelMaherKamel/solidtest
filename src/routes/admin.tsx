import { RouteSectionProps } from '@solidjs/router'
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '~/components/ui/sidebar'
import { AdminSidebar } from '~/components/admin/adminSidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import { createEffect } from 'solid-js'
import { useLocation } from '@solidjs/router'
import { createMediaQuery } from '@solid-primitives/media'

export default function AdminLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isMobile = createMediaQuery('(max-width: 767px)')

  return (
    <div class='flex h-screen w-full overflow-hidden'>
      <SidebarProvider>
        <AdminDashboardContent location={location} isMobile={isMobile} children={props.children} />
      </SidebarProvider>
    </div>
  )
}

function AdminDashboardContent(props: {
  location: ReturnType<typeof useLocation>
  isMobile: () => boolean
  children: any
}) {
  const { setOpen, setOpenMobile } = useSidebar()

  createEffect(() => {
    if (props.isMobile()) {
      setOpenMobile(false)
    }
  })

  return (
    <div class='flex h-screen w-full' dir='ltr'>
      <AdminSidebar />
      <SidebarInset class='flex-1 flex flex-col min-h-screen overflow-hidden'>
        <header class='flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div class='flex items-center gap-2 w-full'>
            <SidebarTrigger class='-ml-1' />
            <Separator orientation='vertical' class='mr-2 h-4' />
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
