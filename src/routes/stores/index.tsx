import { Component, createSignal, Show } from 'solid-js'
import { useNavigate, createAsync, A } from '@solidjs/router'
import { StoreForm } from '~/components/Stores/StoreForm'
import { StoreList } from '~/components/Stores/StoreList'
import { getStores } from '~/db/fetchers/stores'

export const route = {
  preload: () => getStores(),
}

const CreateStorePage: Component = () => {
  const navigate = useNavigate()
  const [showForm, setShowForm] = createSignal(false)

  return (
    <main class='max-w-7xl mx-auto px-4 py-8 space-y-8'>
      <div class='flex items-center justify-between'>
        <h1 class='text-3xl font-bold text-gray-900'>Store Management</h1>
        <button>
          <A href='/'>Home</A>
        </button>
        <Show
          when={showForm()}
          fallback={
            <button
              type='button'
              class='px-4 py-2 rounded-md bg-indigo-600 text-white
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-indigo-500'
              onClick={() => setShowForm(true)}
            >
              Create New Store
            </button>
          }
        >
          <button
            type='button'
            class='px-4 py-2 rounded-md border border-gray-300 
                   bg-white text-sm font-medium text-gray-700 
                   hover:bg-gray-50 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-indigo-500'
            onClick={() => setShowForm(false)}
          >
            Cancel Creation
          </button>
        </Show>
      </div>

      <Show when={showForm()} fallback={<StoreList />}>
        <div class='bg-white rounded-lg shadow-sm p-6'>
          <h2 class='text-2xl font-semibold text-gray-900 mb-6'>Create New Store</h2>
          <StoreForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        </div>
      </Show>
    </main>
  )
}

export default CreateStorePage
