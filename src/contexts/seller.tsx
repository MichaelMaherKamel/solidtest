// contexts/seller.tsx
import { createContext, useContext, ParentComponent } from 'solid-js'
import { createAsync } from '@solidjs/router'
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
  store: () => Store | null | undefined
  products: () => Product[] | undefined // Added this line
}

const SellerContext = createContext<SellerContextType>()

export const SellerProvider: ParentComponent = (props) => {
  const auth = useAuth()
  const user = () => auth.session()?.user as AuthUser | undefined

  // Load store data
  const store = createAsync(async () => {
    const userId = user()?.id
    if (!userId) return null
    return await getStoreByUserId(userId)
  })

  // Load products data based on store
  const products = createAsync(async () => {
    const storeId = store()?.storeId
    if (!storeId) return []
    return await getProducts(storeId)
  })

  return <SellerContext.Provider value={{ user, store, products }}>{props.children}</SellerContext.Provider>
}

export const useSellerContext = () => {
  const context = useContext(SellerContext)
  if (!context) throw new Error('useSellerContext must be used within a SellerProvider')
  return context
}
