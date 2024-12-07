import { RouteSectionProps } from '@solidjs/router'
import { A } from '@solidjs/router'
import Nav from '~/components/Nav'

export default function RootLayout(props: RouteSectionProps) {
  return (
    <>
      <Nav />
      <main>{props.children}</main>
    </>
  )
}
