import { Component, JSX, splitProps } from 'solid-js'

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>

export const Input: Component<InputProps> = (props) => {
  const [local, others] = splitProps(props, ['type', 'class'])

  return (
    <input
      type={local.type ?? 'text'}
      class={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
              ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium 
              placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
              disabled:opacity-50 ${local.class ?? ''}`}
      {...others}
    />
  )
}
