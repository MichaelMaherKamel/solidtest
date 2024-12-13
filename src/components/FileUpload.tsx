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
      if (preview() && preview() !== props.defaultValue && preview() !== props.currentImage) {
        URL.revokeObjectURL(preview()!)
      }
    }
  })

  const resetError = () => setClientError('')

  const handleFile = async (file: File) => {
    if (file) {
      resetError()
      setIsUploading(true)

      try {
        // Validate file type
        if (props.accept && !file.type.match(props.accept)) {
          setClientError('Please select a valid file type')
          return
        }

        // Validate file size
        const maxSize = props.maxSize || 5 * 1024 * 1024 // Default 5MB
        if (file.size > maxSize) {
          setClientError(`File size should be less than ${Math.floor(maxSize / 1024 / 1024)}MB`)
          return
        }

        // Create FormData and upload
        const formData = new FormData()
        formData.append('file', file)

        // Pass the current image URL if we're replacing
        if (props.currentImage) {
          formData.append('currentImage', props.currentImage)
        }

        const result = await upload(formData)

        if (result.success && result.url) {
          // If there was a previous blob URL, revoke it
          if (preview() && preview() !== props.defaultValue && preview() !== props.currentImage) {
            URL.revokeObjectURL(preview()!)
          }
          setPreview(URL.createObjectURL(file))
          props.onSuccess?.(result.url)
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
      }
    }
  }

  const removeImage = () => {
    if (preview() && preview() !== props.defaultValue && preview() !== props.currentImage) {
      URL.revokeObjectURL(preview()!)
    }
    setPreview(null)
    if (inputRef) inputRef.value = ''
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
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
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
        {preview() ? (
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
        ) : (
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
              accept={props.accept}
              onChange={(e) => {
                const files = e.target.files
                if (files && files.length > 0) handleFile(files[0])
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
                PNG, JPG, GIF up to {props.maxSize ? Math.floor(props.maxSize / 1024 / 1024) : 5}MB
              </p>
              {props.currentImage && (
                <p class='text-xs text-blue-500 mt-1'>Uploading a new image will replace the current one</p>
              )}
            </div>
          </div>
        )}
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
