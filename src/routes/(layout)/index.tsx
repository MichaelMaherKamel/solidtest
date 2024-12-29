// ~/routes/index.tsx
import { Component } from 'solid-js'
import { A } from '@solidjs/router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { TextArea } from '~/components/ui/textarea'
import { Card, CardContent } from '~/components/ui/card'
import { siteConfig } from '~/config/site'
import { SiteCategory } from '~/config/site'
import { useI18n } from '~/contexts/i18n'

// LocalizedCategories Component
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
        <Card class='hover:shadow-lg transition-all duration-300 hover:-translate-y-2'>
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
  const { t } = useI18n()

  // Featured Stores Data
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

  return (
    <div class='relative'>
      {/* Hero Section */}
      <div class='min-h-screen relative flex items-center justify-center'>
        <div class='absolute inset-0'>
          <img
            src={siteConfig.images.siteResponsiveImage}
            alt={t('hero.imageAlt')}
            class='w-full h-full object-cover object-center block md:hidden'
          />
          <img
            src={siteConfig.images.siteImage}
            alt={t('hero.imageAlt')}
            class='w-full h-full object-cover object-center hidden md:block'
          />
          <div class='absolute inset-0 bg-black bg-opacity-60' />
        </div>

        <div class='relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4'>
          <h1 class='text-5xl md:text-6xl font-bold text-white'>{t('hero.title')}</h1>
          <p class='text-xl text-white/90'>{t('hero.subtitle')}</p>
          <Button size='lg' variant='pay' class='hover:scale-105 transition-transform'>
            {t('hero.cta')}
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <section class='py-20 bg-background'>
        <div class='container mx-auto px-4'>
          <h2 class='text-3xl font-bold text-center mb-12'>{t('sections.categories')}</h2>
          <LocalizedCategories />
        </div>
      </section>

      {/* Featured Stores Section */}
      <section class='py-20 bg-gray-50'>
        <div class='container mx-auto px-4'>
          <h2 class='text-3xl font-bold text-center mb-12'>{t('sections.featuredStores')}</h2>
          <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {featuredStores.map((store) => (
              <Card class='overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2'>
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
      <section class='py-20 bg-background'>
        <div class='container mx-auto px-4 max-w-2xl'>
          <h2 class='text-3xl font-bold text-center mb-12'>{t('sections.contact')}</h2>
          <Card>
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
    </div>
  )
}

export default HomePage
