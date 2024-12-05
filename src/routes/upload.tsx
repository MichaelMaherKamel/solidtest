import { Component } from 'solid-js'
import { FileUpload } from '~/components/FileUpload'

const UploadPage: Component = () => {
  const handleUploadSuccess = (url: string) => {
    console.log('File uploaded successfully:', url)
    // Handle the successful upload, e.g., save URL to database
  }

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
    // Handle the error appropriately
  }

  return (
    <div class='max-w-2xl mx-auto p-6'>
      <h1 class='text-2xl font-bold mb-6'>File Upload</h1>
      <FileUpload
        accept='image/*'
        maxSize={5 * 1024 * 1024}
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />
    </div>
  )
}

export default UploadPage
