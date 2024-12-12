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
    // console.log('Form data received:', Object.fromEntries(formData)) //For Debugging
    const userId = formData.get('userId')
    const storeOwner = formData.get('storeOwner')
    const storeName = formData.get('storeName')
    const storePhone = formData.get('storePhone')
    const storeAddress = formData.get('storeAddress')
    const storeImage = formData.get('storeImage')
    const subscription = formData.get('subscription') as 'basic' | 'business' | 'premium'

    if (!userId || !storeName || !storeImage || !subscription) {
      console.error('Missing required fields:', { userId, storeName, storeImage, subscription })
      return { success: false, error: 'Required fields are missing' }
    }

    // console.log('Attempting to insert store with values:', {
    //   userId: userId.toString(),
    //   storeOwner: storeOwner ? storeOwner.toString().trim() : '',
    //   storeName: storeName.toString().trim(),
    //   storeImage: storeImage.toString(),
    //   storePhone: storePhone ? storePhone.toString().trim() : null,
    //   storeAddress: storeAddress ? storeAddress.toString().trim() : null,
    //   subscription: subscription,
    //   featured: 'no',
    // }) ////For Debugging

    const [store] = await db
      .insert(stores)
      .values({
        userId: userId.toString(),
        storeOwner: storeOwner ? storeOwner.toString().trim() : '',
        storeName: storeName.toString().trim(),
        storeImage: storeImage.toString(),
        storePhone: storePhone ? storePhone.toString().trim() : null,
        storeAddress: storeAddress ? storeAddress.toString().trim() : null,
        subscription: subscription,
        featured: 'no',
      })
      .returning()

    return { success: true, store }
  } catch (error) {
    console.error('Error creating store:', error)
    return { success: false, error: 'Failed to create store' }
  }
})
