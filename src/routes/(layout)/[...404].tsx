import { A } from '@solidjs/router'

export default function NotFound() {
  return (
    <div class='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div class='max-w-md w-full'>
        <div class='bg-white shadow-lg rounded-lg overflow-hidden'>
          <div class='p-6 bg-red-500 text-white'>
            <h1 class='text-3xl font-bold'>404 - Not Found</h1>
          </div>
          <div class='p-6'>
            <p class='text-gray-700 mb-4'>The page you're looking for doesn't exist or has been moved.</p>
            <A
              href='/'
              class='inline-block bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300'
            >
              Go to Home Page
            </A>
          </div>
        </div>
      </div>
    </div>
  )
}
