import { Component } from 'solid-js'
import { useI18n } from '~/contexts/i18n'
import { A } from '@solidjs/router'

const TermsPage: Component = () => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'

  return (
    <div class={`container mx-auto px-4 py-8`} dir={isRTL() ? 'rtl' : 'ltr'}>
      <div class='rounded-2xl bg-card p-6 shadow-lg'>
        <div class='space-y-8'>
          {/* Header */}
          <div>
            <h1
              class={`text-3xl font-bold sm:text-4xl md:text-5xl text-center md:text-start ${
                isRTL() ? 'md:text-right' : 'md:text-left'
              }`}
            >
              {t('terms.title')}
            </h1>
            <p
              class={`text-muted-foreground text-center md:text-start mt-2 ${
                isRTL() ? 'md:text-right' : 'md:text-left'
              }`}
            >
              {t('terms.lastUpdated')}
            </p>
          </div>

          {/* Introduction Section */}
          <div class='border-t pt-8 first:border-t-0 first:pt-0'>
            <h2 class='text-xl font-semibold mb-4'>{t('terms.introduction.title')}</h2>
            <div class='space-y-4'>
              <p class='text-muted-foreground'>{t('terms.introduction.content.0')}</p>
              <p class='text-muted-foreground'>{t('terms.introduction.content.1')}</p>
              <p class='text-muted-foreground'>{t('terms.introduction.content.2')}</p>
            </div>
          </div>

          {/* Purchases Section */}
          <div class='border-t pt-8'>
            <h2 class='text-xl font-semibold mb-4'>{t('terms.purchases.title')}</h2>
            <div class='space-y-4'>
              <p class='text-muted-foreground'>{t('terms.purchases.content.0')}</p>
              <p class='text-muted-foreground'>{t('terms.purchases.content.1')}</p>
            </div>
          </div>

          {/* Returns Section */}
          <div class='border-t pt-8'>
            <h2 class='text-xl font-semibold mb-4'>{t('terms.returns.title')}</h2>
            <div class='space-y-4'>
              <p class='text-muted-foreground'>{t('terms.returns.content.0')}</p>
              <p class='text-muted-foreground'>{t('terms.returns.content.1')}</p>
              <p class='text-muted-foreground'>{t('terms.returns.content.2')}</p>
              <p class='text-muted-foreground'>{t('terms.returns.content.3')}</p>
              <p class='text-muted-foreground'>{t('terms.returns.content.4')}</p>
            </div>
          </div>

          {/* Privacy Section */}
          <div class='border-t pt-8'>
            <h2 class='text-xl font-semibold mb-4'>{t('terms.privacy.title')}</h2>
            <div class='space-y-4'>
              <p class='text-muted-foreground'>{t('terms.privacy.content.0')}</p>
              <p class='text-muted-foreground'>{t('terms.privacy.content.1')}</p>
              <p class='text-muted-foreground'>{t('terms.privacy.content.2')}</p>
              <p class='text-muted-foreground'>{t('terms.privacy.content.3')}</p>
              <p class='text-muted-foreground'>{t('terms.privacy.content.4')}</p>
              <p class='text-muted-foreground'>{t('terms.privacy.content.5')}</p>
            </div>
          </div>

          {/* Changes Section */}
          <div class='border-t pt-8'>
            <h2 class='text-xl font-semibold mb-4'>{t('terms.changes.title')}</h2>
            <div class='space-y-4'>
              <p class='text-muted-foreground'>{t('terms.changes.content.0')}</p>
            </div>
          </div>

          {/* Contact Section */}
          <div class='border-t pt-8'>
            <h2 class='text-xl font-semibold mb-4'>{t('terms.contact.title')}</h2>
            <div class='space-y-4'>
              <p class='text-muted-foreground'>{t('terms.contact.content.0')}</p>
            </div>
          </div>

          {/* Footer */}
          <div class='border-t pt-8 text-center'>
            <p class='text-muted-foreground'>
              Crafted with
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='red' class='w-4 h-4 inline mx-1'>
                <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
              </svg>
              by{' '}
              <A
                href='https://michaelmaher-portfolio.vercel.app/'
                target='_blank'
                rel='noopener noreferrer'
                class='underline hover:text-blue-600'
              >
                Michael
              </A>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
