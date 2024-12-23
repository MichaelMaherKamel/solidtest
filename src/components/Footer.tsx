import { Component, Show } from 'solid-js'
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
import type { AuthState } from '~/routes/(layout)'

interface SiteFooterProps {
  authState: AuthState
  onSignOut: () => Promise<void>
}

// Mobile navigation component
const MobileNavigation: Component<SiteFooterProps> = (props) => {
  const { t, locale } = useI18n()
  const currentYear = new Date().getFullYear()
  const isRTL = () => locale() === 'ar'

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
          <UserButton
            buttonColorClass='text-gray-800 hover:text-gray-900'
            authState={props.authState}
            onSignOut={props.onSignOut}
          />
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

// Main SiteFooter component
const SiteFooter: Component<SiteFooterProps> = (props) => {
  const isLargeScreen = createMediaQuery('(min-width: 768px)')
  const { locale } = useI18n()

  return (
    <div dir={locale() === 'ar' ? 'rtl' : 'ltr'}>
      <Show
        when={isLargeScreen()}
        fallback={<MobileNavigation authState={props.authState} onSignOut={props.onSignOut} />}
      >
        <DesktopFooter />
      </Show>
    </div>
  )
}

export default SiteFooter
