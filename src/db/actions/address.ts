import { action } from '@solidjs/router'
import { eq, and, isNull } from 'drizzle-orm'
import { db } from '~/db'
import { addresses, type NewAddress } from '~/db/schema'
import { getCookie, setCookie } from 'vinxi/http'
import { getRequestEvent } from 'solid-js/web'
import { v4 as secure } from '@lukeed/uuid/secure'
import { getSession } from '~/db/actions/auth'

const ADDRESS_COOKIE = 'address-session'

// Dynamically determine if the request is over HTTPS
function isSecureRequest(event: any): boolean {
  const protocol = event.node.req.headers['x-forwarded-proto'] || event.node.req.protocol
  return protocol === 'https'
}

async function getAddressIdentifier(): Promise<{ type: 'user' | 'guest'; id: string }> {
  'use server'
  try {
    // Check for authenticated session first
    const session = await getSession()

    if (session?.user?.id) {
      return { type: 'user', id: session.user.id }
    }

    // Handle guest session
    const event = getRequestEvent()!.nativeEvent
    let sessionId = getCookie(event, ADDRESS_COOKIE)

    if (!sessionId) {
      sessionId = secure()
      setCookie(event, ADDRESS_COOKIE, sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: isSecureRequest(event), // Set dynamically based on the request protocol
        path: '/',
        sameSite: 'lax',
      })
    }

    return { type: 'guest', id: sessionId }
  } catch (error) {
    console.error('Error getting address identifier:', error)
    throw new Error('Failed to get address identifier')
  }
}

type AddressActionResult = { success: true; address: NewAddress } | { success: false; error: string }

export const createAddressAction = action(async (formData: FormData): Promise<AddressActionResult> => {
  'use server'
  try {
    const identifier = await getAddressIdentifier()

    const newAddress: NewAddress = {
      // For user sessions: empty sessionId, valid userId
      // For guest sessions: valid sessionId, null userId
      sessionId: identifier.type === 'guest' ? identifier.id : '',
      userId: identifier.type === 'user' ? identifier.id : null,
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

    // Delete existing address based on strict type separation
    if (identifier.type === 'user') {
      await db.delete(addresses).where(
        and(
          eq(addresses.userId, identifier.id),
          isNull(addresses.sessionId) // Ensure we only delete user addresses
        )
      )
    } else {
      await db.delete(addresses).where(
        and(
          eq(addresses.sessionId, identifier.id),
          isNull(addresses.userId) // Ensure we only delete guest addresses
        )
      )
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
    const identifier = await getAddressIdentifier()

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

    // Update with strict type separation
    const whereClause =
      identifier.type === 'user'
        ? and(eq(addresses.userId, identifier.id), isNull(addresses.sessionId))
        : and(eq(addresses.sessionId, identifier.id), isNull(addresses.userId))

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

export async function getAddress() {
  'use server'
  try {
    const identifier = await getAddressIdentifier()

    // If the user is authenticated, fetch the address associated with their userId
    if (identifier.type === 'user') {
      const [address] = await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.userId, identifier.id), isNull(addresses.sessionId)))
        .limit(1)
      return address || null
    }

    // If the user is a guest, fetch the address associated with their sessionId
    if (identifier.type === 'guest') {
      const [address] = await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.sessionId, identifier.id), isNull(addresses.userId)))
        .limit(1)
      return address || null
    }

    // If neither authenticated nor guest, return null
    return null
  } catch (error) {
    console.error('Error fetching address:', error)
    return null
  }
}
