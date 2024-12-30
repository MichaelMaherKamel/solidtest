// ~/routes/shopping/(layout).tsx
import { A, useLocation, RouteSectionProps } from '@solidjs/router'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { siteConfig } from '~/config/site'
import { useI18n } from '~/contexts/i18n'
import { createMediaQuery } from '@solid-primitives/media'
import { Suspense, createMemo, lazy } from 'solid-js'
import { AuthProvider } from '~/contexts/auth'
import { Skeleton } from '~/components/ui/skeleton'

// Lazy load components
const Nav = lazy(() => import('~/components/Nav'))
const SiteFooter = lazy(() => import('~/components/Footer'))

// Loading components
const NavSkeleton = () => (
  <div class='h-16 fixed top-0 left-0 right-0 z-50'>
    <Skeleton class='h-full w-full' />
  </div>
)

const FooterSkeleton = () => (
  <div class='h-16'>
    <Skeleton class='h-full w-full' />
  </div>
)

// Categories loading skeleton
const CategoriesTabsSkeleton = () => (
  <div class='w-full bg-background py-2'>
    <div class='container mx-auto px-4'>
      <div class='flex justify-center'>
        <div class='bg-muted rounded-md p-1 flex gap-2'>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton class='h-8 w-24 rounded-sm' />
            ))}
        </div>
      </div>
    </div>
  </div>
)

export default function ShoppingLayout(props: RouteSectionProps) {
  const location = useLocation()
  const { t, locale } = useI18n()
  const isLargeScreen = createMediaQuery('(min-width: 768px)')

  const currentCategory = createMemo(() => {
    const path = location.pathname
    const category = path.split('/').pop()
    return category || siteConfig.categories[0].slug
  })

  return (
    <AuthProvider>
      <div class='min-h-screen flex flex-col relative'>
        <Suspense fallback={<NavSkeleton />}>
          <Nav />
        </Suspense>

        <div class='h-16'></div>

        <Suspense fallback={<CategoriesTabsSkeleton />}>
          <div class='w-full bg-background py-2'>
            <div class='container mx-auto px-4'>
              <div class='w-full flex justify-center'>
                <div
                  class={`inline-flex max-w-fit h-10 p-1 rounded-md bg-muted ${
                    isLargeScreen() ? '' : 'overflow-x-auto'
                  }`}
                >
                  {siteConfig.categories.map((category) => {
                    const isSelected = currentCategory() === category.slug
                    return (
                      <A
                        href={`/shopping/${category.slug}`}
                        class={`inline-flex items-center h-8 px-3 rounded-sm
                                 ${isSelected ? 'bg-background shadow-sm text-primary font-medium' : ''}
                                 hover:bg-background/90`}
                      >
                        <div class='inline-flex items-center gap-2'>
                          <category.icon class='h-5 w-5' />
                          <span>{t(`categories.tabNames.${category.slug}`)}</span>
                        </div>
                      </A>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </Suspense>

        <main class='flex-1 relative' role='main'>
          <div class='container mx-auto px-4 py-6'>
            <Suspense>{props.children}</Suspense>
          </div>
        </main>

        <div class={`${isLargeScreen() ? '' : 'pb-32'}`}>
          <Suspense fallback={<FooterSkeleton />}>
            <SiteFooter />
          </Suspense>
        </div>
      </div>
    </AuthProvider>
  )
}
