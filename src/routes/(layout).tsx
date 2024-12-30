// import { RouteSectionProps } from '@solidjs/router'
// import Nav from '~/components/Nav'
// import { useLocation } from '@solidjs/router'
// import Header from '~/components/Header'

// export default function RootLayout(props: RouteSectionProps) {
//   const location = useLocation()
//   const isHomePage = () => location.pathname === '/'

//   return (
//     <div class='min-h-screen relative'>
//       <Nav />
//       {/* <Header /> */}
//       <main class={`${isHomePage() ? '' : 'pt-16'} relative`}>{props.children}</main>
//     </div>
//   )
// }

// import { RouteSectionProps } from '@solidjs/router'
// import { useLocation } from '@solidjs/router'
// import Nav from '~/components/Nav'
// import SiteFooter from '~/components/Footer'
// import { createMediaQuery } from '@solid-primitives/media'

// export default function RootLayout(props: RouteSectionProps) {
//   const location = useLocation()
//   const isLargeScreen = createMediaQuery('(min-width: 768px)')
//   const isHomePage = () => location.pathname === '/'

//   return (
//     <div class='min-h-screen flex flex-col relative'>
//       <Nav />
//       <main class={`${isHomePage() ? '' : 'pt-16'} flex-1 relative`}>{props.children}</main>
//       {/* Add padding bottom on mobile to account for the dock navigation */}
//       <div class={`${isLargeScreen() ? '' : 'pb-32'}`}>
//         <SiteFooter />
//       </div>
//     </div>
//   )
// }

// ~/routes/(layout).tsx
import { RouteSectionProps } from '@solidjs/router'
import { useLocation } from '@solidjs/router'
import { Suspense, lazy } from 'solid-js'
import { createMediaQuery } from '@solid-primitives/media'


// Lazy load components
const Nav = lazy(() => import('~/components/Nav'))
const SiteFooter = lazy(() => import('~/components/Footer'))

// Loading components
const NavSkeleton = () => <div class='h-16 bg-white/50 backdrop-blur-sm shadow-sm animate-pulse' />

const FooterSkeleton = () => <div class='h-16 bg-white/50 backdrop-blur-sm animate-pulse' />

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isLargeScreen = createMediaQuery('(min-width: 768px)')
  const isHomePage = () => location.pathname === '/'

  return (
  
      <div class='min-h-screen flex flex-col relative'>
        {/* <Suspense fallback={<NavSkeleton />}> */}
          <Nav />
        {/* </Suspense> */}

        <main class={`${isHomePage() ? '' : 'pt-16'} flex-1 relative`} role='main'>
          {props.children}
        </main>

        <div class={`${isLargeScreen() ? '' : 'pb-32'}`}>
          {/* <Suspense fallback={<FooterSkeleton />}> */}
            <SiteFooter />
          {/* </Suspense> */}
        </div>
      </div>
  
  )
}
