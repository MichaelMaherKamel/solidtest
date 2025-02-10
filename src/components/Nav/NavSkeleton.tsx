import { useLocation } from '@solidjs/router'
import { Component } from 'solid-js'
import { useI18n } from '~/contexts/i18n'

const NavSkeleton: Component = () => {
  const location = useLocation()
  const { locale } = useI18n()
  const isHomePage = location.pathname === '/'
  const isRTL = locale() === 'ar'

  return (
    <nav class='fixed inset-x-0 z-50' dir={isRTL ? 'rtl' : 'ltr'}>
      <div class='w-full md:container md:mx-auto md:!px-0'>
        <div
          class={`transition-all duration-300 md:rounded-lg ${
            isHomePage ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-sm'
          }`}
        >
          <div class='flex h-16 items-center justify-between px-4'>
            {/* Logo skeleton */}
            <div class='flex items-center gap-4'>
              <div class='w-16 h-12 bg-gray-200/50 rounded animate-pulse' />
            </div>

            {/* Search skeleton */}
            <div class='hidden md:flex flex-1 max-w-xl mx-4'>
              <div class='w-full h-10 bg-gray-200/50 rounded-md animate-pulse' />
            </div>

            {/* Actions skeleton */}
            <div class='flex items-center gap-2'>
              {/* Cart Skeleton */}
              <div class='hidden md:block'>
                <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />
              </div>

              {/* Language Selector Skeleton */}
              <div class='hidden md:block'>
                <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />
              </div>

              {/* User Menu Skeleton */}
              <div class='hidden md:block'>
                <div class='w-9 h-9 bg-gray-200/50 rounded-full animate-pulse' />
              </div>

              {/* Square Menu Button Skeleton */}
              <div class='hidden md:block'>
                <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />
              </div>

              {/* Mobile Menu Button Skeleton */}
              <div class='md:hidden'>
                <div class='w-10 h-10 bg-gray-200/50 rounded-md animate-pulse' />
              </div>
            </div>
          </div>

          {/* Mobile Menu Skeleton (in collapsed state) */}
          <div class='md:hidden h-0 overflow-hidden'>
            <div class='px-4 py-4'>
              <div class='space-y-2'>
                <div class='w-full h-10 bg-gray-200/50 rounded-md animate-pulse' />
                <div class='w-full h-10 bg-gray-200/50 rounded-md animate-pulse' />
                <div class='w-full h-10 bg-gray-200/50 rounded-md animate-pulse' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavSkeleton
