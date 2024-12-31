// ~/components/shopping/ProductGrid.tsx
import { Component, For, Show, createResource } from 'solid-js'
import { ProductCategory } from '~/db/schema'
import ProductCard from './ProductCard'
import ProductGridSkeleton from './ProductGridSkeleton'
import { getProducts } from '~/db/fetchers/productsApi'

interface ProductGridProps {
  category: ProductCategory
}

const ProductGrid: Component<ProductGridProps> = (props) => {
  const [products] = createResource(() => props.category, getProducts)

  return (
    <Show when={!products.loading} fallback={<ProductGridSkeleton />}>
      <Show
        when={products() && products()!.length > 0}
        fallback={<div class='col-span-full text-center py-8 text-gray-500'>No products found in this category</div>}
      >
        <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 auto-rows-auto'>
          <For each={products()}>{(product) => <ProductCard {...product} />}</For>
        </div>
      </Show>
    </Show>
  )
}

export default ProductGrid
