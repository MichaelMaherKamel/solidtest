// import { createContext, useContext, ParentComponent, createEffect } from 'solid-js'
// import { createStore } from 'solid-js/store'
// import { useAuth } from '@solid-mediakit/auth/client'
// import { getSession, handleSession, signOutUser } from '~/db/actions/auth'

// interface AuthContextState {
//   initialized: boolean
//   loading: boolean
//   status: 'authenticated' | 'unauthenticated' | 'loading'
//   user: any | null
//   signOut: () => Promise<void>
//   client: ReturnType<typeof useAuth>
// }

// const AuthContext = createContext<AuthContextState>()

// export const AuthProvider: ParentComponent = (props) => {
//   const client = useAuth()
//   const [state, setState] = createStore<AuthContextState>({
//     initialized: false,
//     loading: true,
//     status: 'loading',
//     user: null,
//     client,
//     signOut: async () => {
//       try {
//         setState({ loading: true })
//         await signOutUser(client)
//       } catch (error) {
//         console.error('Error in signOutUser:', error)
//         // Only propagate non-redirect errors
//         if (!(error instanceof Error && error.message.includes('RedirectError'))) {
//           throw error
//         }
//       } finally {
//         // Always clean up the auth state
//         setState({
//           user: null,
//           status: 'unauthenticated',
//           loading: false,
//         })
//       }
//     },
//   })

//   // Single auth initialization
//   createEffect(async () => {
//     try {
//       const session = client.session()
//       const status = client.status()

//       if (status === 'unauthenticated' && !session) {
//         const serverSession = await getSession()
//         if (serverSession.user) {
//           await client.refetch(true)
//         }
//       }

//       if (session) {
//         await handleSession(session)
//         setState({
//           user: session.user,
//           status: 'authenticated',
//           loading: false,
//           initialized: true,
//         })
//       } else {
//         setState({
//           user: null,
//           status: 'unauthenticated',
//           loading: false,
//           initialized: true,
//         })
//       }
//     } catch (error) {
//       console.error('Error initializing auth:', error)
//       setState({
//         user: null,
//         status: 'unauthenticated',
//         loading: false,
//         initialized: true,
//       })
//     }
//   })

//   return <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
// }

// export const useAuthState = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuthState must be used within an AuthProvider')
//   }
//   return context
// }
