import { A } from '@solidjs/router'
import { put } from '@vercel/blob'

const HomePage = () => {
  return (
    <div
      class='hero min-h-screen'
      style={{
        'background-image': 'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)',
      }}
    >
      <div class='hero-overlay bg-opacity-60'></div>
      <div class='hero-content text-neutral-content text-center'>
        <div class='max-w-md'>
          <h1 class='mb-5 text-5xl font-bold'>Hello there</h1>
          <p class='mb-5'>
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In
            deleniti eaque aut repudiandae et a id nisi.
          </p>

          <A href='/stores'>
            <button class='btn btn-primary mb-4'>Get Started By Creating Store</button>
          </A>

          <div>
            <h2 class='text-xl font-semibold mb-2'>Explore Our Gallery</h2>
            <A href='/images'>
              <button class='btn btn-secondary'>View All Images</button>
            </A>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
