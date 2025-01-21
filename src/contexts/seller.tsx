import { createContext, useContext, ParentComponent, createSignal } from 'solid-js'
import { createResource, type Resource } from 'solid-js'
import { getStoreByUserId } from '~/db/fetchers/stores'
import { getProducts } from '~/db/fetchers/products'
import { useAuth } from '@solid-mediakit/auth/client'
import type { Store, Product } from '~/db/schema'

type AuthUser = {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  role: 'admin' | 'user' | 'seller'
  image: string | null
}

type SellerContextType = {
  user: () => AuthUser | undefined
  store: Resource<Store | null>
  products: Resource<Product[]>
  isLoading: () => boolean
  refreshProducts: () => void
}

const SellerContext = createContext<SellerContextType>()

export const SellerProvider: ParentComponent = (props) => {
  const auth = useAuth()
  const user = () => auth.session()?.user as AuthUser | undefined
  const userId = () => user()?.id

  // Add refresh trigger signal
  const [refreshTrigger, setRefreshTrigger] = createSignal(0)

  // Store resource
  const [store] = createResource(
    userId,
    async (id) => {
      if (!id) return null
      return await getStoreByUserId(id)
    },
    { initialValue: null }
  )

  // Products resource that depends on store and refreshTrigger
  const [products] = createResource(
    () => ({ storeId: store()?.storeId, trigger: refreshTrigger() }),
    async ({ storeId }) => {
      if (!storeId) return []
      return await getProducts(storeId)
    },
    { initialValue: [] }
  )

  // Loading state
  const isLoading = () => store.loading || products.loading

  // Refresh function
  const refreshProducts = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <SellerContext.Provider
      value={{
        user,
        store,
        products,
        isLoading,
        refreshProducts,
      }}
    >
      {props.children}
    </SellerContext.Provider>
  )
}

export const useSellerContext = () => {
  const context = useContext(SellerContext)
  if (!context) throw new Error('useSellerContext must be used within a SellerProvider')
  return context
}
