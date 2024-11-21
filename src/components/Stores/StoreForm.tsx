import { Component, createSignal, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useSubmission } from '@solidjs/router'
import { createStoreAction } from '~/db/actions/stores'
import { Alert, AlertDescription } from '~/components/ui/alerts'
import { Spinner } from '~/components/ui/spinner'

type StoreFormProps = {
  onSuccess?: () => void
  onCancel?: () => void // Added explicit cancel prop
}

export const StoreForm: Component<StoreFormProps> = (props) => {
  const navigate = useNavigate()
  const submission = useSubmission(createStoreAction)

  const [imagePreview, setImagePreview] = createSignal<string>('')
  const [clientError, setClientError] = createSignal<string>('')

  // Reset error when submission state changes
  const resetError = () => setClientError('')

  const handleImageChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
      // Reset preview and error
      setImagePreview('')
      resetError()

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setClientError('Please select a valid image file')
        input.value = '' // Reset input
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setClientError('Image size should be less than 5MB')
        input.value = '' // Reset input
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Redirect after successful submission
  const handleSubmissionComplete = () => {
    if (submission.result?.success) {
      setTimeout(() => {
        props.onSuccess?.() // Call the callback if provided
        navigate('/shopping')
      }, 2000)
    }
  }

  return (
    <div class='w-full max-w-2xl mx-auto p-6'>
      <Show when={clientError() || (!submission.result?.success && submission.result?.error)}>
        <Alert variant='destructive' class='mb-6'>
          {/* <AlertDescription>{clientError() || submission.result?.error}</AlertDescription> */}
        </Alert>
      </Show>

      <Show when={submission.result?.success}>
        <Alert class='mb-6'>
          <AlertDescription>Store created successfully! Redirecting...</AlertDescription>
        </Alert>
      </Show>

      <form
        action={createStoreAction}
        method='post'
        class='space-y-6'
        onSubmit={() => {
          resetError()
          handleSubmissionComplete()
        }}
      >
        <div class='space-y-2'>
          <label for='storeName' class='block text-sm font-medium text-gray-700'>
            Store Name *
          </label>
          <input
            id='storeName'
            name='storeName'
            type='text'
            required
            minLength={2}
            maxLength={100}
            class='w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500'
            disabled={submission.pending}
          />
        </div>

        <div class='space-y-2'>
          <label for='storeImage' class='block text-sm font-medium text-gray-700'>
            Store Image
          </label>
          <div class='space-y-4'>
            <Show when={imagePreview()}>
              <div class='w-32 h-32 relative rounded-lg overflow-hidden'>
                <img src={imagePreview()} alt='Preview' class='w-full h-full object-cover' />
              </div>
            </Show>
            <input
              id='storeImage'
              name='storeImage'
              type='file'
              accept='image/*'
              class='block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4 file:rounded-md
                     file:border-0 file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100'
              onChange={handleImageChange}
              disabled={submission.pending}
            />
          </div>
        </div>

        <div class='space-y-2'>
          <label for='storePhone' class='block text-sm font-medium text-gray-700'>
            Phone Number
          </label>
          <input
            id='storePhone'
            name='storePhone'
            type='tel'
            pattern='[0-9+\-\s()]*'
            class='w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500'
            disabled={submission.pending}
          />
        </div>

        <div class='space-y-2'>
          <label for='storeAddress' class='block text-sm font-medium text-gray-700'>
            Store Address
          </label>
          <textarea
            id='storeAddress'
            name='storeAddress'
            rows={3}
            class='w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500'
            disabled={submission.pending}
          />
        </div>

        <div class='flex justify-end space-x-4 pt-4'>
          <button
            type='button'
            class='px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                   text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-indigo-500 disabled:opacity-50'
            onClick={() => props.onCancel?.() || props.onSuccess?.()} // Use onCancel if provided, fall back to onSuccess
            disabled={submission.pending}
          >
            Cancel
          </button>
          <button
            type='submit'
            class='flex items-center justify-center px-4 py-2 border 
                   border-transparent rounded-md shadow-sm text-sm font-medium 
                   text-white bg-indigo-600 hover:bg-indigo-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-indigo-500 disabled:opacity-50'
            disabled={submission.pending}
          >
            {submission.pending ? (
              <>
                <Spinner class='w-4 h-4 mr-2' />
                Creating Store...
              </>
            ) : (
              'Create Store'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
