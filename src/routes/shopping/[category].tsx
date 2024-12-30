// ~/routes/shopping/[category].tsx
import { useParams } from '@solidjs/router'
import { Show, type Component, Suspense } from 'solid-js'
import { getCategoryBySlug } from '~/config/site'
import { useI18n } from '~/contexts/i18n'
import ProductGrid from '~/components/shopping/ProductGrid'
import CategorySkeleton from '~/components/shopping/CategorySkeleton'
import { ProductCategory } from '~/db/schema'

// Type guard to validate if a string is a valid ProductCategory
const isValidCategory = (category: string): category is ProductCategory => {
  return ['kitchensupplies', 'bathroomsupplies', 'homesupplies'].includes(category)
}

const ShoppingCategoryPage: Component = () => {
  const params = useParams<{ category: string }>()
  const { t } = useI18n()

  // Get category details from the site config
  const category = () => getCategoryBySlug(params.category)

  // Validate category from URL
  const validCategory = () => {
    if (isValidCategory(params.category)) {
      return params.category
    }
    return 'kitchensupplies' // Default category as fallback
  }

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <Show when={category()} fallback={<div class='text-center text-gray-500'>Category not found</div>}>
        <div class='space-y-4'>
          {/* Category Header */}
          <div class='flex items-center justify-between'>
            <div class='flex items-center gap-2'>
              <h1 class='text-2xl font-semibold'>{t(`categories.${params.category}`)}</h1>
            </div>

            <div class='text-sm text-gray-500'>{/* We can add sorting/filtering controls here later */}</div>
          </div>

          {/* Products Grid */}
          <ProductGrid category={validCategory()} />
        </div>
      </Show>
    </Suspense>
  )
}

export default ShoppingCategoryPage
