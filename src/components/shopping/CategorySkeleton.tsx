// ~/components/shopping/CategorySkeleton.tsx
import { Component } from 'solid-js'
import { Skeleton } from '~/components/ui/skeleton'

const CategorySkeleton: Component = () => {
  return (
    <div class='space-y-4'>
      {/* Category Header Skeleton */}
      <div class='flex items-center justify-between'>
        <div class='flex items-center gap-2'>
          <Skeleton class='h-8 w-48' /> {/* Category title */}
        </div>
        <div class='text-sm'>
          <Skeleton class='h-4 w-24' /> {/* Controls placeholder */}
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2'>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div class='bg-white rounded-xl shadow-sm'>
              <div class='aspect-[4/3] rounded-t-xl overflow-hidden'>
                <Skeleton class='h-full w-full' />
              </div>
              <div class='p-2'>
                <Skeleton class='h-4 w-4/5 mb-1.5' />
                <div class='flex items-center justify-between'>
                  <Skeleton class='h-4 w-16' />
                  <Skeleton class='h-7 w-7 rounded-md' />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CategorySkeleton
