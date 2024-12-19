import { createContext, useContext, ParentComponent } from 'solid-js'
import { createResource } from 'solid-js'
import { getUsers } from '~/db/fetchers/users'
import { getStores } from '~/db/fetchers/stores'
import { getAllProducts } from '~/db/fetchers/products'
import { useAuth } from '@solid-mediakit/auth/client'
import type { Store, Product, User } from '~/db/schema'

type AuthUser = {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  role: 'admin' | 'user' | 'seller'
  image: string | null
}

type AdminContextType = {
  user: () => AuthUser | undefined
  stores: () => Store[] | undefined
  products: () => Product[] | undefined
  users: () => User[] | undefined
  isLoading: () => boolean
}

const AdminContext = createContext<AdminContextType>()

export const AdminProvider: ParentComponent = (props) => {
  const auth = useAuth()
  const user = () => auth.session()?.user as AuthUser | undefined
  const userId = () => user()?.id

  // Parallel data fetching with initial values
  const [stores] = createResource(userId, async () => await getStores(), { initialValue: [] })

  const [products] = createResource(userId, async () => await getAllProducts(), { initialValue: [] })

  const [users] = createResource(userId, async () => await getUsers(), { initialValue: [] })

  // Combined loading state
  const isLoading = () => stores.loading || products.loading || users.loading

  return (
    <AdminContext.Provider
      value={{
        user,
        stores: () => stores(),
        products: () => products(),
        users: () => users(),
        isLoading,
      }}
    >
      {props.children}
    </AdminContext.Provider>
  )
}

export const useAdminContext = () => {
  const context = useContext(AdminContext)
  if (!context) throw new Error('useAdminContext must be used within an AdminProvider')
  return context
}
