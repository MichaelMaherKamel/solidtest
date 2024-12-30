import { Component, createSignal } from 'solid-js'
import { FiShoppingCart } from 'solid-icons/fi'
import { Button } from '~/components/ui/button'
import { ProductCategory } from '~/db/schema'

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: ProductCategory
}

const ProductCard: Component<ProductCardProps> = (props) => {
  const [imageError, setImageError] = createSignal(false)
  const [imageLoaded, setImageLoaded] = createSignal(false)

  return (
    <div class='bg-white rounded-xl shadow-sm'>
      {/* Image container with fixed aspect ratio */}
      <div class='relative aspect-[4/3] rounded-t-xl overflow-hidden'>
        <div
          class={`absolute inset-0 bg-gray-100 flex items-center justify-center
                    transition-opacity duration-300 ${imageLoaded() ? 'opacity-0' : 'opacity-100'}`}
        >
          <span class='text-sm text-gray-400'>{props.name}</span>
        </div>

        <img
          src={imageError() ? '/api/placeholder/300/300' : props.image || '/api/placeholder/300/300'}
          alt={props.name}
          class={`h-full w-full object-cover transition-opacity duration-300 
                 ${imageLoaded() ? 'opacity-100' : 'opacity-0'}`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          loading='lazy'
        />
      </div>

      {/* Content container */}
      <div class='p-2'>
        <h3 class='font-medium text-sm mb-1.5 line-clamp-1'>{props.name}</h3>
        <div class='flex items-center justify-between'>
          <span class='text-sm font-bold'>${props.price.toFixed(2)}</span>
          <Button size='sm' variant='pay' class='h-7 w-7 p-0' aria-label='Add to cart'>
            <FiShoppingCart class='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
