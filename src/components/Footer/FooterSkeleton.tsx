import { Component } from 'solid-js'
import { createMediaQuery } from '@solid-primitives/media'
import { useI18n } from '~/contexts/i18n'

const MobileNavigationSkeleton: Component = () => {
  const { locale } = useI18n()
  const isRTL = locale() === 'ar'

  return (
    <div class='fixed bottom-0 left-0 right-0 z-50' dir={isRTL ? 'rtl' : 'ltr'}>
      <div class='max-w-[400px] mx-auto px-4'>
        <div class='bg-white shadow-md rounded-full'>
          <div class='flex items-center justify-evenly h-16 px-2'>
            {/* Home Icon */}
            <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />

            {/* Separator */}
            <div class='w-px h-8 bg-gray-200/50' />

            {/* Search Icon */}
            <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />

            {/* Message Icon */}
            <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />

            {/* Cart Icon */}
            <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />

            {/* Language Icon */}
            <div class='w-9 h-9 bg-gray-200/50 rounded-md animate-pulse' />

            {/* Separator */}
            <div class='w-px h-8 bg-gray-200/50' />

            {/* User Icon */}
            <div class='w-9 h-9 bg-gray-200/50 rounded-full animate-pulse' />
          </div>
        </div>
      </div>

      <div class='px-4 h-8 text-center'>
        <div class='flex items-center justify-center h-full'>
          <div class='w-36 h-3 bg-gray-200/50 rounded animate-pulse' />
        </div>
      </div>
    </div>
  )
}

const DesktopFooterSkeleton: Component = () => {
  return (
    <footer class='bg-gray-100 shadow-md'>
      <div class='max-w-screen-2xl mx-auto px-4 py-3'>
        <div class='flex items-center justify-center'>
          <div class='w-64 h-5 bg-gray-200/50 rounded animate-pulse' />
        </div>
      </div>
    </footer>
  )
}

const FooterSkeleton: Component = () => {
  const isLargeScreen = createMediaQuery('(min-width: 768px)')

  return <>{isLargeScreen() ? <DesktopFooterSkeleton /> : <MobileNavigationSkeleton />}</>
}

export default FooterSkeleton
