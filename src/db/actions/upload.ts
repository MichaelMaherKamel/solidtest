// src/db/actions/upload.ts
import { action } from '@solidjs/router'
import { put } from '@vercel/blob'
import type { PutBlobResult } from '@vercel/blob'

export type UploadResult = {
  success: boolean
  data?: PutBlobResult
  error?: string
}

export const uploadFileAction = action(async (formData: FormData): Promise<UploadResult> => {
  'use server'
  try {
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file provided' }
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      contentType: file.type,
    })

    return {
      success: true,
      data: blob,
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: 'Failed to upload file',
    }
  }
})
