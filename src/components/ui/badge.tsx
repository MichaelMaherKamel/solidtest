import type { Component, ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '~/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
        success: 'border-success-foreground bg-success text-success-foreground',
        warning: 'border-warning-foreground bg-warning text-warning-foreground',
        error: 'border-error-foreground bg-error text-error-foreground',
        // Subscription-specific variants
        basic: 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200',
        business: 'border-indigo-200 bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
        premium:
          'border-purple-200 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 hover:from-purple-200 hover:to-purple-300',
        // Alternative subscription styles
        basicAlt: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        businessAlt: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
        premiumAlt:
          'border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 hover:from-amber-100 hover:to-amber-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type BadgeProps = ComponentProps<'div'> &
  VariantProps<typeof badgeVariants> & {
    round?: boolean
  }

const Badge: Component<BadgeProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'variant', 'round'])
  return (
    <div
      class={cn(badgeVariants({ variant: local.variant }), local.round && 'rounded-full', local.class)}
      {...others}
    />
  )
}

export type { BadgeProps }
export { Badge, badgeVariants }
