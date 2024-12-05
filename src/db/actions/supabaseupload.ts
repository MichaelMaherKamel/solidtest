import { action } from '@solidjs/router'
import { supabase } from '~/lib/supabase'

export type SupabaseUploadResult = {
  success: boolean
  url?: string
  error?: string
}

export const supabaseUploadAction = action(async (formData: FormData): Promise<SupabaseUploadResult> => {
  'use server'

  try {
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file provided' }
    }

    // Generate unique filename
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const fileName = `${uniquePrefix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from('SouqElRafay3Bucket').upload(fileName, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
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
}, 'supabase-upload') // Add a unique name for the action
