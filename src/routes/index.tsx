import { Component, createEffect, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import { supabase } from '~/lib/supabase/supabase'
import { AuthSession } from '@supabase/supabase-js'
import Account from '../components/auth/account'
import Auth from '~/components/auth/auth'

const HomePage: Component = () => {
  const [session, setSession] = createSignal<AuthSession | null>(null)

  createEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  })

  return (
    <div
      class='min-h-screen bg-cover bg-center'
      style={{
        'background-image': 'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)',
      }}
    >
      <div class='bg-black bg-opacity-60 min-h-screen flex items-center justify-center'>
        <div class='container mx-auto px-4'>
          {!session() ? (
            <div class='max-w-md mx-auto bg-white/10 p-8 rounded-lg backdrop-blur-sm'>
              <h1 class='text-4xl font-bold text-white mb-6 text-center'>Welcome</h1>
              <p class='text-white/90 mb-8 text-center'>
                Sign in to get started with our amazing features and create your own store.
              </p>
              <Auth />
            </div>
          ) : (
            <div class='max-w-2xl mx-auto bg-white/10 p-8 rounded-lg backdrop-blur-sm'>
              <div class='text-white mb-8'>
                <h2 class='text-3xl font-bold mb-4'>Your Dashboard</h2>
                <Account session={session()!} />
              </div>
              <div class='flex flex-col gap-4 mt-8'>
                <A href='/stores'>
                  <button class='w-full btn btn-primary'>Create Store</button>
                </A>
                <A href='/images'>
                  <button class='w-full btn btn-secondary'>View Gallery</button>
                </A>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage

// import { Component, createEffect, createSignal } from 'solid-js'
// import { A } from '@solidjs/router'
// import { supabase } from '~/lib/supabase/supabase'
// import { AuthSession } from '@supabase/supabase-js'
// import Account from '../components/auth/account'
// import { Auth } from '@supabase/auth-ui-solid'

// const HomePage: Component = () => {
//   const [session, setSession] = createSignal<AuthSession | null>(null)

//   createEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })
//   })

//   return (
//     <div
//       class='min-h-screen bg-cover bg-center'
//       style={{
//         'background-image': 'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)',
//       }}
//     >
//       <div class='bg-black bg-opacity-60 min-h-screen flex items-center justify-center'>
//         <div class='container mx-auto px-4'>
//           {!session() ? (
//             <div class='max-w-md mx-auto bg-white/10 p-8 rounded-lg backdrop-blur-sm'>
//               <h1 class='text-4xl font-bold text-white mb-6 text-center'>Welcome</h1>
//               <p class='text-white/90 mb-8 text-center'>
//                 Sign in to get started with our amazing features and create your own store.
//               </p>
//               <Auth supabaseClient={supabase} />
//             </div>
//           ) : (
//             <div class='max-w-2xl mx-auto bg-white/10 p-8 rounded-lg backdrop-blur-sm'>
//               <div class='text-white mb-8'>
//                 <h2 class='text-3xl font-bold mb-4'>Your Dashboard</h2>
//                 <Account session={session()!} />
//               </div>
//               <div class='flex flex-col gap-4 mt-8'>
//                 <A href='/stores'>
//                   <button class='w-full btn btn-primary'>Create Store</button>
//                 </A>
//                 <A href='/images'>
//                   <button class='w-full btn btn-secondary'>View Gallery</button>
//                 </A>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
//
//export default HomePage
