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
    <div class='flex h-screen overflow-hidden'>
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

  // Close mobile sidebar on route change
  createEffect(() => {
    if (props.isMobile()) {
      setOpenMobile(false)
    }
  })

  return (
    <>
      <AdminSidebar />
      <SidebarInset>
        <header class='flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div class='flex items-center gap-2'>
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
        <main class='p-4'>{props.children}</main>
      </SidebarInset>
    </>
  )
}
