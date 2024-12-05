import { Component, createSignal, Show } from 'solid-js'
import { useSubmission, useAction } from '@solidjs/router'
import { uploadFileAction } from '~/db/actions/upload'
import { Alert, AlertDescription } from './ui/alerts'
import { Spinner } from '~/components/ui/spinner'

type FileUploadProps = {
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number
}

export const FileUpload: Component<FileUploadProps> = (props) => {
  const submission = useSubmission(uploadFileAction)
  const upload = useAction(uploadFileAction)
  const [clientError, setClientError] = createSignal<string>('')
  const [isUploading, setIsUploading] = createSignal(false)

  const resetError = () => setClientError('')

  const handleFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
      resetError()
      setIsUploading(true)

      try {
        // Validate file type
        if (props.accept && !file.type.match(props.accept)) {
          setClientError('Please select a valid file type')
          input.value = ''
          return
        }

        // Validate file size
        const maxSize = props.maxSize || 5 * 1024 * 1024 // Default 5MB
        if (file.size > maxSize) {
          setClientError(`File size should be less than ${Math.floor(maxSize / 1024 / 1024)}MB`)
          input.value = ''
          return
        }

        // Create FormData and upload
        const formData = new FormData()
        formData.append('file', file)

        const result = await upload(formData)

        if (result.success && result.data) {
          props.onSuccess?.(result.data.url)
        } else {
          const error = result.error || 'Failed to upload file'
          setClientError(error)
          props.onError?.(error)
        }
      } catch (error) {
        console.error('Upload error:', error)
        setClientError('Failed to upload file')
        props.onError?.('Failed to upload file')
      } finally {
        setIsUploading(false)
        input.value = '' // Reset input after upload
      }
    }
  }

  return (
    <div class='space-y-4'>
      <Show when={clientError()}>
        <Alert variant='destructive'>
          <AlertDescription>{clientError()}</AlertDescription>
        </Alert>
      </Show>

      <div class='space-y-4'>
        <div class='flex items-center justify-center w-full'>
          <label
            class='flex flex-col items-center justify-center w-full h-32 
                       border-2 border-gray-300 border-dashed rounded-lg 
                       cursor-pointer bg-gray-50 hover:bg-gray-100 
                       transition-colors duration-200'
          >
            <div class='flex flex-col items-center justify-center pt-5 pb-6'>
              <span class='text-2xl text-gray-500 mb-3'>📁</span>
              <p class='mb-2 text-sm text-gray-500'>
                <span class='font-semibold'>Click to upload</span> or drag and drop
              </p>
              <p class='text-xs text-gray-500'>
                PNG, JPG, GIF up to {props.maxSize ? Math.floor(props.maxSize / 1024 / 1024) : 5}MB
              </p>
            </div>
            <input
              type='file'
              accept={props.accept}
              onChange={handleFileChange}
              class='hidden'
              disabled={isUploading()}
            />
          </label>
        </div>
        <Show when={isUploading()}>
          <div class='flex items-center justify-center space-x-2'>
            <Spinner class='w-4 h-4' />
            <span class='text-sm text-gray-500'>Uploading...</span>
          </div>
        </Show>
      </div>
    </div>
  )
}
