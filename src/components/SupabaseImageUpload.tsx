// src/components/SupabaseImageUpload.tsx
import { Component, createSignal, Show } from 'solid-js'
import { useSubmission } from '@solidjs/router'
import { supabaseUploadAction } from '~/db/actions/supabaseImageupload'
import { Alert, AlertDescription } from './ui/alerts'

type SupabaseImageUploadProps = {
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  maxSize?: number
}

export const SupabaseImageUpload: Component<SupabaseImageUploadProps> = (props) => {
  const [error, setError] = createSignal('')
  const submission = useSubmission(supabaseUploadAction)
  const maxSize = props.maxSize || 6 * 1024 * 1024 // Default 6MB

  return (
    <div class='space-y-4'>
      <Show when={error() || (!submission.result?.success && submission.result?.error)}>
        <Alert variant='destructive'>
          <AlertDescription>{error() || submission.result?.error}</AlertDescription>
        </Alert>
      </Show>

      <form action={supabaseUploadAction} method='post' enctype='multipart/form-data'>
        <div class='flex items-center justify-center w-full'>
          <label
            class='flex flex-col items-center justify-center w-full h-32 
                       border-2 border-gray-300 border-dashed rounded-lg 
                       cursor-pointer bg-gray-50 hover:bg-gray-100 
                       transition-colors duration-200'
          >
            <div class='flex flex-col items-center justify-center pt-5 pb-6'>
              <span class='text-2xl text-gray-500 mb-3'>📸</span>
              <p class='mb-2 text-sm text-gray-500'>
                <span class='font-semibold'>Click to upload</span> or drag and drop
              </p>
              <p class='text-xs text-gray-500'>PNG, JPG, GIF up to {Math.floor(maxSize / 1024 / 1024)}MB</p>
            </div>
            <input
              type='file'
              name='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.currentTarget.files?.[0]
                if (file && file.size > maxSize) {
                  setError(`File size should be less than ${Math.floor(maxSize / 1024 / 1024)}MB`)
                  e.currentTarget.value = ''
                  return
                }
                setError('')
                if (file) {
                  e.currentTarget.form?.requestSubmit()
                }
              }}
              class='hidden'
              disabled={submission.pending}
            />
          </label>
        </div>
      </form>

      <Show when={submission.pending}>
        <div class='flex items-center justify-center space-x-2'>
          <div class='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
          <span class='text-sm text-gray-500'>Uploading...</span>
        </div>
      </Show>
    </div>
  )
}
