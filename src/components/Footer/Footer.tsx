import { Component, Show, Suspense, createSignal, onMount, onCleanup, createEffect } from 'solid-js'
import { A } from '@solidjs/router'
import { BiRegularHomeAlt, BiRegularMessageRounded, BiRegularSearch } from 'solid-icons/bi'
import { Separator } from '~/components/ui/separator'
import { Dock, DockIcon } from '~/components/Dock'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { createMediaQuery } from '@solid-primitives/media'
import { UserButton } from '../auth/UserBtn'
import { LocalizationButton } from '../LocalizationButton'
import { useI18n } from '~/contexts/i18n'
import CartSheet from './CartSheet'
import SearchSheet from '../SearchSheet'

const MobileNavigation: Component = () => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'
  const currentYear = new Date().getFullYear()
  const [isUserOpen, setIsUserOpen] = createSignal(false)
  const [userRef, setUserRef] = createSignal<HTMLDivElement | undefined>()

  // ADDED: Click Outside and Escape handler
  createEffect(() => {
    if (!isUserOpen()) return

    const handleClickOutside = (e: MouseEvent) => {
      const clickedEl = e.target as Node
      const user = userRef()
      if (user && !user.contains(clickedEl) && isUserOpen()) {
        setIsUserOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside) // Changed to mousedown
    document.addEventListener('keydown', handleEscape)

    onCleanup(() => {
      document.removeEventListener('mousedown', handleClickOutside) // Changed to mousedown
      document.removeEventListener('keydown', handleEscape)
    })
  })

  // NEW Function to close the user component on click button on the icon
  const toggleUserOpen = () => {
    setIsUserOpen((prev) => !prev)
  }

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
          {/* <BiRegularSearch class='w-5 h-5' /> */}
          <SearchSheet />
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
          <CartSheet />
        </DockIcon>
        <DockIcon>
          <LocalizationButton iconOnly size='icon' variant='ghost' />
        </DockIcon>
        <Separator orientation='vertical' class='h-full py-2' />
        <DockIcon>
          <Suspense fallback={<div class='w-10 h-10 rounded-full animate-pulse bg-gray-200' />}>
            <UserButton
              forFooter
              buttonColorClass='text-gray-800 hover:text-gray-900'
              setIsUserOpen={toggleUserOpen} // here update setIsUserOpen to toggleUserOpen function.
              setref={setUserRef}
              isUserOpen={isUserOpen()}
            />
          </Suspense>
        </DockIcon>
      </Dock>
      <div
        class='px-4 h-8 text-gray-600 supports-backdrop-blur:bg-white/10 backdrop-blur-md'
        dir={isRTL() ? 'ltr' : 'rtl'}
      >
        <div class='flex items-center justify-center h-full text-xs gap-4'>
          <A href='/about' class='hover:text-gray-900'>
            {t('footer.about')}
          </A>
          <span>•</span>
          <A href='/terms' class='hover:text-gray-900'>
            {t('footer.terms')}
          </A>
          <span>•</span>
          <span class='truncate'>{t('footer.companyInfo', { year: currentYear })}</span>
        </div>
      </div>
    </div>
  )
}

const DesktopFooter: Component = () => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'
  const currentYear = new Date().getFullYear()

  return (
    <footer class='bg-gray-100 shadow-md'>
      <div class='container mx-auto px-4 py-3 text-gray-600' dir={isRTL() ? 'ltr' : 'rtl'}>
        <div class='flex items-center justify-center'>
          <div class='flex items-center gap-4'>
            <A href='/about' class='hover:text-gray-900'>
              {t('footer.about')}
            </A>
            <span>•</span>
            <A href='/terms' class='hover:text-gray-900'>
              {t('footer.terms')}
            </A>
            <span>•</span>
            <p class='text-base'>{t('footer.copyright', { year: currentYear })}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

const SiteFooter: Component = () => {
  const isLargeScreen = createMediaQuery('(min-width: 768px)')

  return (
    <Show when={isLargeScreen()} fallback={<MobileNavigation />}>
      <DesktopFooter />
    </Show>
  )
}

export default SiteFooter
