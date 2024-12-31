// ~/contexts/shopping.tsx
import { createContext, useContext, ParentComponent } from 'solid-js'
import { createResource, type Resource } from 'solid-js'
import type { ProductCategory } from '~/db/schema'
import type { Product } from '~/components/shopping/productData'
import { getProductsDataByCategory } from '~/db/fetchers/products'

type CategoryResources = {
  [K in ProductCategory]?: Resource<Product[]>
}

type ShoppingContextType = {
  getCategoryProducts: (category: ProductCategory) => Resource<Product[]>
}

const ShoppingContext = createContext<ShoppingContextType>()

export const ShoppingProvider: ParentComponent = (props) => {
  // Cache resources by category
  const categoryResources: CategoryResources = {}

  // Get or create resource for category
  const getCategoryProducts = (category: ProductCategory) => {
    if (!categoryResources[category]) {
      const [products] = createResource(async () => {
        return await getProductsDataByCategory(category)
      })
      categoryResources[category] = products
    }
    return categoryResources[category]!
  }

  return (
    <ShoppingContext.Provider
      value={{
        getCategoryProducts,
      }}
    >
      {props.children}
    </ShoppingContext.Provider>
  )
}

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext)
  if (!context) {
    throw new Error('useShoppingContext must be used within a ShoppingProvider')
  }
  return context
}
