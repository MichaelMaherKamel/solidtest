import { Component, Show, Suspense } from 'solid-js'
import { A } from '@solidjs/router'
import { BiRegularHomeAlt } from 'solid-icons/bi'
import { BiRegularMessageRounded } from 'solid-icons/bi'
import { FiShoppingCart } from 'solid-icons/fi'
import { Separator } from '~/components/ui/separator'
import { Dock, DockIcon } from '~/components/Dock'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { createMediaQuery } from '@solid-primitives/media'
import UserButton from './auth/UserBtn'
import { BiRegularSearch } from 'solid-icons/bi'
import { useI18n } from '~/contexts/i18n'
import { LocalizationButton } from './LocalizationButton'

// Mobile navigation component
const MobileNavigation: Component = () => {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <div class='fixed bottom-0 left-0 right-0 z-50'>
      {/* Navigation Dock */}
      <Dock direction='middle' class='bg-white shadow-md'>
        <DockIcon>
          <A href='/' class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}>
            <BiRegularHomeAlt class='w-5 h-5' />
          </A>
        </DockIcon>

        <Separator orientation='vertical' class='h-full' />

        <DockIcon>
          <BiRegularSearch class='w-5 h-5' />
        </DockIcon>

        <DockIcon>
          <A
            href='https://wa.me/201022618610'
            target='_blank'
            class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}
          >
            <BiRegularMessageRounded class='w-5 h-5' />
          </A>
        </DockIcon>

        <DockIcon>
          <button class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}>
            <FiShoppingCart class='w-5 h-5' />
          </button>
        </DockIcon>

        <DockIcon>
          <LocalizationButton iconOnly size='icon' variant='ghost' />
        </DockIcon>

        <Separator orientation='vertical' class='h-full py-2' />

        <DockIcon>
          <Suspense fallback={<div class='w-10 h-10 rounded-full animate-pulse bg-gray-200' />}>
            <UserButton />
          </Suspense>
        </DockIcon>
      </Dock>

      {/* Mobile Footer Info */}
      <div
        class='px-4 h-8 text-gray-600 supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md'
        dir='ltr'
      >
        <div class='flex items-center justify-center h-full text-xs'>
          <span class='truncate'>{t('footer.companyInfo', { year: currentYear })}</span>
          {/* <div class='flex-shrink-0 space-x-4 rtl:space-x-reverse ml-4 rtl:ml-0 rtl:mr-4'>
            <A href='/about' class='font-medium hover:text-gray-900 transition-colors'>
              {t('nav.about')}
            </A>
            <A href='/terms' class='font-medium hover:text-gray-900 transition-colors'>
              {t('footer.terms')}
            </A>
          </div> */}
        </div>
      </div>
    </div>
  )
}

// Desktop footer component
const DesktopFooter: Component = () => {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer class='bg-gray-100 shadow-md'>
      <div class='container mx-auto px-4 py-3 text-gray-600' dir='ltr'>
        <div class='flex items-center justify-center'>
          <div class='flex items-center gap-4'>
            <p class='text-base'>{t('footer.copyright', { year: currentYear })}</p>
          </div>
          {/* <div class='space-x-8 rtl:space-x-reverse'>
            <A href='/about' class='text-base font-medium hover:text-gray-900 transition-colors'>
              {t('nav.about')}
            </A>
            <A href='/terms' class='text-base font-medium hover:text-gray-900 transition-colors'>
              {t('footer.terms')}
            </A>
          </div> */}
        </div>
      </div>
    </footer>
  )
}

// Main SiteFooter component
const SiteFooter: Component = () => {
  const isLargeScreen = createMediaQuery('(min-width: 768px)')

  return (
    <Show when={isLargeScreen()} fallback={<MobileNavigation />}>
      <DesktopFooter />
    </Show>
  )
}

export default SiteFooter
