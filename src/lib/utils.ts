// ~/lib/utils.ts
import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type CartItem } from '~/db/schema'
import type { City } from '~/db/schema/types'
import { SHIPPING_ZONES, DELIVERY_ESTIMATES } from '~/db/schema/types'

export const cn = (...classLists: ClassValue[]) => twMerge(clsx(classLists))

// Currency formatter helper
export const formatCurrency = (amount: number, currency = 'EGP') => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calculate shipping rate based on city
export const calculateShippingRate = (city: City): number => {
  if (SHIPPING_ZONES.CAIRO.includes(city as any)) {
    return DELIVERY_ESTIMATES.CAIRO.rate
  }
  if (SHIPPING_ZONES.NEARBY.includes(city as any)) {
    return DELIVERY_ESTIMATES.NEARBY.rate
  }
  if (SHIPPING_ZONES.DELTA.includes(city as any)) {
    return DELIVERY_ESTIMATES.DELTA.rate
  }
  return DELIVERY_ESTIMATES.OTHER.rate
}

// Calculate cart totals including shipping
export interface CartTotals {
  subtotal: number
  shipping: number
  total: number
}

export const calculateCartTotals = (items: CartItem[], city: City): CartTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = calculateShippingRate(city)

  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
  }
}

// Get delivery estimate for a city
export const getDeliveryEstimate = (city: City) => {
  let estimate = DELIVERY_ESTIMATES.OTHER

  if (SHIPPING_ZONES.CAIRO.includes(city as any)) {
    estimate = DELIVERY_ESTIMATES.CAIRO
  } else if (SHIPPING_ZONES.NEARBY.includes(city as any)) {
    estimate = DELIVERY_ESTIMATES.NEARBY
  } else if (SHIPPING_ZONES.DELTA.includes(city as any)) {
    estimate = DELIVERY_ESTIMATES.DELTA
  }

  return {
    ...estimate,
    formattedMessage: `${formatCurrency(estimate.rate)} - Delivery within ${estimate.minDays}-${
      estimate.maxDays
    } business days`,
  }
}
