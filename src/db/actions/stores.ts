import { action } from '@solidjs/router'
import { db } from '~/db'
import { stores } from '~/db/schema'

export type CreateStoreResult =
  | {
      success: true
      store: typeof stores.$inferSelect
    }
  | {
      success: false
      error: string
    }

export const createStoreAction = action(async (formData: FormData): Promise<CreateStoreResult> => {
  'use server'
  try {
    const storeName = formData.get('storeName') as string
    const storePhone = formData.get('storePhone') as string
    const storeAddress = formData.get('storeAddress') as string
    const storeImage = formData.get('storeImage') as string

    if (!storeName?.trim()) {
      return { success: false, error: 'Store name is required' }
    }

    const [store] = await db
      .insert(stores)
      .values({
        storeName: storeName.trim(),
        storeImage: storeImage || null,
        storePhone: storePhone?.trim() || null,
        storeAddress: storeAddress?.trim() || null,
      })
      .returning()

    return { success: true, store }
  } catch (error) {
    console.error('Error creating store:', error)
    return { success: false, error: 'Failed to create store' }
  }
})
