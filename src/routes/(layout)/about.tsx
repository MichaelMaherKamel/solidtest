import { Component } from 'solid-js'
import { useI18n } from '~/contexts/i18n'

const AboutPage: Component = () => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'

  return (
    <div class='container mx-auto px-4 py-12 max-w-7xl' dir={isRTL() ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div class='text-center mb-16'>
        <h1 class='text-4xl font-bold tracking-tight mb-4'>{t('about.title')}</h1>
        <p class='text-lg text-muted-foreground max-w-3xl mx-auto'>{t('about.subtitle')}</p>
      </div>

      {/* History Section */}
      <div class={`flex flex-col md:flex-row gap-12 mb-16 ${isRTL() ? 'md:flex-row-reverse' : ''}`}>
        <div class='flex-1'>
          <div class='relative h-[400px] w-full'>
            <img
              src='https://tveclffztmubyxyjxart.supabase.co/storage/v1/object/public/SouqElRafay3Bucket//MarketPlace.webp'
              alt='Marketplace History'
              class='rounded-lg object-cover w-full h-full'
            />
          </div>
        </div>
        <div class='flex-1 flex flex-col justify-center'>
          <h2 class={`text-2xl font-bold mb-6 ${isRTL() ? 'text-right' : 'text-left'}`}>{t('about.history.title')}</h2>
          <div class={`prose max-w-none text-muted-foreground ${isRTL() ? 'text-right' : 'text-left'}`}>
            <p>{t('about.history.content.0')}</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div class={`flex flex-col md:flex-row gap-12 ${isRTL() ? 'md:flex-row-reverse' : ''}`}>
        <div class='flex-1 flex flex-col justify-center'>
          <h2 class={`text-2xl font-bold mb-6 ${isRTL() ? 'text-right' : 'text-left'}`}>{t('about.mission.title')}</h2>
          <div class={`prose max-w-none text-muted-foreground space-y-4 ${isRTL() ? 'text-right' : 'text-left'}`}>
            <p>{t('about.mission.content.0')}</p>
            <p>{t('about.mission.content.1')}</p>
          </div>
        </div>
        <div class='flex-1'>
          <div class='relative h-[400px] w-full'>
            <img
              src='https://tveclffztmubyxyjxart.supabase.co/storage/v1/object/public/SouqElRafay3Bucket//Mission.webp'
              alt='Our Mission'
              class='rounded-lg object-cover w-full h-full'
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div class='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
        <div class='p-8 border rounded-lg text-center'>
          <div class='text-4xl font-bold mb-2 text-primary'>2024</div>
          <div class='text-muted-foreground'>Founded</div>
        </div>
        <div class='p-8 border rounded-lg text-center'>
          <div class='text-4xl font-bold mb-2 text-primary'>1000+</div>
          <div class='text-muted-foreground'>Active Artisans</div>
        </div>
        <div class='p-8 border rounded-lg text-center'>
          <div class='text-4xl font-bold mb-2 text-primary'>50K+</div>
          <div class='text-muted-foreground'>Happy Customers</div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
