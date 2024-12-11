import type { ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import * as SkeletonPrimitive from '@kobalte/core/skeleton'
import { cn } from '~/lib/utils'

type SkeletonRootProps<T extends ValidComponent = 'div'> = SkeletonPrimitive.SkeletonRootProps<T> & {
  class?: string | undefined
}

const Skeleton = <T extends ValidComponent = 'div'>(props: PolymorphicProps<T, SkeletonRootProps<T>>) => {
  const [local, others] = splitProps(props as SkeletonRootProps, ['class'])

  return (
    <SkeletonPrimitive.Root
      animate={true} // Explicitly set animate to true
      class={cn(
        'bg-muted animate-pulse rounded-md', // Added rounded-md by default and changed bg color
        local.class
      )}
      {...others}
    />
  )
}

export { Skeleton }
