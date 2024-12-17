import { createContext, useContext, ParentComponent } from 'solid-js'
import { createAsync } from '@solidjs/router'
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
}

const AdminContext = createContext<AdminContextType>()

export const AdminProvider: ParentComponent = (props) => {
  const auth = useAuth()
  const user = () => auth.session()?.user as AuthUser | undefined

  // Prefetch all data needed for admin dashboard
  const stores = createAsync(async () => {
    if (!user()) return undefined
    return await getStores()
  })

  const products = createAsync(async () => {
    if (!user()) return undefined
    return await getAllProducts() // Using the new getAllProducts function
  })

  const users = createAsync(async () => {
    if (!user()) return undefined
    return await getUsers()
  })

  return (
    <AdminContext.Provider
      value={{
        user,
        stores,
        products,
        users,
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
