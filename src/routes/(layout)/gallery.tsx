import { Component } from 'solid-js'
import { ImageGallery } from '~/components/ImageGallery'
import { CartSheet } from '~/components/CartSheet'

const ImagesPage: Component = () => {
  return (
    <div class='max-w-7xl mx-auto px-4 py-8'>
      <div class='mb-8'>
        <h1 class='text-2xl font-bold text-gray-900'>Uploaded Images</h1>
        <p class='text-gray-600 mt-2'>Gallery of all uploaded images</p>
      </div>

      <ImageGallery />
      <CartSheet />
    </div>
  )
}

export default ImagesPage
