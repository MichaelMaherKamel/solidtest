// ~/components/shopping/ProductCard.tsx
import { Component, createSignal } from 'solid-js'
import { A, useAction } from '@solidjs/router'
import { FiShoppingCart } from 'solid-icons/fi'
import { Button } from '~/components/ui/button'
import { ProductCategory } from '~/db/schema'
import { addToCartAction } from '~/db/actions/cart'
import { BsCheck } from 'solid-icons/bs'

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: ProductCategory
  images?: string[]
}

const ProductCard: Component<ProductCardProps> = (props) => {
  const [imageError, setImageError] = createSignal(false)
  const [imageLoaded, setImageLoaded] = createSignal(false)
  const [isAddingToCart, setIsAddingToCart] = createSignal(false)
  const [showSuccess, setShowSuccess] = createSignal(false)

  // Use SolidJS action hooks
  const addToCart = useAction(addToCartAction)

  const fallbackImage = '/api/placeholder/300/300'
  const imageUrl = () => (imageError() ? fallbackImage : props.image || fallbackImage)

  const handleAddToCart = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAddingToCart()) return

    setIsAddingToCart(true)

    const formData = new FormData()
    const productData = {
      productId: props.id.toString(),
      name: props.name,
      price: props.price,
      image: imageUrl(),
    }
    formData.append('product', JSON.stringify(productData))

    try {
      const result = await addToCart(formData)
      if (result.success) {
        setShowSuccess(true)
        // Reset success state after a delay
        setTimeout(() => {
          setShowSuccess(false)
        }, 1500)
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <A href={`/shopping/products/${props.id}`} class='bg-white rounded-xl shadow-sm block transition hover:shadow-md'>
      {/* Image container with fixed aspect ratio */}
      <div class='relative aspect-[4/3] rounded-t-xl overflow-hidden'>
        <div
          class={`absolute inset-0 bg-gray-100 flex items-center justify-center
                    transition-opacity duration-300 ${imageLoaded() ? 'opacity-0' : 'opacity-100'}`}
        >
          <span class='text-sm text-gray-400'>{props.name}</span>
        </div>

        <img
          src={imageUrl()}
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
        <h3 class='font-medium text-sm mb-1.5 line-clamp-1 text-gray-900' title={props.name}>
          {props.name}
        </h3>
        <div class='flex items-center justify-between'>
          <span class='text-sm font-bold text-gray-900'>${props.price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            size='sm'
            variant='pay'
            class='h-7 w-7 p-0 relative z-10 hover:scale-110 transition-transform'
            aria-label='Add to cart'
            disabled={isAddingToCart()}
          >
            {isAddingToCart() ? (
              <div class='size-4 border-2 border-current border-r-transparent rounded-full animate-spin' />
            ) : showSuccess() ? (
              <BsCheck class='w-4 h-4' />
            ) : (
              <FiShoppingCart class='w-4 h-4' />
            )}
          </Button>
        </div>
      </div>
    </A>
  )
}

export default ProductCard
