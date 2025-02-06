import { Component, createSignal, createEffect, Show } from 'solid-js'
import { useSubmission, useAction } from '@solidjs/router'
import { supabaseUploadAction } from '~/db/actions/supabaseImageupload'
import { Alert, AlertDescription } from './ui/alerts'
import { Spinner } from '~/components/ui/spinner'
import { AiOutlineClose } from 'solid-icons/ai'

interface FileUploadProps {
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number
  defaultValue?: string
  currentImage?: string
  folder?: string
}

const FileUpload: Component<FileUploadProps> = (props) => {
  const [preview, setPreview] = createSignal<string | null>(props.defaultValue || props.currentImage || null)
  const [isDragActive, setIsDragActive] = createSignal(false)
  const [clientError, setClientError] = createSignal<string>('')
  const [isUploading, setIsUploading] = createSignal(false)
  const submission = useSubmission(supabaseUploadAction)
  const upload = useAction(supabaseUploadAction)
  let inputRef: HTMLInputElement | undefined

  // Effect to handle URL cleanup
  createEffect(() => {
    return () => {
      const currentPreview = preview()
      if (currentPreview && currentPreview !== props.defaultValue && currentPreview !== props.currentImage) {
        URL.revokeObjectURL(currentPreview)
      }
    }
  })

  const resetError = () => setClientError('')

  const handleFile = async (file: File) => {
    if (!file) return

    resetError()
    setIsUploading(true)

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setClientError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed')
        setIsUploading(false)
        return
      }

      // Validate file size
      const maxSize = props.maxSize || 5 * 1024 * 1024 // Default 5MB
      if (file.size > maxSize) {
        setClientError(`File size should be less than ${Math.floor(maxSize / 1024 / 1024)}MB`)
        setIsUploading(false)
        return
      }

      // Create FormData and upload
      const formData = new FormData()
      formData.append('file', file)

      if (props.currentImage) {
        formData.append('currentImage', props.currentImage)
      }

      if (props.folder) {
        formData.append('folder', props.folder)
      }

      let retries = 3
      let lastError: string | undefined

      while (retries > 0) {
        try {
          const result = await upload(formData)

          if (result.success && result.url) {
            const currentPreview = preview()
            if (currentPreview && currentPreview !== props.defaultValue && currentPreview !== props.currentImage) {
              URL.revokeObjectURL(currentPreview)
            }
            const newPreview = URL.createObjectURL(file)
            setPreview(newPreview)
            props.onSuccess?.(result.url)
            return
          }

          lastError = result.error
          throw new Error(result.error)
        } catch (error) {
          retries--
          if (retries === 0) {
            const errorMessage = lastError || 'Failed to upload file'
            setClientError(errorMessage)
            props.onError?.(errorMessage)
            break
          }
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file'
      setClientError(errorMessage)
      props.onError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    const currentPreview = preview()
    if (currentPreview && currentPreview !== props.defaultValue && currentPreview !== props.currentImage) {
      URL.revokeObjectURL(currentPreview)
    }
    setPreview(null)
    if (inputRef) {
      inputRef.value = ''
    }
    props.onSuccess?.('') // Notify parent that image was removed
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onDrop = async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer?.files
    if (files?.length) {
      await handleFile(files[0])
    }
  }

  const handleClick = () => {
    inputRef?.click()
  }

  return (
    <div class='space-y-4'>
      <Show when={clientError()}>
        <Alert variant='destructive'>
          <AlertDescription>{clientError()}</AlertDescription>
        </Alert>
      </Show>

      <div class='relative w-[200px] h-[200px]'>
        <Show
          when={preview()}
          fallback={
            <div
              class={`w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer 
                ${isDragActive() ? 'border-primary bg-primary/5' : 'border-gray-300'} 
                hover:border-primary hover:bg-primary/5 transition-colors`}
              onClick={handleClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={onDrop}
            >
              <input
                ref={inputRef}
                type='file'
                accept={props.accept || 'image/jpeg,image/png,image/gif,image/webp'}
                onChange={(e) => {
                  const files = e.currentTarget.files
                  if (files?.length) handleFile(files[0])
                }}
                class='hidden'
                disabled={isUploading()}
              />
              <div class='text-center'>
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
                  {isDragActive() ? 'Drop the image here' : 'Drag & drop or click to upload'}
                </p>
                <p class='text-xs text-gray-500'>
                  PNG, JPG, GIF, WebP up to {props.maxSize ? Math.floor(props.maxSize / 1024 / 1024) : 5}MB
                </p>
                <Show when={props.currentImage}>
                  <p class='text-xs text-blue-500 mt-1'>Uploading a new image will replace the current one</p>
                </Show>
              </div>
            </div>
          }
        >
          <div class='relative w-full h-full border-2 border-gray-300 rounded-lg overflow-hidden'>
            <img src={preview()!} alt='Uploaded' class='w-full h-full object-cover' />
            <button
              onClick={removeImage}
              class='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100'
              type='button'
              aria-label='Remove image'
            >
              <AiOutlineClose class='w-4 h-4 text-gray-600' />
            </button>
          </div>
        </Show>
      </div>

      <Show when={isUploading()}>
        <div class='flex items-center justify-center space-x-2'>
          <Spinner class='w-4 h-4' />
          <span class='text-sm text-gray-500'>{props.currentImage ? 'Replacing image...' : 'Uploading...'}</span>
        </div>
      </Show>
    </div>
  )
}

export default FileUpload
