// ProductNavSkeleton.tsx
import { Component } from 'solid-js'
import { Skeleton } from '~/components/ui/skeleton'

const ProductNavSkeleton: Component = () => {
  return (
    <div class='w-full bg-white/50 backdrop-blur-sm p-2'>
      <div class='container mx-auto flex items-center justify-between'>
        {/* Logo skeleton */}
        <div class='flex items-center gap-4'>
          <Skeleton class='h-8 w-24' />
        </div>

        {/* Right side controls skeleton */}
        <div class='flex items-center gap-4'>
          <Skeleton class='h-8 w-8 rounded-full' /> {/* Cart icon */}
          <Skeleton class='h-8 w-8 rounded-full' /> {/* Menu icon */}
        </div>
      </div>
    </div>
  )
}

export default ProductNavSkeleton
