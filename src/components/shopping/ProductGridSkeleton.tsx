import { Component } from 'solid-js'
import { Skeleton } from '~/components/ui/skeleton'

const ProductGridSkeleton: Component = () => {
  return (
    <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 auto-rows-auto'>
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div class='bg-white rounded-xl shadow-sm'>
            {/* Image skeleton */}
            <div class='relative aspect-[4/3] rounded-t-xl overflow-hidden'>
              <Skeleton class='h-full w-full' />
            </div>

            {/* Content container */}
            <div class='p-2'>
              {/* Product name skeleton */}
              <div class='mb-1.5'>
                <Skeleton class='h-4 w-4/5' />
              </div>

              {/* Price and cart button row */}
              <div class='flex items-center justify-between'>
                <Skeleton class='h-4 w-16' />
                <Skeleton class='h-7 w-7 rounded-md' />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default ProductGridSkeleton
