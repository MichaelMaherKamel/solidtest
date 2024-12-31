// ~/routes/shopping/(layout).tsx
import { RouteSectionProps } from '@solidjs/router'
import { createMediaQuery } from '@solid-primitives/media'
import { Suspense, lazy } from 'solid-js'
import { Skeleton } from '~/components/ui/skeleton'

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
  const isLargeScreen = createMediaQuery('(min-width: 768px)')

  return (
    <div class='min-h-screen flex flex-col'>
      {/* Fixed navigation wrapper - exact height */}
      <header class='fixed top-0 left-0 right-0 z-50 h-[7rem]'>
        <Suspense fallback={<NavSkeleton />}>
          <ShoppingNav />
        </Suspense>
      </header>

      {/* Main content area with fixed top padding */}
      <div class='flex-1 flex flex-col' style='padding-top: 7rem'>
        <main role='main' class='flex-1 w-full'>
          <div class='container mx-auto px-4 py-6'>
            <Suspense fallback={<div class='animate-pulse'>Loading...</div>}>{props.children}</Suspense>
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
