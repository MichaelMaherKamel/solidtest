// ~/components/ProductCard.tsx
import { Component } from 'solid-js'
import { ProductWithFirstColor } from '~/db/schema/types'

export const ProductCard: Component<ProductWithFirstColor> = (props) => {
  return (
    <div class='group relative bg-white border rounded-lg shadow-sm overflow-hidden'>
      {props.firstColor?.imageUrl && (
        <div class='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200'>
          <img
            src={props.firstColor.imageUrl}
            alt={props.productName}
            class='h-full w-full object-cover object-center group-hover:opacity-75'
          />
        </div>
      )}
      <div class='p-4'>
        <h3 class='text-sm font-medium text-gray-900'>{props.productName}</h3>
        <p class='mt-1 text-sm text-gray-500'>{props.productDescription}</p>
        <p class='mt-2 text-sm font-medium text-gray-900'>${props.price.toFixed(2)}</p>
        {props.firstColor && (
          <div class='mt-2'>
            <span class='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100'>
              {props.firstColor.color}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
