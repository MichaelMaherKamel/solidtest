import { Component } from 'solid-js'

const ProductCardSkeleton: Component = () => {
  return (
    <div class='bg-white rounded-xl shadow-sm w-full'>
      {/* Image skeleton */}
      <div class='relative aspect-[4/3] overflow-hidden rounded-t-xl'>
        <div class='absolute inset-0 bg-gray-200 animate-pulse' />
      </div>

      <div class='p-2'>
        {/* Title skeleton */}
        <div class='h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-1.5' />

        <div class='pt-2 flex items-center justify-between'>
          {/* Price skeleton */}
          <div class='h-4 w-1/4 bg-gray-200 rounded animate-pulse' />
          {/* Add to cart button skeleton */}
          <div class='h-7 w-7 bg-gray-200 rounded animate-pulse' />
        </div>
      </div>
    </div>
  )
}

// Updated ProductGridSkeleton to use the new ProductCardSkeleton
const ProductGridSkeleton: Component = () => {
  return (
    <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 auto-rows-auto'>
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <ProductCardSkeleton />
        ))}
    </div>
  )
}

export default ProductGridSkeleton
