import { Component, Show, For } from 'solid-js'
import { createAsync } from '@solidjs/router'
import { getStores } from '~/db/fetchers/stores'

export const StoreList: Component = () => {
  const stores = createAsync(() => getStores())

  return (
    <div class='space-y-4'>
      <h2 class='text-2xl font-semibold text-gray-900'>Existing Stores</h2>

      <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <For each={stores()} fallback={<div class='text-gray-500'>Loading stores...</div>}>
          {(store) => (
            <div class='border rounded-lg shadow-sm p-4 space-y-3'>
              <div class='flex items-center space-x-4'>
                <Show when={store.storeImage}>
                  <div class='w-16 h-16 rounded-lg overflow-hidden flex-shrink-0'>
                    <img src={store.storeImage!} alt={store.storeName} class='w-full h-full object-cover' />
                  </div>
                </Show>
                <div>
                  <h3 class='font-medium text-gray-900'>{store.storeName}</h3>
                  <Show when={store.storePhone}>
                    <p class='text-sm text-gray-500'>{store.storePhone}</p>
                  </Show>
                </div>
              </div>
              <Show when={store.storeAddress}>
                <p class='text-sm text-gray-600'>{store.storeAddress}</p>
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
