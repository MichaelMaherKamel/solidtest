import { createContext, useContext, ParentComponent, createSignal } from 'solid-js'
import { createResource, type Resource } from 'solid-js'
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
  stores: Resource<Store[]>
  products: Resource<Product[]>
  users: Resource<User[]>
  isLoading: () => boolean
  refreshStores: () => void
  refreshProducts: () => void
  refreshUsers: () => void
}

const AdminContext = createContext<AdminContextType>()

export const AdminProvider: ParentComponent = (props) => {
  const auth = useAuth()
  const user = () => auth.session()?.user as AuthUser | undefined
  const userId = () => user()?.id

  // Add refresh trigger signals for each resource
  const [storesRefreshTrigger, setStoresRefreshTrigger] = createSignal(0)
  const [productsRefreshTrigger, setProductsRefreshTrigger] = createSignal(0)
  const [usersRefreshTrigger, setUsersRefreshTrigger] = createSignal(0)

  // Update resources to depend on their respective refresh triggers
  const [stores] = createResource(
    () => ({ userId: userId(), trigger: storesRefreshTrigger() }),
    async () => await getStores(),
    { initialValue: [] }
  )

  const [products] = createResource(
    () => ({ userId: userId(), trigger: productsRefreshTrigger() }),
    async () => await getAllProducts(),
    { initialValue: [] }
  )

  const [users] = createResource(
    () => ({ userId: userId(), trigger: usersRefreshTrigger() }),
    async () => await getUsers(),
    { initialValue: [] }
  )

  // Combined loading state
  const isLoading = () => stores.loading || products.loading || users.loading

  // Refresh functions
  const refreshStores = () => setStoresRefreshTrigger((prev) => prev + 1)
  const refreshProducts = () => setProductsRefreshTrigger((prev) => prev + 1)
  const refreshUsers = () => setUsersRefreshTrigger((prev) => prev + 1)

  return (
    <AdminContext.Provider
      value={{
        user,
        stores,
        products,
        users,
        isLoading,
        refreshStores,
        refreshProducts,
        refreshUsers,
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
