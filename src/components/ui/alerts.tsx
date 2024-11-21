// ~/components/ui/alert.tsx
import { Component, JSX, splitProps } from 'solid-js'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-gray-50 dark:border-gray-800',
        destructive: 'border-red-500/50 text-red-600 dark:text-red-500 [&>svg]:text-red-600 dark:[&>svg]:text-red-500',
        success:
          'border-green-500/50 text-green-600 dark:text-green-500 [&>svg]:text-green-600 dark:[&>svg]:text-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Alert: Component<JSX.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'variant'])
  return <div role='alert' class={cn(alertVariants({ variant: local.variant }), local.class)} {...rest} />
}

const AlertTitle: Component<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class'])
  return <h5 class={cn('mb-1 font-medium leading-none tracking-tight', local.class)} {...rest} />
}

const AlertDescription: Component<JSX.HTMLAttributes<HTMLParagraphElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class'])
  return <div class={cn('text-sm [&_p]:leading-relaxed', local.class)} {...rest} />
}

export { Alert, AlertTitle, AlertDescription }
