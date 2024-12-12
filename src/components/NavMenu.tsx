import { Component, createSignal, createEffect } from 'solid-js'
import { A } from '@solidjs/router'
import { IoMenu } from 'solid-icons/io'
import { AiOutlineClose } from 'solid-icons/ai'
import { Button } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'
import { LocalizationButton } from './LocalizationButton'

const NavMenu: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)

  createEffect(() => {
    if (isOpen()) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })

  const toggleMenu = () => {
    setIsOpen(!isOpen())
  }

  return (
    <div class='relative'>
      {/* Menu Trigger */}
      <Button variant='ghost' size='icon' onClick={toggleMenu} class='relative z-50 transition-transform duration-300'>
        {isOpen() ? (
          <AiOutlineClose class='h-6 w-6 transition-transform duration-300' />
        ) : (
          <IoMenu class='h-6 w-6 transition-transform duration-300' />
        )}
      </Button>

      {/* Dropdown Menu */}
      <div
        class={`fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isOpen() ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div class='container mx-auto px-4 py-20 space-y-6'>
          <nav class='space-y-6 text-xl'>
            <A href='/primitives' class='block hover:text-primary transition-colors' onClick={toggleMenu}>
              Primitives
            </A>
            <A href='/contribution' class='block hover:text-primary transition-colors' onClick={toggleMenu}>
              Contribution Process
            </A>
            <A href='/philosophy' class='block hover:text-primary transition-colors' onClick={toggleMenu}>
              Philosophy
            </A>
            <A href='/design' class='block hover:text-primary transition-colors' onClick={toggleMenu}>
              Design Maxims
            </A>
          </nav>

          {/* Translation Button */}
          <LocalizationButton />
        </div>
      </div>
    </div>
  )
}

export default NavMenu
