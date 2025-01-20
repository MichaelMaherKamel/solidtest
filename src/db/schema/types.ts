// ~/db/schema/types.ts
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { stores, products, cityEnum } from '.'

// Store Types
export type Store = InferSelectModel<typeof stores>
export type NewStore = InferInsertModel<typeof stores>

// Product Types
export type Product = InferSelectModel<typeof products>
export type NewProduct = InferInsertModel<typeof products>

// Color Variant Type
export type ColorVariant = {
  color:
    | 'red'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'purple'
    | 'pink'
    | 'white'
    | 'black'
    | 'gray'
    | 'brown'
    | 'gold'
    | 'silver'
    | 'beige'
    | 'navy'
    | 'turquoise'
    | 'olive'
    | 'indigo'
    | 'peach'
    | 'lavender'
  inventory: number
  colorImageUrls: string[]
}

// Product with First Color Type
export type ProductWithFirstColor = Omit<Product, 'colorVariants'> & {
  firstColor?: {
    color: ColorVariant['color']
    inventory: number
    imageUrl: string
  }
}

// Category Type
export type ProductCategory = 'kitchensupplies' | 'bathroomsupplies' | 'homesupplies'

// Featured Type
export type Featured = 'yes' | 'no'

// Shipping Related Types
export type City = (typeof cityEnum.enumValues)[number]

// Shipping zones definition
export const SHIPPING_ZONES = {
  CAIRO: ['Cairo'] as const,
  NEARBY: ['Giza', 'ShubraElKheima', 'Alexandria', 'PortSaid', 'Suez'] as const,
  DELTA: ['Mansoura', 'ElMahallaElKubra', 'Tanta', 'Damietta', 'Zagazig', 'Damanhur'] as const,
  OTHER: ['Luxor', 'Asyut', 'Ismailia', 'Faiyum', 'Aswan', 'Minya', 'BeniSuef', 'Hurghada'] as const,
} as const

// Define base shipping rates
const BASE_SHIPPING_RATES = {
  CAIRO_ZONE: 50,
  NEARBY_ZONE: 70,
  DELTA_ZONE: 85,
  OTHER_ZONE: 100,
} as const

// Export shipping rates
export type ShippingZone = keyof typeof SHIPPING_ZONES
export type ShippingRate = (typeof BASE_SHIPPING_RATES)[keyof typeof BASE_SHIPPING_RATES]

// Delivery estimate interface
export interface DeliveryEstimate {
  minDays: number
  maxDays: number
  rate: ShippingRate
}

// Delivery estimates for each zone
export const DELIVERY_ESTIMATES: Record<ShippingZone, DeliveryEstimate> = {
  CAIRO: { minDays: 1, maxDays: 2, rate: BASE_SHIPPING_RATES.CAIRO_ZONE },
  NEARBY: { minDays: 2, maxDays: 3, rate: BASE_SHIPPING_RATES.NEARBY_ZONE },
  DELTA: { minDays: 3, maxDays: 4, rate: BASE_SHIPPING_RATES.DELTA_ZONE },
  OTHER: { minDays: 4, maxDays: 5, rate: BASE_SHIPPING_RATES.OTHER_ZONE },
} as const
