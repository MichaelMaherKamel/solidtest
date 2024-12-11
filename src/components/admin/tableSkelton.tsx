import { Component } from 'solid-js'
import { Skeleton } from '../ui/skeleton'

const TableSkeleton: Component = () => {
  return (
    <div class='space-y-4'>
      <div class='flex items-center space-x-4 p-4'>
        <Skeleton class='h-12 w-12 rounded-full' />
        <div class='space-y-2 flex-1'>
          <Skeleton class='h-4 w-[250px]' />
          <Skeleton class='h-4 w-[200px]' />
        </div>
        <Skeleton class='h-8 w-[100px]' />
      </div>
      <div class='flex items-center space-x-4 p-4'>
        <Skeleton class='h-12 w-12 rounded-full' />
        <div class='space-y-2 flex-1'>
          <Skeleton class='h-4 w-[250px]' />
          <Skeleton class='h-4 w-[200px]' />
        </div>
        <Skeleton class='h-8 w-[100px]' />
      </div>
      <div class='flex items-center space-x-4 p-4'>
        <Skeleton class='h-12 w-12 rounded-full' />
        <div class='space-y-2 flex-1'>
          <Skeleton class='h-4 w-[250px]' />
          <Skeleton class='h-4 w-[200px]' />
        </div>
        <Skeleton class='h-8 w-[100px]' />
      </div>
    </div>
  )
}

export default TableSkeleton
