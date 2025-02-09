import { RouteSectionProps } from '@solidjs/router'
import { useLocation } from '@solidjs/router'
import { Suspense, lazy } from 'solid-js'
import { createMediaQuery } from '@solid-primitives/media'
import NavSkeleton from '~/components/Nav/NavSkeleton'
import FooterSkeleton from '~/components/Footer/FooterSkeleton'

// Lazy load components
const Nav = lazy(() => import('~/components/Nav/Nav'))
const SiteFooter = lazy(() => import('~/components/Footer/Footer'))

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isLargeScreen = createMediaQuery('(min-width: 768px)')
  const isHomePage = () => location.pathname === '/'

  return (
    <div class='min-h-screen flex flex-col relative'>
      {/* On mobile, render Nav without skeleton. On desktop, use Suspense with skeleton */}
      {isLargeScreen() ? (
        <Suspense fallback={<NavSkeleton />}>
          <Nav />
        </Suspense>
      ) : (
        <Nav />
      )}

      <main class={`${isHomePage() ? '' : 'pt-16'} flex-1 relative`} role='main'>
        {props.children}
      </main>

      <div class={`${isLargeScreen() ? '' : 'pb-32'}`}>
        <Suspense fallback={<FooterSkeleton />}>
          <SiteFooter />
        </Suspense>
      </div>
    </div>
  )
}
