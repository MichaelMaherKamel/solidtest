// ~/components/Checkout/Skeletons/CheckoutStepsSkeleton.tsx
import { Component, For } from 'solid-js'
import { Card } from '~/components/ui/card'

export const CheckoutSkeleton: Component = () => {
  const steps = [
    { id: 'cart', isActive: true },
    { id: 'shipping', isActive: false },
    { id: 'payment', isActive: false },
  ]

  const getItemCount = () => (window.innerWidth < 640 ? 2 : 3)

  return (
    <div class='space-y-3 sm:space-y-4'>
      <For each={steps}>
        {(step, index) => (
          <Card class={`overflow-hidden ${step.isActive ? '' : 'opacity-60'}`}>
            <div class='w-full px-4 py-3 sm:px-6 sm:py-4'>
              <div class='flex items-center gap-2 sm:gap-3'>
                <div class='flex items-center gap-2'>
                  {/* Step number circle */}
                  <div class='w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center'>
                    <div class='w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded-full' />
                  </div>
                  {/* Step title */}
                  <div class='flex flex-col gap-1'>
                    <div class='h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 rounded' />
                  </div>
                </div>
              </div>
            </div>

            {step.isActive && (
              <div class='px-4 pb-4 sm:px-6 sm:pb-6'>
                <div class='bg-white rounded-lg'>
                  <div class='space-y-3 sm:space-y-4'>
                    {/* Generate cart item rows */}
                    {Array(getItemCount())
                      .fill(0)
                      .map(() => (
                        <div class='bg-gray-50 p-3 sm:p-4 rounded-lg'>
                          <div class='flex items-start gap-3 sm:gap-4'>
                            {/* Product image */}
                            <div class='w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md flex-shrink-0' />

                            <div class='flex-1 min-w-0'>
                              {/* Title and remove button row */}
                              <div class='flex items-start justify-between gap-2 mb-2'>
                                <div>
                                  <div class='mb-1'>
                                    <div class='h-4 sm:h-5 w-32 sm:w-40 bg-gray-200 rounded' />
                                  </div>
                                  <div>
                                    <div class='h-3 sm:h-4 w-14 sm:w-16 bg-gray-200 rounded' />
                                  </div>
                                </div>
                                <div>
                                  <div class='h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded-sm' />
                                </div>
                              </div>

                              {/* Quantity and price row */}
                              <div class='flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4'>
                                {/* Quantity controls */}
                                <div class='flex items-center gap-1 sm:gap-2'>
                                  <div class='h-6 w-6 sm:h-7 sm:w-7 bg-gray-200 rounded' />
                                  <div class='h-6 w-6 sm:h-7 sm:w-8 bg-gray-200 rounded' />
                                  <div class='h-6 w-6 sm:h-7 sm:w-7 bg-gray-200 rounded' />
                                </div>
                                {/* Final price */}
                                <div>
                                  <div class='h-3 sm:h-4 w-14 sm:w-16 bg-gray-200 rounded' />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Cart Summary */}
                  <div class='mt-4 sm:mt-6 border-t pt-3 sm:pt-4'>
                    <div class='flex justify-between mb-3 sm:mb-4'>
                      <div>
                        <div class='h-4 sm:h-5 w-16 sm:w-20 bg-gray-200 rounded' />
                      </div>
                      <div>
                        <div class='h-4 sm:h-5 w-20 sm:w-24 bg-gray-200 rounded' />
                      </div>
                    </div>

                    {/* Continue button */}
                    <div class='flex justify-end w-full'>
                      <div class='w-full sm:w-auto'>
                        <div class='h-8 sm:h-10 w-full sm:w-56 bg-gray-200 rounded' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </For>
    </div>
  )
}

export default CheckoutSkeleton
