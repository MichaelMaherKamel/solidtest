import { AdapterAccountType } from '@auth/core/adapters'
import { pgTable, uuid, text, real, jsonb, index, timestamp, boolean, integer, primaryKey } from 'drizzle-orm/pg-core'

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

export const users = pgTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    role: text('role', { enum: ['admin', 'user', 'seller'] })
      .default('user')
      .notNull(),
    image: text('image'),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.id),
    userRoleIdx: index('user_role_idx').on(table.role),
    emailIdx: index('user_email_idx').on(table.email),
  })
)

export type User = typeof users.$inferSelect

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

///////////////////////////////////////////////////////////////////////////////

export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
