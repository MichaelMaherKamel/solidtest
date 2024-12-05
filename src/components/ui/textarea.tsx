import { Component, JSX, splitProps } from 'solid-js'

type TextAreaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea: Component<TextAreaProps> = (props) => {
  const [local, others] = splitProps(props, ['class'])

  return (
    <textarea
      class={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
              ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
              disabled:opacity-50 ${local.class ?? ''}`}
      {...others}
    />
  )
}
