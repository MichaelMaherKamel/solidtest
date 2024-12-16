import { Component } from 'solid-js'
import { Skeleton } from '../ui/skeleton'

const TableSkeleton: Component = () => {
  return (
    <div class='w-full overflow-x-auto'>
      <div class='min-w-[900px] rounded-md border'>
        {/* Table Header */}
        <div class='border-b p-4 grid grid-cols-6 gap-4 items-center'>
          <Skeleton height={20} width={100} />
          <Skeleton height={20} width={120} />
          <Skeleton height={20} width={80} />
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={100} />
          <div class='flex justify-end'>
            <Skeleton height={20} width={60} />
          </div>
        </div>

        {/* Table Rows */}
        <div class='divide-y'>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div class='p-4 grid grid-cols-6 gap-4 items-center'>
                <div class='flex items-center space-x-3'>
                  <div>
                    <Skeleton class='h-12 w-12 rounded' />
                  </div>
                  <div class='flex items-center gap-2'>
                    <Skeleton height={50} width={50} />
                    <Skeleton height={16} width={80} />
                  </div>
                </div>

                {/* Description Cell */}
                <div class='space-y-2'>
                  <Skeleton height={16} width={200} />
                </div>

                {/* Category Cell */}
                <div>
                  <Skeleton height={24} width={80} radius={9999} />
                </div>

                {/* Price Cell */}
                <div>
                  <Skeleton height={16} width={60} />
                </div>

                {/* Inventory Cell */}
                <div class='space-y-2'>
                  <Skeleton height={16} width={80} />
                  <div class='flex gap-1 flex-wrap'>
                    <Skeleton height={20} width={60} radius={9999} />
                    <Skeleton height={20} width={70} radius={9999} />
                    <Skeleton height={20} width={65} radius={9999} />
                  </div>
                </div>

                {/* Actions Cell */}
                <div class='flex items-center justify-end gap-2'>
                  <Skeleton height={32} width={32} radius={6} />
                  <Skeleton height={32} width={32} radius={6} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default TableSkeleton
