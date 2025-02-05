// // src/routes/upload-test.tsx
// import { Component, createSignal, For, Show, Suspense } from 'solid-js'
// import { createAsync } from '@solidjs/router'
// import { Card, CardHeader, CardContent, CardTitle } from '~/components/ui/card'
// import { SupabaseImageUpload } from '~/components/SupabaseImageUpload'
// import { getBucketFiles } from '~/db/fetchers/supabaseimages'
// import { formatDistanceToNow } from 'date-fns'
// import AuthShowcase from '~/components/GoogleSigninButton'

// const UploadTestPage: Component = () => {
//   const [uploadedImages, setUploadedImages] = createSignal<string[]>([])
//   const bucketData = createAsync(() => getBucketFiles())

//   const handleUploadSuccess = (url: string) => {
//     setUploadedImages((prev) => [...prev, url])
//   }

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return '0 Bytes'
//     const k = 1024
//     const sizes = ['Bytes', 'KB', 'MB', 'GB']
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
//   }

//   return (
//     <div class='min-h-screen bg-gray-50 py-8'>
//       <AuthShowcase />
//       <div class='max-w-7xl mx-auto px-4'>
//         <Card>
//           <CardHeader>
//             <CardTitle>Supabase Image Upload Test</CardTitle>
//           </CardHeader>
//           <CardContent class='space-y-8'>
//             {/* Upload Component */}
//             <SupabaseImageUpload onSuccess={handleUploadSuccess} maxSize={6 * 1024 * 1024} />

//             {/* Bucket Files Display with Suspense */}
//             <div class='space-y-4'>
//               <h3 class='text-lg font-semibold'>Bucket Files</h3>

//               <Suspense
//                 fallback={
//                   <div class='flex justify-center py-8'>
//                     <div class='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
//                   </div>
//                 }
//               >
//                 <Show when={bucketData()?.error}>
//                   <div class='text-red-500'>{bucketData()?.error}</div>
//                 </Show>

//                 <div class='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                   <For each={bucketData()?.files}>
//                     {(file) => (
//                       <div class='bg-white rounded-lg overflow-hidden border border-gray-200'>
//                         <div class='aspect-square'>
//                           <img src={file.url} alt={file.name} class='w-full h-full object-cover' />
//                         </div>
//                         <div class='p-3 space-y-1'>
//                           <p class='text-sm font-medium text-gray-900 truncate' title={file.name}>
//                             {file.name}
//                           </p>
//                           <p class='text-xs text-gray-500'>Size: {formatFileSize(file.size)}</p>
//                           <p class='text-xs text-gray-500'>
//                             Uploaded: {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </For>
//                 </div>
//               </Suspense>

//               {/* Show newly uploaded images */}
//               <Show when={uploadedImages().length > 0}>
//                 <div class='border-t pt-4 mt-4'>
//                   <h3 class='text-lg font-semibold mb-4'>Newly Uploaded</h3>
//                   <div class='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                     <For each={uploadedImages()}>
//                       {(imageUrl) => (
//                         <div class='relative aspect-square rounded-lg overflow-hidden border border-gray-200'>
//                           <img src={imageUrl} alt='Newly uploaded' class='w-full h-full object-cover' />
//                         </div>
//                       )}
//                     </For>
//                   </div>
//                 </div>
//               </Show>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default UploadTestPage

// import { Title } from '@solidjs/meta'
// import { LocalizationButton } from '~/components/LocalizationButton'
// import { useI18n } from '~/contexts/i18n'
// import { Show } from 'solid-js'
// import { getCart } from '~/db/fetchers/cart'

// export default function TestPage() {
//   const { t, dict } = useI18n()
//   const cart = getCart()

//   return (
//     <main class='container mx-auto p-4 space-y-4'>
//       <Title>Test Page</Title>

//       <div class='flex justify-end'>
//         <LocalizationButton />
//       </div>

//       <Show when={dict()} fallback={<div>Loading...</div>}>
//         <div class='space-y-4'>
//           <h1 class='text-3xl font-bold'>{t('nav.home')}</h1>

//           <div class='grid gap-4'>
//             <button class='px-4 py-2 border rounded'>{t('auth.login')}</button>
//             <button class='px-4 py-2 border rounded'>{t('auth.signup')}</button>
//             <p>{t('common.loading')}</p>
//           </div>
//         </div>
//       </Show>
//     </main>
//   )
// }

import FawryCheckout from "~/components/FawryPayComponent"

const CheckoutPage = () => {
  return (
    <div>
      <h1>FawryPay Checkout</h1>
      <FawryCheckout />
    </div>
  )
}

export default CheckoutPage
