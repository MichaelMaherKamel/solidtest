// ~/pages/(checkout).tsx
import { Component, Suspense } from 'solid-js'
import UnifiedCheckout from '~/components/Checkout/UnifiedCheckout'
import { CheckoutSkeleton } from '~/components/Checkout/CheckoutSkeleton'

const CheckoutPage: Component = () => {
  return (
    <div class='container mx-auto'>
      <div class='max-w-3xl mx-auto'>
        <Suspense fallback={<CheckoutSkeleton />}>
          <UnifiedCheckout />
        </Suspense>
      </div>
    </div>
  )
}

export default CheckoutPage
