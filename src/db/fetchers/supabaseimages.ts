// src/db/fetchers/supabase-bucket.ts
import { supabase } from '~/lib/supabase/supabase'
import { cache } from '@solidjs/router'

export type BucketFile = {
  name: string
  url: string
  size: number
  createdAt: string
}

export type BucketResult = {
  files: BucketFile[]
  error?: string
}

// Use cache instead of action for data fetching
export const getBucketFiles = cache(async () => {
  'use server'

  try {
    const { data: files, error } = await supabase.storage.from('SouqElRafay3Bucket').list()

    if (error) {
      console.error('Error fetching bucket files:', error)
      return { files: [], error: 'Failed to fetch files' }
    }

    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const {
          data: { publicUrl },
        } = supabase.storage.from('SouqElRafay3Bucket').getPublicUrl(file.name)

        return {
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size || 0,
          createdAt: file.created_at || new Date().toISOString(),
        }
      })
    )

    return { files: filesWithUrls }
  } catch (error) {
    console.error('Error in getBucketFiles:', error)
    return { files: [], error: 'Failed to fetch bucket files' }
  }
}, 'bucket-files')
