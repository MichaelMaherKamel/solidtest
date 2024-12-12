// import { Component, createSignal, Show, createEffect } from 'solid-js'
// import { useSubmission } from '@solidjs/router'
// import { createStoreAction } from '~/db/actions/stores'
// import { FileUpload } from '../FileUpload'

// type StoreFormProps = {
//   onSuccess?: () => void
//   onCancel?: () => void
// }

// export const StoreForm: Component<StoreFormProps> = (props) => {
//   const submission = useSubmission(createStoreAction)
//   const [uploadedImageUrl, setUploadedImageUrl] = createSignal('')
//   const [isUploading, setIsUploading] = createSignal(false)
//   const [error, setError] = createSignal('')
//   const [formData, setFormData] = createSignal({
//     storeName: '',
//     storePhone: '',
//     storeAddress: '',
//   })

//   createEffect(() => {
//     if (submission.result?.success) {
//       props.onSuccess?.()
//     }
//   })

//   const handleFileUploadSuccess = (url: string) => {
//     setUploadedImageUrl(url)
//     setError('')
//   }

//   const handleFileUploadError = (error: string) => {
//     setError(error)
//     setUploadedImageUrl('')
//   }

//   const handleInputChange = (event: Event) => {
//     const target = event.target as HTMLInputElement | HTMLTextAreaElement
//     setFormData((prev) => ({
//       ...prev,
//       [target.name]: target.value,
//     }))
//   }

//   return (
//     <div class='w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow'>
//       <Show when={error() || (!submission.result?.success && submission.error)}>
//         <div class='mb-6 p-4 bg-red-50 border border-red-200 rounded-md'>
//           <p class='text-red-600'>{error() || submission.error}</p>
//         </div>
//       </Show>

//       <form action={createStoreAction} method='post' class='space-y-6'>
//         <input type='hidden' name='storeImage' value={uploadedImageUrl()} />

//         {/* Image Upload Section */}
//         <div class='space-y-4'>
//           <div class='space-y-2'>
//             <label class='block text-sm font-medium text-gray-700'>
//               Store Image {!uploadedImageUrl() && <span class='text-red-500'>*</span>}
//             </label>

//             <Show when={!uploadedImageUrl()}>
//               <FileUpload
//                 accept='image/*'
//                 maxSize={5 * 1024 * 1024}
//                 onSuccess={handleFileUploadSuccess}
//                 onError={handleFileUploadError}
//               />
//             </Show>

//             <Show when={uploadedImageUrl()}>
//               <div class='flex items-center space-x-4'>
//                 <div class='w-32 h-32 relative rounded-lg overflow-hidden border border-gray-200'>
//                   <img src={uploadedImageUrl()} alt='Store' class='w-full h-full object-cover' />
//                 </div>
//                 <div class='flex flex-col space-y-2'>
//                   <p class='text-sm text-green-600'>✓ Image uploaded successfully</p>
//                   <button
//                     type='button'
//                     class='px-3 py-1 text-sm text-red-600 border border-red-200 rounded
//                            hover:bg-red-50 transition-colors duration-200'
//                     onClick={() => setUploadedImageUrl('')}
//                   >
//                     Remove Image
//                   </button>
//                 </div>
//               </div>
//             </Show>
//           </div>
//         </div>

//         {/* Store Name Field */}
//         <div class='space-y-2'>
//           <label for='storeName' class='block text-sm font-medium text-gray-700'>
//             Store Name <span class='text-red-500'>*</span>
//           </label>
//           <input
//             id='storeName'
//             name='storeName'
//             value={formData().storeName}
//             onChange={handleInputChange}
//             type='text'
//             required
//             minLength={2}
//             maxLength={100}
//             placeholder='Enter store name'
//             disabled={submission.pending || isUploading()}
//             class='w-full px-3 py-2 border border-gray-300 rounded-md
//                    focus:outline-none focus:ring-2 focus:ring-indigo-500
//                    disabled:bg-gray-100 disabled:cursor-not-allowed'
//           />
//         </div>

//         {/* Phone Number Field */}
//         <div class='space-y-2'>
//           <label for='storePhone' class='block text-sm font-medium text-gray-700'>
//             Phone Number
//           </label>
//           <input
//             id='storePhone'
//             name='storePhone'
//             value={formData().storePhone}
//             onChange={handleInputChange}
//             type='tel'
//             placeholder='Enter store phone number'
//             disabled={submission.pending || isUploading()}
//             class='w-full px-3 py-2 border border-gray-300 rounded-md
//                    focus:outline-none focus:ring-2 focus:ring-indigo-500
//                    disabled:bg-gray-100 disabled:cursor-not-allowed'
//           />
//         </div>

//         {/* Address Field */}
//         <div class='space-y-2'>
//           <label for='storeAddress' class='block text-sm font-medium text-gray-700'>
//             Store Address
//           </label>
//           <textarea
//             id='storeAddress'
//             name='storeAddress'
//             value={formData().storeAddress}
//             onChange={handleInputChange}
//             rows={3}
//             placeholder='Enter store address'
//             disabled={submission.pending || isUploading()}
//             class='w-full px-3 py-2 border border-gray-300 rounded-md
//                    focus:outline-none focus:ring-2 focus:ring-indigo-500
//                    disabled:bg-gray-100 disabled:cursor-not-allowed'
//           />
//         </div>

//         {/* Form Actions */}
//         <div class='flex justify-end space-x-4 pt-4'>
//           <button
//             type='button'
//             class='px-4 py-2 text-gray-700 border border-gray-300 rounded-md
//                    hover:bg-gray-50 focus:outline-none focus:ring-2
//                    focus:ring-offset-2 focus:ring-indigo-500
//                    disabled:opacity-50 disabled:cursor-not-allowed'
//             onClick={props.onCancel}
//             disabled={submission.pending || isUploading()}
//           >
//             Cancel
//           </button>
//           <button
//             type='submit'
//             class='px-4 py-2 text-white bg-indigo-600 rounded-md
//                    hover:bg-indigo-700 focus:outline-none focus:ring-2
//                    focus:ring-offset-2 focus:ring-indigo-500
//                    disabled:opacity-50 disabled:cursor-not-allowed'
//             disabled={submission.pending || isUploading() || !uploadedImageUrl()}
//           >
//             {submission.pending ? (
//               <div class='flex items-center space-x-2'>
//                 <div
//                   class='w-4 h-4 border-2 border-white border-t-transparent
//                            rounded-full animate-spin'
//                 />
//                 <span>Creating Store...</span>
//               </div>
//             ) : (
//               'Create Store'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
