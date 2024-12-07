import { A, useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { createSignal, Show } from 'solid-js'
import { AiOutlineClose } from 'solid-icons/ai'
import { IoMenu } from 'solid-icons/io'

const MENU_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/stores', label: 'Stores' },
  { path: '/images', label: 'Gallery' },
  { path: '/admin', label: 'Admin' },
]

export default function Nav() {
  const [isOpen, setIsOpen] = createSignal(false)
  const location = useLocation()

  const active = (path: string) =>
    path === location.pathname
      ? 'bg-sky-700/50 text-white border-sky-400'
      : 'border-transparent text-gray-100 hover:bg-sky-700/30 hover:text-white hover:border-sky-300'

  const toggleMenu = () => setIsOpen(!isOpen())

  return (
    <nav class='bg-sky-800 shadow-md'>
      <div class='container mx-auto px-4'>
        <div class='flex items-center justify-between h-16'>
          {/* Logo/Brand - always visible */}
          <div class='flex-shrink-0'>
            <A href='/' class='text-white font-bold text-xl hover:text-sky-100 transition-colors'>
              Logo
            </A>
          </div>

          {/* Desktop Menu */}
          <div class='hidden md:flex items-center gap-2'>
            {MENU_ITEMS.map((item) => (
              <Button
                as={A}
                href={item.path}
                variant='ghost'
                class={`border-b-2 transition-all duration-200 ${active(item.path)}`}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div class='flex md:hidden'>
            <Button variant='ghost' size='icon' class='text-white hover:bg-sky-700/30' onClick={toggleMenu}>
              <Show when={isOpen()} fallback={<IoMenu class='h-5 w-5' />}>
                <AiOutlineClose class='h-5 w-5' />
              </Show>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Show when={isOpen()}>
          <div class='md:hidden'>
            <div class='px-2 pt-2 pb-3 space-y-2 animate-in slide-in-from-top duration-200'>
              {MENU_ITEMS.map((item) => (
                <Button
                  as={A}
                  href={item.path}
                  variant='ghost'
                  class={`w-full justify-start border-l-4 ${
                    location.pathname === item.path
                      ? 'bg-sky-700/50 text-white border-sky-400'
                      : 'border-transparent text-gray-100 hover:bg-sky-700/30 hover:text-white hover:border-sky-300'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </Show>
      </div>
    </nav>
  )
}
