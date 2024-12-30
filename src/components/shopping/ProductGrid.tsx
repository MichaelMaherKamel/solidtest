// ~/components/shopping/ProductGrid.tsx
import { Component, For, Show, createMemo, Suspense } from 'solid-js'
import { ProductCategory } from '~/db/schema'
import ProductCard from './ProductCard'
import ProductGridSkeleton from './ProductGridSkeleton'
import { products } from './productData'

interface ProductGridProps {
  category: ProductCategory
}

const ProductGrid: Component<ProductGridProps> = (props) => {
  // Filter products by category
  const categoryProducts = createMemo(() => products.filter((product) => product.category === props.category))

  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <Show
        when={categoryProducts().length > 0}
        fallback={<div class='col-span-full text-center py-8 text-gray-500'>No products found in this category</div>}
      >
        <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 auto-rows-auto'>
          <For each={categoryProducts()}>{(product) => <ProductCard {...product} />}</For>
        </div>
      </Show>
    </Suspense>
  )
}

export default ProductGrid
