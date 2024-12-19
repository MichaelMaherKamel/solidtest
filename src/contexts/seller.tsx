import { createContext, useContext, ParentComponent } from 'solid-js'
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
}

const SellerContext = createContext<SellerContextType>()

export const SellerProvider: ParentComponent = (props) => {
  const auth = useAuth()
  const user = () => auth.session()?.user as AuthUser | undefined
  const userId = () => user()?.id

  // Store resource
  const [store] = createResource(
    userId,
    async (id) => {
      if (!id) return null
      return await getStoreByUserId(id)
    },
    { initialValue: null }
  )

  // Products resource that depends on store
  const [products] = createResource(
    store,
    async (storeData) => {
      if (!storeData?.storeId) return []
      return await getProducts(storeData.storeId)
    },
    { initialValue: [] }
  )

  // Loading state
  const isLoading = () => store.loading || products.loading

  return (
    <SellerContext.Provider
      value={{
        user,
        store,
        products,
        isLoading,
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
