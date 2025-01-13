
import { useParams } from '@solidjs/router'
import { Show, type Component } from 'solid-js'
import { getCategoryBySlug } from '~/config/site'
import { useI18n } from '~/contexts/i18n'
import ProductGrid from '~/components/shopping/ProductGrid'
import CategorySkeleton from '~/components/shopping/CategorySkeleton'
import { ProductCategory } from '~/db/schema'

const isValidCategory = (category: string): category is ProductCategory => {
  return ['kitchensupplies', 'bathroomsupplies', 'homesupplies'].includes(category)
}

const ShoppingCategoryPage: Component = () => {
  const params = useParams<{ category: string }>()
  const { t } = useI18n()

  const category = () => getCategoryBySlug(params.category)

  const validCategory = () => {
    if (isValidCategory(params.category)) {
      return params.category
    }
    return 'kitchensupplies'
  }

  return (
    <Show when={category()} fallback={<CategorySkeleton />}>
      <div class='min-h-[calc(100vh-7rem)] space-y-6'>
        {/* Category Header */}
        <div class='flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-lg p-4'>
          <div class='flex items-center gap-4'>
            <h1 class='text-2xl font-semibold'>{t(`categories.${params.category}`)}</h1>
          </div>

          <div class='flex items-center gap-4'>
            {/* Add your sorting/filtering controls here */}
            <div class='text-sm text-gray-500'>{/* Placeholder for controls */}</div>
          </div>
        </div>

        {/* Products Grid */}
        <div class='bg-white/50 backdrop-blur-sm rounded-lg p-4'>
          <ProductGrid category={validCategory()} />
        </div>
      </div>
    </Show>
  )
}

export default ShoppingCategoryPage
