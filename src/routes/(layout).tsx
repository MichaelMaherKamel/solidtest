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
import Nav from '~/components/Nav'
import SiteFooter from '~/components/Footer'
import { Suspense } from 'solid-js'

// Simple loading component
const LoadingShell = () => (
  <div class='min-h-screen flex flex-col relative'>
    <div class='h-16 bg-white/50 backdrop-blur-sm shadow-sm' />
    <div class='flex-1 animate-pulse bg-gray-50' />
    <div class='h-16 bg-white/50 backdrop-blur-sm' />
  </div>
)

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()

  return (
    <Suspense fallback={<LoadingShell />}>
      <div class='min-h-screen flex flex-col relative'>
        <Nav />
        <main class={`${location.pathname === '/' ? '' : 'pt-16'} flex-1 relative`}>{props.children}</main>
        <SiteFooter />
      </div>
    </Suspense>
  )
}
