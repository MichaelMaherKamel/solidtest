import { ParentComponent } from 'solid-js'
import { useI18n } from '~/contexts/i18n'
import { FiShield } from 'solid-icons/fi'
import CheckoutNav from '~/components/Checkout/CheckoutNav'

const CheckoutLayout: ParentComponent = (props) => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'
  const currentYear = new Date().getFullYear()

  return (
    // Remove min-h-screen from the outer div since we're managing height differently
    <div class='flex flex-col '>
      <CheckoutNav />

      {/* Wrapper for main content that takes into account fixed nav and footer */}
      <div class='pt-16 pb-[3.25rem]'>
        {' '}
        {/* pb-[3.25rem] accounts for footer height */}
        {/* Secure Checkout Header */}
        <div class='bg-white border-b'>
          <div class='container mx-auto px-4 py-3'>
            <div class='flex items-center justify-center gap-2 text-sm text-gray-600'>
              <FiShield class='h-4 w-4 text-green-500' />
              <span>{t('checkout.secureCheckout')}</span>
            </div>
          </div>
        </div>
        <main class='flex-1 container mx-auto px-4 py-6 md:py-8'>
          <div class='max-w-3xl mx-auto' dir={isRTL() ? 'rtl' : 'ltr'}>
            {props.children}
          </div>
        </main>
      </div>

      <footer class='fixed bottom-0 left-0 right-0 bg-gray-100 shadow-md'>
        <div class='container mx-auto px-4 py-3 text-gray-600' dir='ltr'>
          <div class='flex items-center justify-center'>
            <p class='text-base'>{t('footer.copyright', { year: currentYear })}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CheckoutLayout
