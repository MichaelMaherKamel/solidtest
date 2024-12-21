import { ParentComponent, Component, JSX } from 'solid-js'
import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils'

// Types
type DockProps = {
  class?: string
  direction?: 'top' | 'middle' | 'bottom'
  ref?: HTMLDivElement
} & JSX.HTMLAttributes<HTMLDivElement>

type DockIconProps = {
  class?: string
  ref?: HTMLButtonElement
} & JSX.HTMLAttributes<HTMLButtonElement>

// Variants
const dockVariants = cva(
  'mx-auto w-max mt-8 h-[58px] p-2 flex gap-2 rounded-2xl border supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md'
)

// Components
export const Dock: ParentComponent<DockProps> = (props) => {
  const direction = () => props.direction || 'bottom'

  return (
    <div
      {...props}
      class={cn(dockVariants({ class: props.class }), {
        'items-start': direction() === 'top',
        'items-center': direction() === 'middle',
        'items-end': direction() === 'bottom',
      })}
    >
      {props.children}
    </div>
  )
}

export const DockIcon: ParentComponent<DockIconProps> = (props) => {
  return (
    <button
      {...props}
      class={cn('flex aspect-square cursor-pointer items-center justify-center rounded-full w-10 h-10', props.class)}
    >
      {props.children}
    </button>
  )
}

// Export variants for external use
export { dockVariants }
