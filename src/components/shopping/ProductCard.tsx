import { Component, createSignal, For, createEffect } from 'solid-js'
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
  const [availableColors, setAvailableColors] = createSignal<ColorVariant[]>([])
  const { t, locale } = useI18n()

  const addToCart = useAction(addToCartAction)
  const fallbackImage = '/api/placeholder/300/300'

  // Update available colors based on inventory
  createEffect(() => {
    const sortedColors = props.colorVariants.filter((v) => v.inventory > 0).sort((a, b) => b.inventory - a.inventory)
    setAvailableColors(sortedColors)
  })

  // Get first available image
  const getFirstImage = () => {
    return availableColors()[0]?.colorImageUrls?.[0] || props.colorVariants[0]?.colorImageUrls?.[0] || fallbackImage
  }

  // Get all colors with availability status
  const allColors = () =>
    props.colorVariants.map((variant) => ({
      ...variant,
      isAvailable: variant.inventory > 0,
    }))

  // Get colors to display (first 5)
  const displayedColors = () => allColors().slice(0, 5)
  const remainingColors = () => Math.max(0, props.colorVariants.length - 5)

  const getColorTitle = (variant: ColorVariant & { isAvailable: boolean }) => {
    const colorTranslation = t(`product.colors.${variant.color}`)
    return variant.isAvailable
      ? locale() === 'ar'
        ? `متوفر باللون ${colorTranslation}`
        : `Available in ${colorTranslation}`
      : locale() === 'ar'
      ? `غير متوفر باللون ${colorTranslation}`
      : `Out of stock in ${colorTranslation}`
  }

  const handleAddToCart = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAddingToCart() || availableColors().length === 0) return

    setIsAddingToCart(true)
    const firstAvailable = availableColors()[0]

    const formData = new FormData()
    formData.append('productId', props.productId)
    formData.append('selectedColor', firstAvailable.color)
    formData.append('quantity', '1')
    formData.append('name', props.productName)
    formData.append('price', props.price.toString())
    formData.append('image', getFirstImage())
    formData.append('storeId', props.storeId)
    formData.append('storeName', props.storeName)

    try {
      const result = await addToCart(formData)
      if (result.success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 1500)
        // Refresh available colors after successful add
        setAvailableColors((prev) => prev.filter((v) => v.color !== firstAvailable.color || v.inventory > 1))
      } else if (result.error?.includes('Max')) {
        // If color is fully in cart, remove from available colors
        setAvailableColors((prev) => prev.filter((v) => v.color !== firstAvailable.color))
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div class='bg-white rounded-xl shadow-sm transition hover:shadow-md'>
      <A href={`/shopping/products/${props.productId}`} class='block'>
        <div class='relative aspect-[4/3] rounded-t-xl overflow-hidden'>
          <div
            class={`absolute inset-0 bg-gray-100 flex items-center justify-center
                    transition-opacity duration-300 ${imageLoaded() ? 'opacity-0' : 'opacity-100'}`}
          >
            <span class='text-sm text-gray-400'>{props.productName}</span>
          </div>

          <img
            src={getFirstImage()}
            alt={props.productName}
            class={`h-full w-full object-cover transition-opacity duration-300
                   ${imageLoaded() ? 'opacity-100' : 'opacity-0'}`}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            loading='lazy'
          />
        </div>
      </A>

      <div class='p-2 space-y-2'>
        <div class='flex items-center justify-center gap-1 h-4'>
          <For each={displayedColors()}>
            {(variant) => (
              <div
                class={`w-3 h-3 rounded-full border shadow-sm transition-all duration-200 relative
                  ${
                    variant.isAvailable ? 'border-gray-200 opacity-100 hover:scale-110' : 'border-gray-300 opacity-40'
                  }`}
                style={{ 'background-color': variant.color }}
                title={getColorTitle(variant)}
                role='img'
                aria-label={getColorTitle(variant)}
              >
                {!variant.isAvailable && <div class='absolute inset-0 rounded-full bg-gray-200 opacity-50' />}
              </div>
            )}
          </For>
          {remainingColors() > 0 && (
            <span class='text-xs text-gray-500 ml-1'>
              +{remainingColors()} {t('common.more')}
            </span>
          )}
        </div>

        <h3 class='font-medium text-sm text-center line-clamp-1 text-gray-900' title={props.productName}>
          {props.productName}
        </h3>

        <div class='flex items-center justify-between pt-1'>
          <span class='text-sm font-bold text-gray-900'>
            {locale() === 'ar' ? `${props.price.toFixed(2)} جنيه` : `EGP ${props.price.toFixed(2)}`}
          </span>
          <Button
            onClick={handleAddToCart}
            size='sm'
            variant='pay'
            class={`h-7 w-7 p-0 relative z-10 hover:scale-110 transition-transform ${
              availableColors().length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={t('product.addToCart')}
            disabled={isAddingToCart() || availableColors().length === 0}
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
    </div>
  )
}

export default ProductCard
