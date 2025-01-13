import { useLocation } from '@solidjs/router'
import { Component } from 'solid-js'
import { useI18n } from '~/contexts/i18n'

const ShoppingNavSkeleton: Component = () => {
  const location = useLocation()
  const { locale } = useI18n()
  const isRTL = locale() === 'ar'

  // Check if we should show categories based on the route
  const shouldShowCategories = () => {
    const path = location.pathname
    if (path.match(/^\/shopping\/products\/[^/]+$/)) {
      return false
    }
    return path.startsWith('/shopping')
  }

  return (
    <nav
      class='fixed inset-x-0 z-50'
      style={{ '--nav-height': shouldShowCategories() ? '7rem' : '4rem' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div class='w-full md:container md:mx-auto md:!px-0'>
        <div class='bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-md shadow-sm rounded-sm'>
          {/* Top Navigation Bar */}
          <div class='flex h-16 items-center justify-between px-4 relative z-30'>
            {/* Logo skeleton */}
            <div class='flex items-center gap-4'>
              <div class='w-32 h-8 bg-gray-200/50 rounded animate-pulse' />
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
                <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />
              </div>
            </div>
          </div>

          {/* Categories Bar Skeleton */}
          {shouldShowCategories() && (
            <div class='relative z-10'>
              <div class='w-full overflow-x-auto scrollbar-hide'>
                <div class='flex items-center justify-center min-w-full'>
                  <div class='inline-flex h-12 items-center gap-4 px-4 w-auto'>
                    {/* Category Buttons Skeleton */}
                    <div class='w-24 sm:w-28 md:w-32 h-8 bg-gray-200/50 rounded-md animate-pulse' />
                    <div class='w-24 sm:w-28 md:w-32 h-8 bg-gray-200/50 rounded-md animate-pulse' />
                    <div class='w-24 sm:w-28 md:w-32 h-8 bg-gray-200/50 rounded-md animate-pulse' />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default ShoppingNavSkeleton
