import { Component, onMount, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { TextArea } from '~/components/ui/textarea'
import { Card, CardContent } from '~/components/ui/card'
import { siteConfig } from '~/config/site'
import type { JSX } from 'solid-js'
import { SiteCategory } from '~/config/site'
import { useI18n } from '~/contexts/i18n'
import UserButton from '~/components/auth/UserBtn'

// Localized Categories Component
const LocalizedCategories: Component = () => {
  const { locale } = useI18n()

  const getLocalizedCategories = () => {
    return siteConfig.categories.map((category: SiteCategory) => ({
      title: locale() === 'ar' ? category.name : category.slug,
      icon: category.icon,
      description: category.description,
      href: category.href,
    }))
  }

  return (
    <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
      {getLocalizedCategories().map((category) => (
        <Card class='animate-on-scroll hover:shadow-lg transition-all duration-300 hover:-translate-y-2'>
          <A href={category.href}>
            <CardContent class='p-6 text-center'>
              <category.icon class='w-12 h-12 mx-auto mb-4' />
              <h3 class='text-xl font-semibold mb-2'>{category.title}</h3>
            </CardContent>
          </A>
        </Card>
      ))}
    </div>
  )
}

// Main HomePage Component
const HomePage: Component = () => {
  const [isHydrated, setIsHydrated] = createSignal(false)
  let categoriesRef: HTMLElement | undefined
  let storesRef: HTMLElement | undefined
  let contactRef: HTMLElement | undefined
  const { t } = useI18n()

  const hiddenBeforeHydration = (): JSX.CSSProperties => ({
    visibility: isHydrated() ? 'visible' : 'hidden',
    opacity: isHydrated() ? '1' : '0',
    transition: 'opacity 0.3s ease-in',
  })

  const featuredStores = [
    {
      name: t('stores.kitchen'),
      image: '/api/placeholder/400/300',
      description: t('stores.kitchenDesc'),
    },
    {
      name: t('stores.bath'),
      image: '/api/placeholder/400/300',
      description: t('stores.bathDesc'),
    },
    {
      name: t('stores.home'),
      image: '/api/placeholder/400/300',
      description: t('stores.homeDesc'),
    },
  ]

  const scrollToCategories = () => {
    if (categoriesRef) {
      categoriesRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  onMount(() => {
    setIsHydrated(true)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.style.transition = 'all 1s cubic-bezier(0.22, 0.03, 0.26, 1)'
            target.style.transform = 'translateY(0)'
            target.style.opacity = '1'
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      const element = el as HTMLElement
      element.style.transform = 'translateY(40px)'
      element.style.opacity = '0'
      observer.observe(element)
    })

    return () => observer.disconnect()
  })

  return (
    <div class='relative'>
      {/* Hero Section */}
      <div class='min-h-screen relative flex items-center justify-center'>
        <div class='absolute inset-0'>
          <img
            src={siteConfig.images.siteResponsiveImage}
            alt={t('hero.imageAlt')}
            class='w-full h-full object-cover object-center block md:hidden'
            loading='eager'
          />
          <img
            src={siteConfig.images.siteImage}
            alt={t('hero.imageAlt')}
            class='w-full h-full object-cover object-center hidden md:block'
            loading='eager'
            style={hiddenBeforeHydration()}
          />
          <div class='absolute inset-0 bg-black bg-opacity-60' />
        </div>

        <div class='relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4'>
          <h1 class='text-5xl md:text-6xl font-bold text-white'>{t('hero.title')}</h1>
          <p class='text-xl text-white/90'>{t('hero.subtitle')}</p>
          <Button size='lg' variant='pay' onClick={scrollToCategories} class='hover:scale-105 transition-transform'>
            {t('hero.cta')}
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <section ref={categoriesRef} class='py-20 bg-background'>
        <div class='container mx-auto px-4'>
          <h2 class='text-3xl font-bold text-center mb-12 animate-on-scroll'>{t('sections.categories')}</h2>
          <LocalizedCategories />
        </div>
      </section>

      {/* Featured Stores Section */}
      <section ref={storesRef} class='py-20 bg-gray-50'>
        <div class='container mx-auto px-4'>
          <h2 class='text-3xl font-bold text-center mb-12 animate-on-scroll'>{t('sections.featuredStores')}</h2>
          <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {featuredStores.map((store) => (
              <Card class='animate-on-scroll overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2'>
                <img src={store.image} alt={store.name} class='w-full h-48 object-cover' />
                <CardContent class='p-6'>
                  <h3 class='text-xl font-semibold mb-2'>{store.name}</h3>
                  <p class='text-muted-foreground'>{store.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={contactRef} class='py-20 bg-background'>
        <div class='container mx-auto px-4 max-w-2xl'>
          <h2 class='text-3xl font-bold text-center mb-12 animate-on-scroll'>{t('sections.contact')}</h2>
          <Card class='animate-on-scroll'>
            <CardContent class='p-6'>
              <form class='space-y-6'>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('form.name')}</label>
                  <Input placeholder={t('form.namePlaceholder')} />
                </div>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('form.email')}</label>
                  <Input type='email' placeholder={t('form.emailPlaceholder')} />
                </div>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('form.message')}</label>
                  <TextArea placeholder={t('form.messagePlaceholder')} class='min-h-[150px]' />
                </div>
                <Button type='submit' class='w-full'>
                  {t('form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      {/* <footer class='bg-gray-900 text-white py-12'>
        <div class='container mx-auto px-4'>
          <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h3 class='text-xl font-bold mb-4'>Souq EL Rafay3</h3>
              <p class='text-gray-400'>{t('footer.tagline')}</p>
            </div>
            <div>
              <h3 class='text-xl font-bold mb-4'>{t('footer.quickLinks')}</h3>
              <ul class='space-y-2'>
                <li>
                  <A href='#categories' class='text-gray-400 hover:text-white transition-colors'>
                    {t('sections.categories')}
                  </A>
                </li>
                <li>
                  <A href='#stores' class='text-gray-400 hover:text-white transition-colors'>
                    {t('sections.featuredStores')}
                  </A>
                </li>
                <li>
                  <A href='#contact' class='text-gray-400 hover:text-white transition-colors'>
                    {t('sections.contact')}
                  </A>
                </li>
              </ul>
            </div>
            <div>
              <h3 class='text-xl font-bold mb-4'>{t('sections.contact')}</h3>
              <p class='text-gray-400'>
                {t('footer.email')}: {siteConfig.contact.support.email}
              </p>
              <p class='text-gray-400'>
                {t('footer.phone')}: {siteConfig.contact.developer.phone}
              </p>
            </div>
          </div>
          <div class='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer> */}
    </div>
  )
}

export default HomePage
