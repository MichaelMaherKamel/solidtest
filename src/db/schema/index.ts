import { AdapterAccountType } from '@auth/core/adapters'
import {
  pgTable,
  uuid,
  text,
  real,
  jsonb,
  index,
  timestamp,
  boolean,
  integer,
  primaryKey,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core'

// Shared timestamp columns for tables that need creation and update dates
const timestamps = {
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}

// Product-related types for form handling and operations
export type ColorVariant = {
  colorId: string
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
  isDefault: boolean
}

export type ProductFormData = {
  productName: string
  productDescription: string
  category: 'kitchensupplies' | 'bathroomsupplies' | 'homesupplies'
  price: number
  colorVariants: ColorVariant[]
}

// Enums
/////////////////////////////////////////////

export const cityEnum = pgEnum('city', [
  'Cairo',
  'Alexandria',
  'Giza',
  'ShubraElKheima',
  'PortSaid',
  'Suez',
  'Luxor',
  'Mansoura',
  'ElMahallaElKubra',
  'Tanta',
  'Asyut',
  'Ismailia',
  'Faiyum',
  'Zagazig',
  'Damietta',
  'Aswan',
  'Minya',
  'Damanhur',
  'BeniSuef',
  'Hurghada',
])
export const countryEnum = pgEnum('country', ['Egypt'])

// Authentication & User Management Tables
/////////////////////////////////////////////

/**
 * Users table - Stores user account information and profile data
 * Handles authentication and authorization through role-based access
 */
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

/**
 * Accounts table - Manages OAuth provider accounts linked to users
 * Supports multiple authentication providers per user
 */
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
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
)

/**
 * Sessions table - Manages active user sessions
 * Handles session-based authentication
 */
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

/**
 * Verification Tokens table - Manages email verification and password reset tokens
 */
export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({ columns: [verificationToken.identifier, verificationToken.token] }),
  })
)

/**
 * Authenticators table - Manages WebAuthn/passkey credentials
 */
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
    compositePK: primaryKey({ columns: [authenticator.userId, authenticator.credentialID] }),
  })
)

// E-commerce Tables
/////////////////////////////////////////////

/**
 * Stores table - Manages seller store information and settings
 * Links stores to users and handles store configuration
 */
export const stores = pgTable(
  'stores',
  {
    storeId: uuid('storeId').defaultRandom().primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    storeOwner: text('storeOwner').notNull(),
    storeName: text('storeName').notNull(),
    storeImage: text('storeImage'),
    storePhone: text('storePhone'),
    storeAddress: text('storeAddress'),
    featured: text('featured', { enum: ['yes', 'no'] })
      .default('no')
      .notNull(),
    subscription: text('subscription', { enum: ['basic', 'business', 'premium'] })
      .default('basic')
      .notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdIdx: index('store_user_id_idx').on(table.userId),
    featuredStoreIdx: index('store_featured_created_idx').on(table.featured, table.createdAt),
    storeNameIdx: index('store_name_idx').on(table.storeName),
    storeImageIdx: index('store_image_idx').on(table.storeImage),
    subscriptionIdx: index('store_subscription_idx').on(table.subscription),
  })
)

/**
 * Products table - Stores product information including variants and inventory
 * Manages product catalog for each store
 */
export const products = pgTable(
  'products',
  {
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
    totalInventory: integer('totalInventory').notNull().default(0),
    colorVariants: jsonb('colorVariants').notNull().$type<ColorVariant[]>().default([]),
    searchVector: text('searchVector'),
    ...timestamps,
  },
  (table) => ({
    nameIdx: index('product_name_idx').on(table.productName),
    categoryIdx: index('category_idx').on(table.category),
    storeIdIdx: index('product_store_id_idx').on(table.storeId),
    priceIdx: index('price_idx').on(table.price),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
    categoryStoreIdx: index('category_store_idx').on(table.category, table.storeId, table.createdAt),
    inventoryIdx: index('inventory_idx').on(table.totalInventory),
    colorVariantsIdx: index('color_variants_gin_idx').on(table.colorVariants),
    searchIdx: index('search_vector_idx').on(table.searchVector),
    categoryFilterIdx: index('category_filter_idx').on(table.category, table.totalInventory, table.price),
  })
)

/**
 * Addresses table - Manages shipping and billing addresses
 * Links addresses to users and sessions for guest checkout
 */

export const addresses = pgTable(
  'addresses',
  {
    addressId: uuid('addressId').defaultRandom().primaryKey(),
    sessionId: text('sessionId').notNull(),
    userId: varchar('userId', { length: 255 }),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    address: text('address').notNull(),
    buildingNumber: integer('buildingNumber').notNull(),
    floorNumber: integer('floorNumber').notNull(),
    flatNumber: integer('flatNumber').notNull(),
    city: cityEnum('city').default('Cairo').notNull(),
    district: varchar('district', { length: 255 }).notNull(),
    // postalCode: integer('postalCode'),
    country: countryEnum('country').default('Egypt').notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdIdx: index('address_user_id_idx').on(table.userId),
    sessionIdIdx: index('address_session_id_idx').on(table.sessionId),
  })
)

/**
 * Carts table - Manages shopping cart data
 * Tracks items, quantities, and session information
 */
export interface CartItem {
  productId: string
  quantity: number
  addedAt: string
  updatedAt: string
  price: number
  name: string
  image: string
}

export const carts = pgTable(
  'carts',
  {
    cartId: uuid('cartId').defaultRandom().primaryKey(),
    sessionId: text('sessionId').notNull(),
    items: jsonb('items').$type<CartItem[]>().default([]).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    lastActive: timestamp('lastActive').defaultNow().notNull(),
  },
  (table) => ({
    sessionIdx: index('cart_session_idx').on(table.sessionId),
    lastActiveIdx: index('cart_last_active_idx').on(table.lastActive),
  })
)

// Type Exports
/////////////////////////////////////////////

// User Types
export type User = typeof users.$inferSelect
export type Account = typeof accounts.$inferSelect
export type Session = typeof sessions.$inferSelect

// Store Types
export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert
export type StoreSubscription = 'basic' | 'business' | 'premium'
export type StoreFeatured = 'yes' | 'no'

// Product Types
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type ProductCategory = 'kitchensupplies' | 'bathroomsupplies' | 'homesupplies'
export type ProductColor = ColorVariant['color']

// Address Types
export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert

// Cart Types
export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert
