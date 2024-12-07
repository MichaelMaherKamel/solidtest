import { Component, createEffect, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import { supabase } from '~/lib/supabase/supabase'
import { AuthSession } from '@supabase/supabase-js'
import Account from '../../components/auth/account'
import Auth from '~/components/auth/auth'
import { FiActivity } from 'solid-icons/fi'

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

  // Base styles for links that look like buttons
  const buttonLinkStyle =
    'inline-flex w-full justify-center items-center px-4 py-2 rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
  const primaryStyle = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  const defaultStyle = 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'

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
              <button type='button' class='p-2 rounded-md hover:bg-gray-700 transition-colors'>
                <FiActivity size={24} color='red' />
              </button>
              <div class='flex flex-col gap-4 mt-8'>
                <A href='/stores' class={`${buttonLinkStyle} ${primaryStyle}`}>
                  Create Store
                </A>
                <A href='/images' class={`${buttonLinkStyle} ${defaultStyle}`}>
                  View Gallery
                </A>
              </div>
            </div>
          ) : (
            <div class='max-w-2xl mx-auto bg-white/10 p-8 rounded-lg backdrop-blur-sm'>
              <div class='text-white mb-8'>
                <h2 class='text-3xl font-bold mb-4'>Your Dashboard</h2>
                <Account session={session()!} />
              </div>
              <div class='flex flex-col gap-4 mt-8'>
                <A href='/stores' class={`${buttonLinkStyle} ${primaryStyle}`}>
                  Create Store
                </A>
                <A href='/images' class={`${buttonLinkStyle} ${defaultStyle}`}>
                  View Gallery
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
