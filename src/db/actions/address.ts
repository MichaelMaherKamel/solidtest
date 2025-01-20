// ~/db/actions/address.ts
import { action } from '@solidjs/router'
import { eq, and, isNull } from 'drizzle-orm'
import { db } from '~/db'
import { addresses, type NewAddress } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'
import { getSession } from '~/db/actions/auth'

const ADDRESS_COOKIE = 'address-session'

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax' as const,
}

async function getAddressIdentifier(): Promise<{ userId: string | null; sessionId: string | null }> {
  'use server'
  try {
    // Try to get authenticated user session first
    const session = await getSession()
    if (session?.user?.id) {
      return { userId: session.user.id, sessionId: null }
    }

    // Fall back to guest session
    const event = getRequestEvent()!.nativeEvent
    let sessionId = getCookie(event, ADDRESS_COOKIE)

    if (!sessionId) {
      sessionId = secure()
      setCookie(event, ADDRESS_COOKIE, sessionId, COOKIE_OPTIONS)
    }

    return { userId: null, sessionId }
  } catch (error) {
    console.error('Error getting address identifier:', error)
    return { userId: null, sessionId: null }
  }
}

async function migrateGuestAddress(sessionId: string, userId: string) {
  'use server'
  try {
    // Find guest address with null userId
    const [guestAddress] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.sessionId, sessionId), isNull(addresses.userId)))

    if (guestAddress) {
      // Update the address with the user ID
      await db
        .update(addresses)
        .set({
          userId,
          sessionId: '',
          updatedAt: new Date(),
        })
        .where(eq(addresses.addressId, guestAddress.addressId))
    }
  } catch (error) {
    console.error('Error migrating guest address:', error)
  }
}

type AddressActionResult = { success: true; address: NewAddress } | { success: false; error: string }

export const createAddressAction = action(async (formData: FormData): Promise<AddressActionResult> => {
  'use server'
  try {
    const { userId, sessionId } = await getAddressIdentifier()

    if (!userId && !sessionId) {
      return { success: false, error: 'Authentication required' }
    }

    const newAddress: NewAddress = {
      sessionId: sessionId || '',
      userId: userId || null,
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      address: formData.get('address')?.toString() || '',
      buildingNumber: parseInt(formData.get('buildingNumber')?.toString() || '0'),
      floorNumber: parseInt(formData.get('floorNumber')?.toString() || '0'),
      flatNumber: parseInt(formData.get('flatNumber')?.toString() || '0'),
      city: 'Cairo',
      district: formData.get('district')?.toString() || '',
      country: 'Egypt',
    }

    // Validate required fields
    if (
      !newAddress.name ||
      !newAddress.email ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.buildingNumber ||
      !newAddress.floorNumber ||
      !newAddress.flatNumber ||
      !newAddress.district
    ) {
      return { success: false, error: 'All required fields must be filled' }
    }

    // Delete existing addresses based on user status
    if (userId) {
      await db.delete(addresses).where(eq(addresses.userId, userId))
    } else if (sessionId) {
      await db.delete(addresses).where(eq(addresses.sessionId, sessionId))
    }

    // Create new address
    const [createdAddress] = await db.insert(addresses).values(newAddress).returning()

    return { success: true, address: createdAddress }
  } catch (error) {
    console.error('Error creating address:', error)
    return { success: false, error: 'Failed to create address' }
  }
})

export const updateAddressAction = action(async (formData: FormData): Promise<AddressActionResult> => {
  'use server'
  try {
    const { userId, sessionId } = await getAddressIdentifier()

    if (!userId && !sessionId) {
      return { success: false, error: 'Authentication required' }
    }

    const updateData: Partial<NewAddress> = {
      name: formData.get('name')?.toString(),
      email: formData.get('email')?.toString(),
      phone: formData.get('phone')?.toString(),
      address: formData.get('address')?.toString(),
      buildingNumber: parseInt(formData.get('buildingNumber')?.toString() || '0'),
      floorNumber: parseInt(formData.get('floorNumber')?.toString() || '0'),
      flatNumber: parseInt(formData.get('flatNumber')?.toString() || '0'),
      district: formData.get('district')?.toString(),
      updatedAt: new Date(),
    }

    // Update existing address based on user status
    const whereClause = userId ? eq(addresses.userId, userId) : eq(addresses.sessionId, sessionId!)

    const [updatedAddress] = await db.update(addresses).set(updateData).where(whereClause).returning()

    if (!updatedAddress) {
      return { success: false, error: 'Address not found' }
    }

    return { success: true, address: updatedAddress }
  } catch (error) {
    console.error('Error updating address:', error)
    return { success: false, error: 'Failed to update address' }
  }
})
