import { Component, createSignal, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { StoreForm } from '~/components/Stores/StoreForm'
import { StoreList } from '~/components/Stores/StoreList'
import { getStores } from '~/db/fetchers/stores'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export const route = {
  preload: () => getStores(),
}

const CreateStorePage: Component = () => {
  const [showForm, setShowForm] = createSignal(false)

  return (
    <div class='min-h-screen bg-gray-50'>
      <main class='max-w-7xl mx-auto px-4 py-8 space-y-8'>
        <Card>
          <CardHeader class='flex flex-row items-center justify-between space-y-0 pb-4'>
            <CardTitle class='text-3xl font-bold text-gray-900'>Store Management</CardTitle>
            <div class='flex items-center space-x-4'>
              <A
                href='/'
                class='inline-flex items-center px-4 py-2 rounded-md bg-gray-100 
                     text-gray-700 hover:bg-gray-200 transition-colors duration-200'
              >
                Home
              </A>
              <Show
                when={showForm()}
                fallback={
                  <button
                    type='button'
                    class='inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white
                         hover:bg-indigo-700 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-indigo-500 
                         transition-colors duration-200'
                    onClick={() => setShowForm(true)}
                  >
                    Create New Store
                  </button>
                }
              >
                <button
                  type='button'
                  class='inline-flex items-center px-4 py-2 rounded-md border border-gray-300 
                       bg-white text-sm font-medium text-gray-700 
                       hover:bg-gray-50 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-indigo-500
                       transition-colors duration-200'
                  onClick={() => setShowForm(false)}
                >
                  Cancel Creation
                </button>
              </Show>
            </div>
          </CardHeader>

          <CardContent>
            <Show when={showForm()} fallback={<StoreList />}>
              <div class='bg-white rounded-lg p-6'>
                <h2 class='text-2xl font-semibold text-gray-900 mb-6'>Create New Store</h2>
                <StoreForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
              </div>
            </Show>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default CreateStorePage
