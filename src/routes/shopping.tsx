// ~/routes/shopping/(layout).tsx
import { RouteSectionProps, useLocation } from '@solidjs/router'
import { createMediaQuery } from '@solid-primitives/media'
import { Suspense, lazy, createMemo } from 'solid-js'
import { Skeleton } from '~/components/ui/skeleton'
import ProductGridSkeleton from '~/components/shopping/ProductGridSkeleton'

const ShoppingNav = lazy(() => import('~/components/shopping/ShoppingNav'))
const SiteFooter = lazy(() => import('~/components/Footer'))

const NavSkeleton = () => (
  <div class='h-[7rem] fixed top-0 left-0 right-0 z-50'>
    <Skeleton class='h-full w-full' />
  </div>
)

const FooterSkeleton = () => (
  <div class='h-16'>
    <Skeleton class='h-full w-full' />
  </div>
)

export default function ShoppingLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isLargeScreen = createMediaQuery('(min-width: 768px)')

  const isProductPage = createMemo(() => {
    return location.pathname.match(/^\/shopping\/products\/[^/]+$/)
  })

  const navHeight = createMemo(() => {
    return isProductPage() ? '3rem' : '7rem'
  })

  return (
    <div class='min-h-screen flex flex-col'>
      {/* Fixed navigation wrapper with dynamic height */}
      <header class='fixed top-0 left-0 right-0 z-50' style={{ height: navHeight() }}>
        <Suspense fallback={<NavSkeleton />}>
          <ShoppingNav />
        </Suspense>
      </header>

      {/* Main content area with matching top padding */}
      <div class='flex-1 flex flex-col' style={{ 'padding-top': navHeight() }}>
        <main role='main' class='flex-1 w-full'>
          <div class='container mx-auto px-4 py-6 shadow-none lg:shadow-sm'>
            <Suspense fallback={<ProductGridSkeleton />}>{props.children}</Suspense>
          </div>
        </main>

        <div class={`mt-auto ${isLargeScreen() ? '' : 'pb-16'}`}>
          <Suspense fallback={<FooterSkeleton />}>
            <SiteFooter />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
