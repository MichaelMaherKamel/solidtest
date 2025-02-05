import { Component, For, Show, createMemo, createSignal } from 'solid-js'
import { useParams, A, useAction } from '@solidjs/router'
import { useI18n } from '~/contexts/i18n'
import { Button } from '~/components/ui/button'
import { BiSolidStore } from 'solid-icons/bi'
import { FiShoppingCart, FiShare2 } from 'solid-icons/fi'
import { getProductById } from '~/db/fetchers/products'
import { addToCartAction } from '~/db/actions/cart'
import { createResource } from 'solid-js'
import { createMediaQuery } from '@solid-primitives/media'
import { showToast } from '~/components/ui/toast'

const ProductPage: Component = () => {
  const params = useParams<{ productId: string }>()
  const { t, locale } = useI18n()
  const [selectedColorIndex, setSelectedColorIndex] = createSignal(0)
  const [selectedImage, setSelectedImage] = createSignal(0)
  const [isAddingToCart, setIsAddingToCart] = createSignal(false)
  const [quantity, setQuantity] = createSignal(1)

  const isRTL = () => locale() === 'ar'
  const isLargeScreen = createMediaQuery('(min-width: 768px)')
  const [product] = createResource(() => params.productId, getProductById)
  const addToCart = useAction(addToCartAction)

  const formattedProductName = createMemo(() => {
    const name = product()?.productName || ''
    return !isLargeScreen() ? (name.length > 30 ? name.slice(0, 30) + '...' : name) : name
  })

  const categoryDisplay = createMemo(() => {
    if (!product()?.category) return ''
    return !isLargeScreen() ? t(`categories.tabNames.${product()?.category}`) : t(`categories.${product()?.category}`)
  })

  const currentColorVariant = createMemo(() => {
    return product()?.colorVariants[selectedColorIndex()]
  })

  const currentImages = createMemo(() => {
    return currentColorVariant()?.colorImageUrls || []
  })

  const availableColors = createMemo(() => {
    return product()?.colorVariants.filter((variant) => variant.inventory > 0) || []
  })

  const isAddToCartDisabled = createMemo(() => {
    const variant = currentColorVariant()
    return isAddingToCart() || !variant || variant.inventory === 0
  })

  const isIncrementDisabled = createMemo(() => {
    const maxInventory = currentColorVariant()?.inventory || 0
    return quantity() >= maxInventory
  })

  const handleColorSelect = (index: number) => {
    setSelectedColorIndex(index)
    setSelectedImage(0)
    setQuantity(1)
  }

  const getColorLabel = (color: string) => {
    return t(`product.colors.${color}`)
  }

  const handleAddToCart = async () => {
    if (isAddingToCart() || !product() || !currentColorVariant()) return

    setIsAddingToCart(true)

    try {
      const formData = new FormData()
      formData.append('productId', product()!.productId)
      formData.append('selectedColor', currentColorVariant()!.color)
      formData.append('quantity', quantity().toString())

      const result = await addToCart(formData)

      if (result.success) {
        if (result.adjusted) {
          // Case where user tried to add more than available
          if (result.added && result.added > 0) {
            showToast({
              title: t('product.addedToCart'),
              description: `${t('product.adjustedCart.line1', {
                max: result.max,
                existing: result.existing,
              })}\n${t('product.adjustedCart.line2', {
                added: result.added,
              })}`,
              variant: 'warning',
            })
          } else {
            showToast({
              title: t('common.error'),
              description: t('product.adjustedCart.line1', {
                max: result.max,
                existing: result.existing,
              }),
              variant: 'destructive',
            })
          }
        } else {
          // Normal success case
          showToast({
            title: t('product.addedToCart'),
            description: t('product.adjustedCart.line2', {
              added: quantity(),
            }),
            variant: 'success',
          })
        }
      } else {
        showToast({
          title: t('common.error'),
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch (e) {
      showToast({
        title: t('common.error'),
        description: t('cart.errorMsg'),
        variant: 'destructive',
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity() + delta
    const maxInventory = currentColorVariant()?.inventory || 0
    if (newQuantity > 0 && newQuantity <= maxInventory) {
      setQuantity(newQuantity)
    }
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
                <Show when={currentImages().length > 0}>
                  <img
                    src={currentImages()[selectedImage()]}
                    alt={product()?.productName}
                    class='w-full h-full object-cover'
                  />
                </Show>
              </div>
              <div class='grid grid-cols-4 gap-4'>
                <For each={currentImages()}>
                  {(image, index) => (
                    <button
                      onClick={() => setSelectedImage(index())}
                      class={`aspect-square rounded-md overflow-hidden ${
                        selectedImage() === index() ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img src={image} alt='' class='w-full h-full object-cover' />
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Product Info */}
            <div class='space-y-6' dir={isRTL() ? 'rtl' : 'ltr'}>
              {/* Product Title and Description */}
              <div class='space-y-4'>
                <h1 class='text-3xl font-bold text-gray-900'>{product()?.productName}</h1>
                <p class='text-lg text-gray-500'>{product()?.productDescription}</p>
                {/* Store Information */}
                <div class='flex items-center gap-2 text-gray-600 pt-2'>
                  <BiSolidStore class='h-5 w-5' />
                  <span>{t('product.store')}:</span>
                  <A
                    href={`/stores/${product()?.storeId}`}
                    class='text-primary hover:text-primary-dark transition-colors'
                  >
                    {product()?.storeName}
                  </A>
                </div>
              </div>

              {/* Price and Stock Info */}
              <div class='space-y-2'>
                <div class='flex items-center gap-4'>
                  <span class='text-3xl font-bold text-gray-900'>
                    {locale() === 'ar' ? `${product()?.price.toFixed(2)} جنيه` : `EGP ${product()?.price.toFixed(2)}`}
                  </span>
                </div>
                <div class='space-y-1'>
                  <p class='text-sm text-gray-500'>
                    {currentColorVariant()?.inventory
                      ? t('product.inStock', { count: currentColorVariant()?.inventory })
                      : t('product.outOfStock')}
                  </p>
                  <p class='text-sm text-gray-500'>
                    {t('product.totalInventory')}: {product()?.totalInventory}
                  </p>
                  <p class='text-sm text-gray-500'>
                    {t('product.category')}: {categoryDisplay()}
                  </p>
                </div>
              </div>

              {/* Color Selection */}
              <Show when={availableColors().length > 0}>
                <div class='space-y-3'>
                  <h3 class='text-sm font-medium text-gray-900'>{t('product.colors.title')}</h3>
                  <div class='flex flex-wrap gap-2'>
                    <For each={product()?.colorVariants}>
                      {(variant, index) => (
                        <button
                          onClick={() => handleColorSelect(index())}
                          disabled={variant.inventory === 0}
                          class={`w-8 h-8 rounded-full flex items-center justify-center ${
                            variant.inventory === 0 ? 'opacity-50 cursor-not-allowed' : ''
                          } ${selectedColorIndex() === index() ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                          title={getColorLabel(variant.color)}
                        >
                          <span
                            class='w-6 h-6 rounded-full border border-gray-200'
                            style={{ 'background-color': variant.color }}
                          />
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              </Show>

              {/* Quantity Controls */}
              <div class='space-y-4'>
                <div class='flex items-center gap-4'>
                  <Button
                    size='lg'
                    class='w-full lg:w-auto'
                    variant='outline'
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity() <= 1}
                  >
                    -
                  </Button>
                  <span class='text-lg font-medium'>{quantity()}</span>
                  <Button
                    size='lg'
                    class='w-full lg:w-auto'
                    variant='outline'
                    onClick={() => handleQuantityChange(1)}
                    disabled={isIncrementDisabled()}
                  >
                    +
                  </Button>
                </div>

                {/* Action Buttons */}
                <div class='space-y-4'>
                  <Button
                    size='lg'
                    variant='pay'
                    class='w-full'
                    onClick={handleAddToCart}
                    disabled={isAddToCartDisabled()}
                  >
                    <Show
                      when={!isAddingToCart()}
                      fallback={
                        <div class='size-5 border-2 border-current border-r-transparent rounded-full animate-spin me-2' />
                      }
                    >
                      <FiShoppingCart class='h-5 w-5 me-2' />
                    </Show>
                    {t('product.addToCart')}
                  </Button>
                  <Button size='lg' variant='general' class='w-full'>
                    <FiShare2 class='h-5 w-5 me-2' />
                    {t('product.share')}
                  </Button>
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
              <div class='h-6 w-1/3 bg-gray-200 rounded animate-pulse' />
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
