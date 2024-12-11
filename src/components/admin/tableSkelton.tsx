import { Component } from 'solid-js'
import { Skeleton } from '../ui/skeleton'

const TableSkeleton: Component = () => {
  return (
    <div class='w-full overflow-x-auto'>
      <div class='min-w-[600px] rounded-md border'>
        {/* Table Header */}
        <div class='border-b py-4 px-3 sm:px-6 grid grid-cols-4'>
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={40} class='hidden sm:block' />
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={40} />
        </div>

        {/* Table Rows */}
        <div class='divide-y'>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div class='py-3 sm:py-4 px-3 sm:px-6 grid grid-cols-4 items-center'>
                {/* Name Cell with avatar and text */}
                <div class='flex items-center gap-2 sm:gap-3'>
                  <Skeleton height={32} width={32} circle class='sm:h-10 sm:w-10' />
                  <div class='space-y-1 sm:space-y-2'>
                    <Skeleton height={16} width={80} radius={4} class='sm:w-[120px]' />
                    <Skeleton height={14} width={100} radius={4} class='hidden sm:block sm:w-[180px]' />
                  </div>
                </div>

                {/* Role Cell */}
                <div class='hidden sm:block'>
                  <Skeleton height={24} width={60} radius={9999} />
                </div>

                {/* Status Cell */}
                <div>
                  <Skeleton height={24} width={60} radius={9999} class='sm:w-[80px]' />
                </div>

                {/* Actions Cell */}
                <div class='flex justify-end'>
                  <Skeleton height={28} width={28} radius={4} class='sm:h-8 sm:w-8' />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default TableSkeleton
