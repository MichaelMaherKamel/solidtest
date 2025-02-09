// import { Component, createSignal, Show } from 'solid-js'
// import { useAuth } from '@solid-mediakit/auth/client'
// import { Card, CardHeader, CardContent } from '~/components/ui/card'
// import { Button } from '~/components/ui/button'

// const GoogleIcon: Component = () => (
//   <svg class='w-5 h-5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
//     <path
//       d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
//       fill='#4285F4'
//     />
//     <path
//       d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
//       fill='#34A853'
//     />
//     <path
//       d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
//       fill='#FBBC05'
//     />
//     <path
//       d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
//       fill='#EA4335'
//     />
//   </svg>
// )

// const LoadingSpinner: Component = () => (
//   <div class='relative w-6 h-6'>
//     <div class='w-6 h-6 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin'></div>
//   </div>
// )

// const UserInfo: Component<{ user: any; onSignOut: () => Promise<void> }> = (props) => {
//   return (
//     <div class='space-y-4'>
//       <div class='flex items-center space-x-4'>
//         <Show when={props.user.image}>
//           <img src={props.user.image} alt='Profile' class='w-12 h-12 rounded-full' />
//         </Show>
//         <div>
//           <h3 class='font-medium'>{props.user.name}</h3>
//           <p class='text-sm text-gray-500'>{props.user.email}</p>
//         </div>
//       </div>
//       <Button variant='destructive' class='w-full' onClick={props.onSignOut}>
//         Sign Out
//       </Button>
//     </div>
//   )
// }

// const TestAuthPage: Component = () => {
//   const [loading, setLoading] = createSignal<boolean>(false)
//   const [error, setError] = createSignal('')
//   const auth = useAuth()

//   const handleSignIn = async () => {
//     if (loading()) return

//     try {
//       setLoading(true)
//       setError('')
//       await auth.signIn('google')
//     } catch (err) {
//       console.error('Google sign in error:', err)
//       setError('Failed to sign in with Google')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSignOut = async () => {
//     try {
//       setLoading(true)
//       await auth.signOut()
//     } catch (err) {
//       console.error('Sign out error:', err)
//       setError('Failed to sign out')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div class='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
//       <Card class='w-full max-w-md'>
//         <CardHeader>
//           <h2 class='text-2xl font-bold text-center'>Auth Test Page</h2>
//         </CardHeader>

//         <CardContent class='space-y-6'>
//           <Show when={error()}>
//             <div class='p-3 bg-red-100 text-red-700 rounded-md'>{error()}</div>
//           </Show>

//           <Show
//             when={auth.status() === 'authenticated' && auth.session()?.user}
//             fallback={
//               <Button class='w-full h-12 relative' onClick={handleSignIn} disabled={loading()}>
//                 {loading() ? (
//                   <LoadingSpinner />
//                 ) : (
//                   <div class='flex items-center justify-center gap-3'>
//                     <GoogleIcon />
//                     <span>Sign in with Google</span>
//                   </div>
//                 )}
//               </Button>
//             }
//           >
//             <UserInfo user={auth.session()?.user} onSignOut={handleSignOut} />
//           </Show>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default TestAuthPage

import { A } from '@solidjs/router'
import { useAuth } from '@solid-mediakit/auth/client'
import { type VoidComponent, Match, Switch } from 'solid-js'

const Home: VoidComponent = () => {
  return (
    <main class='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#026d56] to-[#152a2c]'>
      <div class='container flex flex-col items-center justify-center gap-12 px-4 py-16 '>
        <h1 class='text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]'>
          Create <span class='text-[hsl(88,_77%,_78%)]'>JD</span> App
        </h1>
        <div class='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
          <A
            class='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20'
            href='https://start.solidjs.com'
            target='_blank'
          >
            <h3 class='text-2xl font-bold'>Solid Start →</h3>
            <div class='text-lg'>Learn more about Solid Start and the basics.</div>
          </A>
          <A
            class='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20'
            href='https://github.com/orjdev/create-jd-app'
            target='_blank'
          >
            <h3 class='text-2xl font-bold'>JD End →</h3>
            <div class='text-lg'>Learn more about Create JD App, the libraries it uses, and how to deploy it.</div>
          </A>
        </div>
        <AuthShowcase />
      </div>
    </main>
  )
}

export default Home

const AuthShowcase: VoidComponent = () => {
  const auth = useAuth()
  return (
    <div class='flex flex-col items-center justify-center gap-4'>
      <Switch fallback={<div>Loading...</div>}>
        <Match when={auth.status() === 'authenticated'}>
          <div class='flex flex-col gap-3'>
            <span class='text-xl text-white'>Welcome {auth.session()?.user?.name}</span>
            <button
              onClick={() => auth.signOut({ redirectTo: '/test' })}
              class='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
            >
              Sign out
            </button>
          </div>
        </Match>
        <Match when={auth.status() === 'unauthenticated'}>
          <button
            onClick={async () => await auth.signIn('google')}
            class='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
          >
            Sign in
          </button>
        </Match>
      </Switch>
    </div>
  )
}
