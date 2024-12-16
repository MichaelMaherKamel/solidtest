import { action } from '@solidjs/router'
import { supabase } from '~/lib/supabase/supabase'

export type SupabaseUploadResult = {
  success: boolean
  url?: string
  error?: string
}

export const supabaseUploadAction = action(async (formData: FormData): Promise<SupabaseUploadResult> => {
  'use server'
  try {
    const file = formData.get('file')
    const currentImageUrl = formData.get('currentImage')?.toString()
    const folder = formData.get('folder')?.toString() || 'products' // Allow specifying a folder

    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file provided' }
    }

    // If there's an existing image, delete it first
    if (currentImageUrl) {
      const oldFileName = currentImageUrl.split('/').pop()
      if (oldFileName) {
        await supabase.storage.from('SouqElRafay3Bucket').remove([`${folder}/${oldFileName}`])
      }
    }

    // Always create a new unique filename
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '')
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const fileName = `${folder}/${uniquePrefix}-${sanitizedFileName}`

    // Upload new file
    const { data, error } = await supabase.storage.from('SouqElRafay3Bucket').upload(fileName, file, {
      contentType: file.type,
      cacheControl: '3600',
    })

    if (error) {
      console.error('Supabase storage error:', error)
      return { success: false, error: 'Failed to upload file' }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('SouqElRafay3Bucket').getPublicUrl(data.path)

    return {
      success: true,
      url: publicUrl,
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: 'Failed to upload file',
    }
  }
}, 'supabase-upload')

// Helper function to delete multiple images
export const deleteProductImages = async (imageUrls: string[]) => {
  try {
    const filesToDelete = imageUrls.map(url => {
      const fileName = url.split('/').pop()
      return `products/${fileName}`
    })

    const { error } = await supabase.storage
      .from('SouqElRafay3Bucket')
      .remove(filesToDelete)

    if (error) {
      console.error('Error deleting images:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteProductImages:', error)
    return false
  }
}