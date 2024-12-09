import { RouteSectionProps } from '@solidjs/router'
import Nav from '~/components/Nav'
import { useLocation } from '@solidjs/router'

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()
  const isHomePage = () => location.pathname === '/'
  return (
    <>
      <Nav />
      <main class={isHomePage() ? '' : 'pt-16'}>{props.children}</main>
    </>
  )
}
