import type { JSX, ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import * as ButtonPrimitive from '@kobalte/core/button'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        pay: 'bg-yellow-400 text-black hover:bg-yellow-500',
        general: 'bg-cyan-400 text-black hover:bg-cyan-500',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonProps<T extends ValidComponent = 'button'> = ButtonPrimitive.ButtonRootProps<T> &
  VariantProps<typeof buttonVariants> & {
    class?: string | undefined
    children?: JSX.Element
    asChild?: boolean
  }

const Button = <T extends ValidComponent = 'button'>(props: PolymorphicProps<T, ButtonProps<T>>) => {
  const [local, others] = splitProps(props as ButtonProps, ['variant', 'size', 'class', 'asChild'])

  return (
    <ButtonPrimitive.Root
      class={cn(
        buttonVariants({
          variant: local.variant,
          size: local.size,
        }),
        local.class
      )}
      {...others}
    />
  )
}

export type { ButtonProps }
export { Button, buttonVariants }
