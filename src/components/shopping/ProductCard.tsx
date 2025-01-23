import { Component, createSignal, For } from 'solid-js'
import { A, useAction } from '@solidjs/router'
import { FiShoppingCart } from 'solid-icons/fi'
import { Button } from '~/components/ui/button'
import type { ProductCategory, ColorVariant, StoreSubscription } from '~/db/schema'
import { addToCartAction } from '~/db/actions/cart'
import { BsCheck } from 'solid-icons/bs'
import { useI18n } from '~/contexts/i18n'

interface ProductCardProps {
  productId: string
  productName: string
  price: number
  productDescription: string
  category: ProductCategory
  colorVariants: ColorVariant[]
  totalInventory: number
  storeId: string
  storeName: string
  storeSubscription: StoreSubscription | null
}

const ProductCard: Component<ProductCardProps> = (props) => {
  const [imageError, setImageError] = createSignal(false)
  const [imageLoaded, setImageLoaded] = createSignal(false)
  const [isAddingToCart, setIsAddingToCart] = createSignal(false)
  const [showSuccess, setShowSuccess] = createSignal(false)
  const { t, locale } = useI18n()

  const addToCart = useAction(addToCartAction)

  const fallbackImage = '/api/placeholder/300/300'

  const getFirstImage = () => {
    if (
      props.colorVariants &&
      props.colorVariants.length > 0 &&
      props.colorVariants[0].colorImageUrls &&
      props.colorVariants[0].colorImageUrls.length > 0
    ) {
      return props.colorVariants[0].colorImageUrls[0]
    }
    return fallbackImage
  }

  const imageUrl = () => (imageError() ? fallbackImage : getFirstImage())

  const availableColors = () => props.colorVariants.filter((variant) => variant.inventory > 0)

  const displayedColors = () => availableColors().slice(0, 5)

  const remainingColors = () => Math.max(0, availableColors().length - 5)

  // Get available text for a color
  const getAvailableText = (colorName: string) => {
    const colorTranslation = t(`product.colors.${colorName}`)
    return locale() === 'ar' ? `متوفر باللون ${colorTranslation}` : `Available in ${colorTranslation}`
  }

  const handleAddToCart = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAddingToCart()) return

    setIsAddingToCart(true)

    const formData = new FormData()
    const productData = {
      productId: props.productId,
      name: props.productName,
      price: props.price,
      image: imageUrl(),
      storeId: props.storeId,
      storeName: props.storeName, 
      selectedColor: availableColors()[0].color, 
    }
    formData.append('product', JSON.stringify(productData))
    formData.append('selectedColor', productData.selectedColor) 

    try {
      const result = await addToCart(formData)
      if (result.success) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
        }, 1500)
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <A
      href={`/shopping/products/${props.productId}`}
      class='bg-white rounded-xl shadow-sm block transition hover:shadow-md'
    >
      {/* Image container */}
      <div class='relative aspect-[4/3] rounded-t-xl overflow-hidden'>
        <div
          class={`absolute inset-0 bg-gray-100 flex items-center justify-center
                    transition-opacity duration-300 ${imageLoaded() ? 'opacity-0' : 'opacity-100'}`}
        >
          <span class='text-sm text-gray-400'>{props.productName}</span>
        </div>

        <img
          src={imageUrl()}
          alt={props.productName}
          class={`h-full w-full object-cover transition-opacity duration-300
                 ${imageLoaded() ? 'opacity-100' : 'opacity-0'}`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          loading='lazy'
        />
      </div>

      {/* Content container */}
      <div class='p-2 space-y-2'>
        {/* Color variants - Centered */}
        <div class='flex items-center justify-center gap-1 h-4'>
          <For each={displayedColors()}>
            {(variant) => (
              <div
                class='w-3 h-3 rounded-full border border-gray-200 shadow-sm'
                style={{ 'background-color': variant.color }}
                title={getAvailableText(variant.color)}
                role='img'
                aria-label={getAvailableText(variant.color)}
              />
            )}
          </For>
          {remainingColors() > 0 && (
            <span class='text-xs text-gray-500 ml-1'>
              +{remainingColors()} {t('common.more')}
            </span>
          )}
        </div>

        {/* Product name - Centered */}
        <h3 class='font-medium text-sm text-center line-clamp-1 text-gray-900' title={props.productName}>
          {props.productName}
        </h3>

        {/* Price and add to cart */}
        <div class='flex items-center justify-between pt-1'>
          <span class='text-sm font-bold text-gray-900'>
            {locale() === 'ar' ? `${props.price.toFixed(2)} جنيه` : `EGP ${props.price.toFixed(2)}`}
          </span>
          <Button
            onClick={handleAddToCart}
            size='sm'
            variant='pay'
            class='h-7 w-7 p-0 relative z-10 hover:scale-110 transition-transform'
            aria-label={t('product.addToCart')}
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
