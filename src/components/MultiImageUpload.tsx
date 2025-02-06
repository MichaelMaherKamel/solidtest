import { Component, createSignal, createEffect, For, Show } from 'solid-js'
import { useAction } from '@solidjs/router'
import { supabaseUploadAction } from '~/db/actions/supabaseImageupload'
import { Alert, AlertDescription } from './ui/alerts'
import { Spinner } from '~/components/ui/spinner'
import { AiOutlineClose } from 'solid-icons/ai'
import { Button } from './ui/button'

interface MultipleImageUploadProps {
  onSuccess?: (urls: string[]) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number
  maxFiles?: number
  defaultValues?: string[]
  key?: number | string
  folder?: string
}

const MultipleImageUpload: Component<MultipleImageUploadProps> = (props) => {
  const [currentKey, setCurrentKey] = createSignal<number | string | undefined>(props.key)
  const [previews, setPreviews] = createSignal<{ url: string; file?: File }[]>(
    props.defaultValues?.map((url) => ({ url })) || []
  )
  const [isDragActive, setIsDragActive] = createSignal(false)
  const [clientError, setClientError] = createSignal<string>('')
  const [uploadingIndex, setUploadingIndex] = createSignal<number | null>(null)
  const upload = useAction(supabaseUploadAction)
  let inputRef: HTMLInputElement | undefined

  // Effect to handle key changes
  createEffect(() => {
    if (props.key !== undefined && props.key !== currentKey()) {
      cleanupPreviews()
      setPreviews([])
      setIsDragActive(false)
      setClientError('')
      setUploadingIndex(null)
      if (inputRef) {
        inputRef.value = ''
      }
      setCurrentKey(props.key)
      props.onSuccess?.([])
    }
  })

  // Cleanup function for preview URLs
  const cleanupPreviews = () => {
    previews().forEach((preview) => {
      if (preview.file) {
        URL.revokeObjectURL(preview.url)
      }
    })
  }

  // Cleanup effect
  createEffect(() => {
    return cleanupPreviews
  })

  const resetError = () => setClientError('')

  const uploadFile = async (file: File, index: number): Promise<boolean> => {
    let retries = 3
    while (retries > 0) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        if (props.folder) {
          formData.append('folder', props.folder)
        }

        const result = await upload(formData)

        if (result.success && result.url) {
          setPreviews((prev) => prev.map((p, idx) => (idx === index ? { url: result.url!, file: undefined } : p)))
          return true
        }

        throw new Error(result.error || 'Upload failed')
      } catch (error) {
        retries--
        if (retries === 0) {
          console.error('Upload failed after retries:', error)
          return false
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    return false
  }

  const handleFiles = async (files: FileList) => {
    resetError()

    const maxFiles = props.maxFiles || 5
    const currentCount = previews().length
    const remainingSlots = maxFiles - currentCount

    if (files.length > remainingSlots) {
      setClientError(`You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}`)
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = props.maxSize || 5 * 1024 * 1024

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        setClientError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed')
        continue
      }

      // Validate file size
      if (file.size > maxSize) {
        setClientError(`Files should be less than ${Math.floor(maxSize / 1024 / 1024)}MB`)
        continue
      }

      // Add preview
      const previewUrl = URL.createObjectURL(file)
      setPreviews((prev) => [...prev, { url: previewUrl, file }])
      const currentIndex = previews().length - 1

      // Upload file
      setUploadingIndex(currentIndex)
      const success = await uploadFile(file, currentIndex)

      if (!success) {
        setPreviews((prev) => prev.filter((_, idx) => idx !== currentIndex))
        URL.revokeObjectURL(previewUrl)
        setClientError('Failed to upload image')
        props.onError?.('Failed to upload image')
      }
    }

    setUploadingIndex(null)

    // Notify parent of all successful uploads
    const uploadedUrls = previews()
      .filter((p) => !p.file)
      .map((p) => p.url)
    props.onSuccess?.(uploadedUrls)
  }

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      const newPreviews = [...prev]
      if (newPreviews[index].file) {
        URL.revokeObjectURL(newPreviews[index].url)
      }
      newPreviews.splice(index, 1)
      return newPreviews
    })

    const remainingUrls = previews()
      .filter((p) => !p.file)
      .map((p) => p.url)
    props.onSuccess?.(remainingUrls)
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
    if (e.dataTransfer?.files) {
      await handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div class='space-y-4'>
      <Show when={clientError()}>
        <Alert variant='destructive'>
          <AlertDescription>{clientError()}</AlertDescription>
        </Alert>
      </Show>

      <div class='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        <For each={previews()}>
          {(preview, index) => (
            <div class='relative aspect-square border rounded-lg overflow-hidden'>
              <img src={preview.url} alt='Preview' class='w-full h-full object-cover' />
              <Show when={uploadingIndex() === index()}>
                <div class='absolute inset-0 bg-black/50 flex items-center justify-center'>
                  <Spinner class='w-6 h-6 text-white' />
                </div>
              </Show>
              <Button
                onClick={() => removeImage(index())}
                class='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100'
                type='button'
                variant='ghost'
                size='icon'
                aria-label='Remove image'
              >
                <AiOutlineClose class='w-4 h-4 text-gray-600' />
              </Button>
            </div>
          )}
        </For>

        <Show when={previews().length < (props.maxFiles || 5)}>
          <div
            class={`relative aspect-square border-2 border-dashed rounded-lg cursor-pointer
              ${isDragActive() ? 'border-primary bg-primary/5' : 'border-gray-300'}
              hover:border-primary hover:bg-primary/5 transition-colors`}
            onClick={() => inputRef?.click()}
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
                const files = e.target.files
                if (files) handleFiles(files)
              }}
              class='hidden'
              multiple
              disabled={uploadingIndex() !== null}
            />
            <div class='absolute inset-0 flex flex-col items-center justify-center p-4'>
              <svg
                class='h-8 w-8 text-gray-400 mb-2'
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
              <p class='text-sm text-gray-600 text-center'>
                {isDragActive() ? 'Drop images here' : 'Click or drag images'}
              </p>
              <p class='text-xs text-gray-500 text-center mt-1'>
                {previews().length} / {props.maxFiles || 5} images
              </p>
              <p class='text-xs text-gray-500 text-center mt-0.5'>
                Up to {props.maxSize ? Math.floor(props.maxSize / 1024 / 1024) : 5}MB
              </p>
            </div>
          </div>
        </Show>
      </div>

      <Show when={uploadingIndex() !== null}>
        <div class='flex items-center justify-center space-x-2'>
          <Spinner class='w-4 h-4' />
          <span class='text-sm text-gray-500'>Uploading image {uploadingIndex()! + 1}...</span>
        </div>
      </Show>
    </div>
  )
}

export default MultipleImageUpload
