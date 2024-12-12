import { Component, For, Show, Suspense } from 'solid-js'
import { createAsync } from '@solidjs/router'
import { getBucketFiles } from '~/db/fetchers/supabaseimages'
import { Spinner } from '~/components/ui/spinner'

export const ImageGallery: Component = () => {
  const data = createAsync(() => getBucketFiles())
  return (
    <div class='w-full'>
      <Suspense
        fallback={
          <div class='flex justify-center items-center min-h-[200px]'>
            <Spinner class='w-8 h-8' />
          </div>
        }
      >
        <Show
          when={!data()?.error}
          fallback={<div class='text-red-500'>{data()?.error || 'Failed to load images'}</div>}
        >
          <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            <For each={data()?.files}>
              {(image) => (
                <div class='relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity'>
                  <img loading='lazy' src={image.url} alt={image.name} class='w-full h-full object-cover' />
                  <div class='absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm truncate'>
                    {image.name}
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Suspense>
    </div>
  )
}
