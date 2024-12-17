import { A, RouteSectionProps } from '@solidjs/router'
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
import { SellerSidebar } from '~/components/seller/sellerSidebar'
import { useI18n } from '~/contexts/i18n'
import { SellerProvider } from '~/contexts/seller'
import { useAuth } from '@solid-mediakit/auth/client'
import { Alert, AlertDescription } from '~/components/ui/alerts'
import { Show } from 'solid-js'

export default function SellerLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isMobile = createMediaQuery('(max-width: 767px)')
  const { locale } = useI18n()
  const isRTL = () => locale() === 'ar'
  const auth = useAuth()
  const user = () => auth.session()?.user

  const isUnauthorized = () => {
    const userRole = user()?.role
    return !userRole || (userRole !== 'seller' && userRole !== 'admin')
  }

  return (
    <Show
      when={!isUnauthorized()}
      fallback={
        <div class='p-6 flex items-center justify-center'>
          <Alert variant='destructive' class='max-w-md'>
            <AlertDescription class='text-center'>You must be a seller to access this page.</AlertDescription>
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
      <SellerProvider>
        <div class='flex h-screen overflow-hidden' dir={isRTL() ? 'rtl' : 'ltr'}>
          <SidebarProvider>
            <SellerDashboardContent location={location} isMobile={isMobile} children={props.children} />
          </SidebarProvider>
        </div>
      </SellerProvider>
    </Show>
  )
}

function SellerDashboardContent(props: {
  location: ReturnType<typeof useLocation>
  isMobile: () => boolean
  children: any
}) {
  const { setOpen, setOpenMobile } = useSidebar()
  const { locale, t } = useI18n()
  const isRTL = () => locale() === 'ar'

  // Get the translation key based on the current path
  const getCurrentPageKey = () => {
    const path = props.location.pathname
    if (path === '/seller') {
      return 'seller.layout.dashboard'
    }
    const segments = path.split('/')
    const lastSegment = segments[segments.length - 1]
    return `seller.layout.${lastSegment}`
  }

  createEffect(() => {
    if (props.isMobile()) {
      setOpenMobile(false)
    }
  })

  return (
    <div class='flex flex-1 overflow-hidden'>
      <Sidebar collapsible='icon' side={isRTL() ? 'right' : 'left'} class='h-screen'>
        <SellerSidebar />
      </Sidebar>
      <SidebarInset class='flex flex-col flex-1 min-w-0'>
        <header class='flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div class='flex items-center gap-2 px-4'>
            <SidebarTrigger
              class={isRTL() ? '-mr-1' : '-ml-1'}
              aria-label={t('common.toggleSidebar', { defaultValue: 'Toggle Sidebar' })}
            />
            <Separator orientation='vertical' class={isRTL() ? 'mr-2' : 'ml-2'} />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class='hidden md:block'>
                  <BreadcrumbLink href='/seller'>{t('seller.layout.storeOverview')}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbLink current>{t(getCurrentPageKey())}</BreadcrumbLink>
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
