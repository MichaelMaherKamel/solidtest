// ~/components/shopping/ProductGrid.tsx
import { Component, For, Show, createSignal, createResource, onMount, onCleanup } from 'solid-js'
import type { ProductCategory } from '~/db/schema'
import { useI18n } from '~/contexts/i18n'
import ProductCard from './ProductCard'
import ProductGridSkeleton from './ProductGridSkeleton'
import { getCategoryProducts } from '~/db/fetchers/products' // Updated import
import { Button } from '~/components/ui/button'

const ITEMS_PER_BATCH = 10

interface ProductGridProps {
  category: ProductCategory
}

const ProductGrid: Component<ProductGridProps> = (props) => {
  const { t, locale } = useI18n()
  // Updated to use getCategoryProducts
  const [products] = createResource(() => props.category, getCategoryProducts)
  const [displayedItems, setDisplayedItems] = createSignal<number>(ITEMS_PER_BATCH)
  const [loadingMore, setLoadingMore] = createSignal(false)
  const [observer, setObserver] = createSignal<IntersectionObserver | null>(null)

  const isRTL = () => locale() === 'ar'

  onMount(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !loadingMore()) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )
    setObserver(obs)
  })

  onCleanup(() => {
    observer()?.disconnect()
  })

  const visibleProducts = () => {
    if (!products()) return []
    return products()!.slice(0, displayedItems())
  }

  const hasMoreItems = () => {
    return products() && displayedItems() < products()!.length
  }

  const loadMore = async () => {
    if (loadingMore() || !hasMoreItems()) return

    setLoadingMore(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setDisplayedItems((prev) => Math.min(products()?.length || 0, prev + ITEMS_PER_BATCH))
    setLoadingMore(false)
  }

  const attachObserver = (el: HTMLButtonElement) => {
    if (observer()) {
      observer()!.observe(el)
    }
  }

  return (
    <Show when={!products.loading} fallback={<ProductGridSkeleton />}>
      <div class='space-y-6' dir={isRTL() ? 'rtl' : 'ltr'}>
        <Show
          when={products() && products()!.length > 0}
          fallback={<div class='col-span-full text-center py-8 text-gray-500'>{t('common.noProductsFound')}</div>}
        >
          <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 auto-rows-auto'>
            <For each={visibleProducts()}>
              {(product) => (
                <ProductCard
                  productId={product.productId}
                  productName={product.productName}
                  price={product.price}
                  productDescription={product.productDescription}
                  category={product.category}
                  colorVariants={product.colorVariants}
                  totalInventory={product.totalInventory}
                  storeId={product.storeId}
                  storeName={product.storeName}
                  storeSubscription={product.storeSubscription}
                />
              )}
            </For>
          </div>

          <Show when={hasMoreItems()}>
            <div class='flex justify-center py-4'>
              <Button
                variant='outline'
                size='lg'
                class={`min-w-[200px] ${isRTL() ? 'font-arabic' : ''}`}
                onClick={loadMore}
                disabled={loadingMore()}
                ref={attachObserver}
              >
                {loadingMore() ? (
                  <div class='flex items-center gap-2'>
                    {isRTL() ? (
                      <>
                        {t('common.loading')}
                        <div class='size-4 border-2 border-current border-r-transparent rounded-full animate-spin' />
                      </>
                    ) : (
                      <>
                        <div class='size-4 border-2 border-current border-r-transparent rounded-full animate-spin' />
                        {t('common.loading')}
                      </>
                    )}
                  </div>
                ) : (
                  t('common.loadMore')
                )}
              </Button>
            </div>
          </Show>
        </Show>
      </div>
    </Show>
  )
}

export default ProductGrid
