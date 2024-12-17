import { A, RouteSectionProps, useLocation } from '@solidjs/router'
import { createEffect, ParentComponent, Show, Suspense } from 'solid-js'
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
import { AdminSidebar } from '~/components/admin/adminSidebar'
import { AdminProvider } from '~/contexts/admin'
import { useAuth } from '@solid-mediakit/auth/client'
import { Alert, AlertDescription } from '~/components/ui/alerts'

// Improved loading components
function SidebarSkeleton() {
  const isMobile = createMediaQuery('(max-width: 767px)')

  return (
    <div class='flex flex-col h-full'>
      {/* Header */}
      <div class='flex items-center h-16 px-4 border-b'>
        <div class='flex items-center gap-3'>
          <div class='w-4 h-4 bg-muted animate-pulse rounded' />
          <Show when={!isMobile()}>
            <div class='h-4 w-28 bg-muted animate-pulse rounded' />
          </Show>
        </div>
      </div>

      {/* Menu section */}
      <div class='flex-1 px-3 py-4'>
        <div class='space-y-4'>
          <div class='px-2'>
            <div class='h-4 w-20 bg-muted animate-pulse rounded' />
          </div>
          <div class='space-y-1'>
            {Array(3)
              .fill(0)
              .map(() => (
                <div class='flex items-center h-10 px-2 rounded-md'>
                  <div class='w-4 h-4 bg-muted animate-pulse rounded' />
                  <Show when={!isMobile()}>
                    <div class='ml-3 h-4 w-20 bg-muted animate-pulse rounded' />
                  </Show>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Footer with settings and user */}
      <div class='mt-auto px-3 py-4'>
        <div class='space-y-3'>
          {/* Settings */}
          <div class='flex items-center h-10 px-2 rounded-md'>
            <div class='w-4 h-4 bg-muted animate-pulse rounded' />
            <Show when={!isMobile()}>
              <div class='ml-3 h-4 w-16 bg-muted animate-pulse rounded' />
            </Show>
          </div>
          {/* User button */}
          <div class='flex items-center gap-3 px-2 py-2'>
            <div class='w-8 h-8 bg-muted animate-pulse rounded-lg' />
            <Show when={!isMobile()}>
              <div class='flex-1 space-y-1.5'>
                <div class='h-3.5 w-24 bg-muted animate-pulse rounded' />
                <div class='h-3 w-28 bg-muted animate-pulse rounded' />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeaderSkeleton() {
  return (
    <div class='h-16 border-b flex items-center'>
      <div class='flex items-center gap-2 px-4'>
        <div class='w-8 h-8 rounded-md bg-muted animate-pulse' />
        <div class='w-px h-4 bg-border mx-2' />
        <div class='flex items-center gap-2'>
          <div class='hidden md:flex items-center gap-2'>
            <div class='h-4 w-24 bg-muted animate-pulse rounded' />
            <div class='text-muted-foreground'>/</div>
          </div>
          <div class='h-4 w-20 bg-muted animate-pulse rounded' />
        </div>
      </div>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <div class='p-6 space-y-6'>
      {/* Header section */}
      <div class='space-y-1'>
        <div class='h-7 w-32 bg-muted rounded animate-pulse' />
        <div class='h-5 w-48 bg-muted rounded animate-pulse' />
      </div>

      {/* Stats grid */}
      <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {Array(4)
          .fill(0)
          .map(() => (
            <div class='p-6 rounded-lg border bg-card text-card-foreground shadow-sm'>
              <div class='space-y-3'>
                <div class='h-4 w-24 bg-muted rounded animate-pulse' />
                <div class='h-7 w-28 bg-muted rounded animate-pulse' />
              </div>
            </div>
          ))}
      </div>

      {/* Charts skeleton */}
      <div class='grid gap-4 grid-cols-1 md:grid-cols-2'>
        {Array(2)
          .fill(0)
          .map(() => (
            <div class='p-6 rounded-lg border bg-card text-card-foreground shadow-sm'>
              <div class='h-[300px] bg-muted rounded animate-pulse' />
            </div>
          ))}
      </div>
    </div>
  )
}

// Auth wrapper component
const AuthCheck: ParentComponent = (props) => {
  const auth = useAuth()
  const user = () => auth.session()?.user

  const isUnauthorized = () => {
    const userRole = user()?.role
    return !userRole || userRole !== 'admin'
  }

  return (
    <Show
      when={!isUnauthorized()}
      fallback={
        <div class='p-6 flex items-center justify-center'>
          <Alert variant='destructive' class='max-w-md'>
            <AlertDescription class='text-center'>You must be an admin to access this page.</AlertDescription>
            <div class='p-6 text-center'>
              <A
                href='/'
                class='inline-block bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300'
              >
                Go to Home Page
              </A>
            </div>
          </Alert>
        </div>
      }
    >
      {props.children}
    </Show>
  )
}

// Content wrapper
const AdminContentWrapper: ParentComponent = (props) => {
  const location = useLocation()
  const { setOpen, setOpenMobile } = useSidebar()
  const isMobile = createMediaQuery('(max-width: 767px)')

  const getCurrentPageKey = () => {
    const path = location.pathname
    if (path === '/admin') {
      return 'Dashboard'
    }
    const segments = path.split('/')
    const lastSegment = segments[segments.length - 1]
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  createEffect(() => {
    if (isMobile()) {
      setOpenMobile(false)
    }
  })

  return (
    <div class='flex flex-1 overflow-hidden'>
      <Sidebar collapsible='icon' side='left' class='h-screen'>
        <Suspense fallback={<SidebarSkeleton />}>
          <AdminSidebar />
        </Suspense>
      </Sidebar>
      <SidebarInset class='flex flex-col flex-1 min-w-0'>
        <header class='flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div class='flex items-center gap-2 px-4'>
            <SidebarTrigger class='-ml-1' aria-label='Toggle Sidebar' />
            <Separator orientation='vertical' class='ml-2' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class='hidden md:block'>
                  <BreadcrumbLink href='/admin'>Admin Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbLink current>{getCurrentPageKey()}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div class='flex-1 overflow-y-auto relative'>
          <Suspense fallback={<ContentSkeleton />}>{props.children}</Suspense>
        </div>
      </SidebarInset>
    </div>
  )
}

// Main layout component
export default function AdminLayout(props: RouteSectionProps) {
  const isMobile = createMediaQuery('(max-width: 767px)')

  return (
    <AuthCheck>
      <Suspense
        fallback={
          <div class='flex h-screen overflow-hidden'>
            <Show when={!isMobile()}>
              <div class='w-64 border-r'>
                <SidebarSkeleton />
              </div>
            </Show>
            <div class='flex-1'>
              <HeaderSkeleton />
              <ContentSkeleton />
            </div>
          </div>
        }
      >
        <AdminProvider>
          <div class='flex h-screen overflow-hidden'>
            <SidebarProvider>
              <AdminContentWrapper>{props.children}</AdminContentWrapper>
            </SidebarProvider>
          </div>
        </AdminProvider>
      </Suspense>
    </AuthCheck>
  )
}
