import { action } from '@solidjs/router'
import { db } from '~/db'
import { users } from '~/db/schema'
import { eq } from 'drizzle-orm'

export const updateUserRoleAction = action(async (formData: FormData) => {
  'use server'
  try {
    const userId = formData.get('userId') as string
    const role = formData.get('role') as 'admin' | 'user' | 'seller'

    if (!userId || !role) {
      return { success: false, error: 'Missing required fields' }
    }

    const [updatedUser] = await db.update(users).set({ role }).where(eq(users.id, userId)).returning()

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}, 'updateUserRole')

export const deleteUserAction = action(async (formData: FormData) => {
  'use server'
  try {
    const userId = formData.get('userId') as string

    if (!userId) {
      return { success: false, error: 'User ID is required' }
    }

    await db.delete(users).where(eq(users.id, userId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}, 'deleteUser')
