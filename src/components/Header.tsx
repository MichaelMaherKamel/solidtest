import { Component } from 'solid-js'
import NavMenu from './NavMenu'
import { Button } from './ui/button'

const Header: Component = () => {
  return (
    <header class='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div class='container flex h-14 items-center'>
        <div class='mr-4 flex'>
          <a href='/' class='mr-6 flex items-center space-x-2'>
            <img src='/logo.svg' alt='Logo' class='h-6 w-6' />
            <span class='font-bold'>Your Site</span>
          </a>
        </div>
        <div class='flex flex-1 items-center justify-between space-x-2'>
          <div class='flex-1' />
          <NavMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
