import { sql } from 'drizzle-orm'
import { pgTable, uuid, text, real, integer, jsonb, index, timestamp } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}

export const stores = pgTable('stores', {
  storeId: uuid('storeId').defaultRandom().primaryKey(),
  storeName: text('storeName').notNull(),
  storeImage: text('storeImage'),
  storePhone: text('storePhone'),
  storeAddress: text('storeAddress'),
  featured: text('featured', { enum: ['yes', 'no'] })
    .default('no')
    .notNull(),
  ...timestamps,
})

export const products = pgTable('products', {
  productId: uuid('productId').defaultRandom().primaryKey(),
  productName: text('productName').notNull(),
  productDescription: text('productDescription').notNull(),
  category: text('category', {
    enum: ['kitchensupplies', 'bathroomsupplies', 'homesupplies'],
  })
    .notNull()
    .default('kitchensupplies'),
  price: real('price').notNull(),
  storeId: uuid('storeId')
    .notNull()
    .references(() => stores.storeId, { onDelete: 'cascade' }),
  colorVariants: jsonb('colorVariants')
    .notNull()
    .$type<
      {
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
      }[]
    >()
    .default([]),
  ...timestamps,
})
