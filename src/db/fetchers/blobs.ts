// src/db/fetchers/blobs.ts
import { list } from '@vercel/blob'
import type { ListBlobResult } from '@vercel/blob'
import { query } from '@solidjs/router'

export const listBlobs = query(async () => {
  'use server'

  try {
    const { blobs } = await list()
    return {
      success: true,
      blobs,
    }
  } catch (error) {
    console.error('Error listing blobs:', error)
    return {
      success: false,
      error: 'Failed to list images',
    }
  }
}, 'blobs')
