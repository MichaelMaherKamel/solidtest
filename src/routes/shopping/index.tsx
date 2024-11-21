// // import { A } from '@solidjs/router'
// // import Counter from '~/components/Counter'

// // export default function Shopping() {
// //   return (
// //     <main class='text-center mx-auto text-gray-700 p-4'>
// //       <h1 class='max-6-xs text-6xl text-sky-700 font-thin uppercase my-16'>Hello world!</h1>
// //       <Counter />
// //       <p class='mt-8'>
// //         Visit{' '}
// //         <a href='https://solidjs.com' target='_blank' class='text-sky-600 hover:underline'>
// //           solidjs.com
// //         </a>{' '}
// //         to learn how to build Solid apps.
// //       </p>
// //       <p class='my-4'>
// //         <span>Home</span>
// //         {' - '}
// //         <A href='/about' class='text-sky-600 hover:underline'>
// //           About Page
// //         </A>{' '}
// //       </p>
// //     </main>
// //   )
// // }

// import { For } from 'solid-js'
// import { createAsync } from '@solidjs/router'
// import { getProducts, type Product } from '~/db/fetchers/products'
// import ProductCard from '~/components/ProductCard'

// export const route = {
//   preload: () => getProducts(),
// }

// export default function Shopping() {
//   const products = createAsync(() => getProducts())

//   return (
//     <main class='max-w-7xl mx-auto px-4 py-8'>
//       <h1 class='text-3xl font-bold text-gray-900 mb-8'>Our Products</h1>

//       <div class='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
//         <For each={products()} fallback={<div class='text-center'>Loading products...</div>}>
//           {(product) => <ProductCard {...product} />}
//         </For>
//       </div>
//     </main>
//   )
// }

const Shopping = () => {
  return <div>Shopping</div>
}

export default Shopping
