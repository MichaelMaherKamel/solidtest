import { Component, For, Show } from 'solid-js'
import { list } from '@vercel/blob'
import { createResource } from 'solid-js'
import { Spinner } from '~/components/ui/spinner'

const fetchImages = async () => {
  const blobs = await list()
  console.log(blobs)
  return blobs
}

export const ImageGallery: Component = () => {
  const [images, { refetch }] = createResource(fetchImages)

  return (
    <div class='w-full'>
      <Show
        when={!images.loading}
        fallback={
          <div class='flex justify-center items-center min-h-[200px]'>
            <Spinner class='w-8 h-8' />
          </div>
        }
      >
        <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          <For each={images()?.blobs}>
            {(image) => (
              <div class='relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity'>
                <img src={image.url} alt={image.pathname} class='w-full h-full object-cover' />
                <div class='absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm truncate'>
                  {image.pathname}
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}
