// ~/routes/shopping/products/[productId].tsx
import { Component, Show, createMemo, createSignal } from 'solid-js'
import { useParams, A } from '@solidjs/router'
import { useI18n } from '~/contexts/i18n'
import { Button } from '~/components/ui/button'
import { FiShoppingCart, FiHeart, FiShare2 } from 'solid-icons/fi'
import { getProduct } from '~/db/fetchers/productsApi'
import { createResource } from 'solid-js'
import { createMediaQuery } from '@solid-primitives/media'

const ProductPage: Component = () => {
  const params = useParams<{ productId: string }>()
  const { t, locale } = useI18n()
  const [selectedImage, setSelectedImage] = createSignal(0)
  const isRTL = () => locale() === 'ar'
  const isLargeScreen = createMediaQuery('(min-width: 768px)')
  const [product] = createResource(() => params.productId, getProduct)

  const formattedProductName = createMemo(() => {
    const name = product()?.name || ''
    return !isLargeScreen() ? (name.length > 30 ? name.slice(0, 30) + '...' : name) : name
  })

  const categoryDisplay = createMemo(() => {
    if (!product()?.category) return ''
    return !isLargeScreen()
      ? t(`categories.tabNames.${product()?.category}`) // Short name for mobile
      : t(`categories.${product()?.category}`) // Full name for desktop
  })

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', product()?.id)
  }

  return (
    <Show when={!product.loading} fallback={<ProductSkeleton />}>
      <div class='min-h-[calc(100vh-7rem)]'>
        <div class='bg-white/50 backdrop-blur-sm rounded-lg p-4 lg:p-8'>
          {/* Breadcrumb */}
          <nav class='mb-8' dir={isRTL() ? 'rtl' : 'ltr'}>
            <ol class='flex items-center flex-wrap gap-2 text-sm'>
              <li class='inline-flex items-center'>
                <A href='/' class='text-gray-500 hover:text-gray-700 py-1 px-2 -mx-2 rounded-md transition-colors'>
                  {t('nav.home')}
                </A>
              </li>
              <li class='text-gray-500'>/</li>
              <li class='inline-flex items-center'>
                <A
                  href={`/shopping/${product()?.category}`}
                  class='text-gray-500 hover:text-gray-700 py-1 px-2 -mx-2 rounded-md transition-colors'
                >
                  {categoryDisplay()}
                </A>
              </li>
              <li class='text-gray-500'>/</li>
              <li class='text-gray-900 font-medium line-clamp-1'>{formattedProductName()}</li>
            </ol>
          </nav>

          <div class='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
            {/* Image Gallery */}
            <div class='space-y-4'>
              <div class='aspect-square rounded-lg overflow-hidden bg-gray-100'>
                <img
                  src={product()?.images[selectedImage()]}
                  alt={product()?.name}
                  class='w-full h-full object-cover'
                />
              </div>
              <div class='grid grid-cols-4 gap-4'>
                {product()?.images.map((image, index) => (
                  <button
                    onClick={() => setSelectedImage(index)}
                    class={`aspect-square rounded-md overflow-hidden ${
                      selectedImage() === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img src={image} alt='' class='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div class='space-y-6' dir={isRTL() ? 'rtl' : 'ltr'}>
              <div>
                <h1 class='text-3xl font-bold text-gray-900'>{product()?.name}</h1>
                <p class='mt-4 text-lg text-gray-500'>{product()?.description}</p>
              </div>

              {/* Price and Stock */}
              <div class='space-y-2'>
                <div class='flex items-center gap-4'>
                  <span class='text-3xl font-bold text-gray-900'>${product()?.price.toFixed(2)}</span>
                  <Show when={product()?.discountPercentage}>
                    <span class='text-sm px-2 py-1 bg-red-100 text-red-700 rounded'>
                      {product()?.discountPercentage}% {t('product.discount')}
                    </span>
                  </Show>
                </div>
                <p class='text-sm text-gray-500'>
                  {product()?.stock > 0 ? t('product.inStock', { count: product()?.stock }) : t('product.outOfStock')}
                </p>
              </div>

              {/* Actions */}
              <div class='space-y-4'>
                <div class='grid grid-cols-2 gap-4'>
                  <Button size='lg' variant='pay' onClick={handleAddToCart}>
                    <FiShoppingCart class='h-5 w-5 me-2' />
                    {t('product.addToCart')}
                  </Button>
                  <Button size='lg' variant='outline'>
                    <FiHeart class='h-5 w-5 me-2' fill='red' color='red' />
                    {t('product.addToWishlist')}
                  </Button>
                </div>
                <Button size='lg' variant='general' class='w-full'>
                  <FiShare2 class='h-5 w-5 me-2' />
                  {t('product.share')}
                </Button>
              </div>

              {/* Additional Info */}
              <div class='border-t pt-6 space-y-4'>
                <div class='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span class='text-gray-500'>{t('product.brand')}</span>
                    <p class='font-medium'>{product()?.brand}</p>
                  </div>
                  <div>
                    <span class='text-gray-500'>{t('product.rating')}</span>
                    <p class='font-medium'>{product()?.rating}/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

const ProductSkeleton: Component = () => {
  return (
    <div class='min-h-[calc(100vh-7rem)]'>
      <div class='bg-white/50 backdrop-blur-sm rounded-lg p-4 lg:p-8'>
        <div class='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
          <div class='space-y-4'>
            <div class='aspect-square rounded-lg bg-gray-200 animate-pulse' />
            <div class='grid grid-cols-4 gap-4'>
              {Array(4)
                .fill(0)
                .map(() => (
                  <div class='aspect-square rounded-md bg-gray-200 animate-pulse' />
                ))}
            </div>
          </div>
          <div class='space-y-6'>
            <div class='space-y-4'>
              <div class='h-8 w-3/4 bg-gray-200 rounded animate-pulse' />
              <div class='h-24 w-full bg-gray-200 rounded animate-pulse' />
            </div>
            <div class='space-y-4'>
              <div class='h-12 w-1/3 bg-gray-200 rounded animate-pulse' />
              <div class='h-6 w-1/4 bg-gray-200 rounded animate-pulse' />
            </div>
            <div class='grid grid-cols-2 gap-4'>
              <div class='h-12 bg-gray-200 rounded animate-pulse' />
              <div class='h-12 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
