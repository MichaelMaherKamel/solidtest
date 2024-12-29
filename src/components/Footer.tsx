// ~/components/Footer.tsx
import { Component, createSignal, createEffect, Show, Suspense } from 'solid-js'
import { A } from '@solidjs/router'
import { BiRegularHomeAlt } from 'solid-icons/bi'
import { BiRegularMessageRounded } from 'solid-icons/bi'
import { FiShoppingCart } from 'solid-icons/fi'
import { BiRegularSearch } from 'solid-icons/bi'
import { Separator } from '~/components/ui/separator'
import { Dock, DockIcon } from '~/components/Dock'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { createMediaQuery } from '@solid-primitives/media'
import { useI18n } from '~/contexts/i18n'
import { LocalizationButton } from './LocalizationButton'
import { UserButton } from './auth/UserBtn'
import { useAuth } from '@solid-mediakit/auth/client'
import { handleSession } from '~/db/actions/auth'
import type { Session } from '@solid-mediakit/auth'

// Loading skeleton for the footer
const FooterSkeleton = () => (
  <div class='h-16 bg-white/50 backdrop-blur-sm shadow-sm animate-pulse'>
    <div class='h-full flex items-center justify-center'>
      <div class='h-4 w-32 bg-gray-200 rounded' />
    </div>
  </div>
)

// Mobile navigation component
const MobileNavigation: Component = () => {
  const { t, locale } = useI18n()
  const currentYear = new Date().getFullYear()
  const isRTL = () => locale() === 'ar'
  const whatsappNumber = '201022618610'

  return (
    <div class='fixed bottom-0 left-0 right-0 z-50'>
      <Dock direction='middle' class='bg-white shadow-md'>
        <DockIcon>
          <A href='/' class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}>
            <BiRegularHomeAlt class='w-5 h-5' />
          </A>
        </DockIcon>

        <Separator orientation='vertical' class='h-full' />

        <DockIcon>
          <button class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}>
            <BiRegularSearch class='w-5 h-5' />
          </button>
        </DockIcon>

        <DockIcon>
          <A
            href={`https://wa.me/${whatsappNumber}`}
            target='_blank'
            rel='noopener noreferrer'
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
          <UserButton buttonColorClass='text-gray-800 hover:text-gray-900' />
        </DockIcon>
      </Dock>

      <div class='px-4 h-8 text-gray-600 supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md'>
        <div class='flex items-center justify-center h-full text-xs'>
          <span class='truncate'>{t('footer.companyInfo', { year: currentYear })}</span>
        </div>
      </div>
    </div>
  )
}

// Desktop footer component
const DesktopFooter: Component = () => {
  const { t, locale } = useI18n()
  const currentYear = new Date().getFullYear()
  const isRTL = () => locale() === 'ar'

  return (
    <footer class='bg-gray-100 shadow-md'>
      <div class='container mx-auto px-4 py-3 text-gray-600'>
        <div class='flex items-center justify-center'>
          <div class='flex items-center gap-4'>
            <p class='text-base'>{t('footer.copyright', { year: currentYear })}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Footer content component
const FooterContent: Component = () => {
  const isLargeScreen = createMediaQuery('(min-width: 768px)')
  const { locale } = useI18n()
  const auth = useAuth()

  // Handle session
  createEffect(() => {
    const session = auth.session()
    if (session) {
      handleSession(session)
    }
  })

  return (
    <div dir={locale() === 'ar' ? 'rtl' : 'ltr'}>
      <Show when={isLargeScreen()} fallback={<MobileNavigation />}>
        <DesktopFooter />
      </Show>
    </div>
  )
}

// Main SiteFooter component with Suspense
const SiteFooter: Component = () => {
  return (
    <Suspense fallback={<FooterSkeleton />}>
      <FooterContent />
    </Suspense>
  )
}

export default SiteFooter
