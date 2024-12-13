import { Component, createSignal, onCleanup, Show } from 'solid-js'
import { AiOutlineClose } from 'solid-icons/ai'
import { useSubmission, useAction } from '@solidjs/router'
import { supabaseUploadAction } from '~/db/actions/supabaseImageupload'
import { Alert, AlertDescription } from '~/components/ui/alerts'

type ImageUploaderProps = {
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number
  value?: string
  id?: string
}

export const ImageUploader: Component<ImageUploaderProps> = (props) => {
  const upload = useAction(supabaseUploadAction)
  const [dragActive, setDragActive] = createSignal(false)
  const [error, setError] = createSignal('')
  const [isUploading, setIsUploading] = createSignal(false)

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    const maxSize = props.maxSize || 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError(`File size should be less than ${Math.floor(maxSize / 1024 / 1024)}MB`)
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await upload(formData)

      if (result.success && result.url) {
        props.onSuccess?.(result.url)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image'
      setError(message)
      props.onError?.(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div class='space-y-4'>
      <Show when={error()}>
        <Alert variant='destructive'>
          <AlertDescription>{error()}</AlertDescription>
        </Alert>
      </Show>

      <div class='relative w-[200px] h-[200px]'>
        <Show
          when={props.value}
          fallback={
            <div
              class={`w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer
                ${dragActive() ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type='file'
                accept={props.accept ?? 'image/*'}
                onChange={handleChange}
                class='hidden'
                disabled={isUploading()}
                id={props.id}
              />
              <div class='text-center p-4'>
                <svg
                  class='mx-auto h-12 w-12 text-gray-400'
                  stroke='currentColor'
                  fill='none'
                  viewBox='0 0 48 48'
                  aria-hidden='true'
                >
                  <path
                    d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                    stroke-width={2}
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
                <p class='mt-1 text-sm text-gray-600'>
                  {dragActive() ? 'Drop the image here' : 'Drag & drop or click to upload'}
                </p>
                <Show when={isUploading()}>
                  <p class='mt-1 text-sm text-primary'>Uploading...</p>
                </Show>
              </div>
            </div>
          }
        >
          <div class='relative w-full h-full border-2 border-gray-300 rounded-lg overflow-hidden'>
            <img src={props.value} alt='Upload preview' class='w-full h-full object-cover' />
            <button
              type='button'
              onClick={() => props.onSuccess?.('')}
              class='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100'
              aria-label='Remove image'
            >
              <AiOutlineClose class='w-4 h-4 text-gray-600' />
            </button>
          </div>
        </Show>
      </div>
    </div>
  )
}
