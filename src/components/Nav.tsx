import { useLocation } from '@solidjs/router'
import { Button } from './ui/button'

export default function Nav() {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname ? 'border-sky-600' : 'border-transparent hover:border-sky-600'
  return (
    <nav class='bg-sky-800'>
      <ul class='container flex items-center p-3 text-gray-200'>
        <li class={`border-b-2 ${active('/')} mx-1.5 sm:mx-6`}>
          <Button variant='outline' class='text-white'>
            <a href='/'>Home</a>
          </Button>
        </li>
        <li class={`border-b-2 ${active('/about')} mx-1.5 sm:mx-6`}>
          <Button variant='outline' class='text-white'>
            <a href='/about'>About</a>
          </Button>
        </li>
      </ul>
    </nav>
  )
}
