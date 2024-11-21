// ~/db/schema/types.ts
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { stores, products } from '.'

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
