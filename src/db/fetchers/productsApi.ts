import { query } from '@solidjs/router'
import { ProductCategory } from '~/db/schema'

export interface Product {
  id: number
  title: string
  price: number
  thumbnail: string
  description: string
  category: string
  images: string[]
}

interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

// Helper function to create an artificial delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getProducts = query(async (category?: ProductCategory) => {
  'use server'
  try {
    // Add artificial delay (e.g., 1.5 seconds)
    //await delay(3000)

    // If category is provided, fetch products for that category
    const url = category
      ? `https://dummyjson.com/products/category/${getApiCategory(category)}`
      : 'https://dummyjson.com/products'

    const response = await fetch(url)
    const data: ProductsResponse = await response.json()

    // Map the API products to our application structure
    return data.products.map((product) => ({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
      description: product.description,
      category: mapToAppCategory(product.category),
      images: product.images,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}, 'products')

// Helper function to map our app categories to API categories
const getApiCategory = (appCategory: ProductCategory): string => {
  const categoryMap: Record<ProductCategory, string[]> = {
    kitchensupplies: ['groceries', 'kitchen-accessories'],
    bathroomsupplies: ['beauty', 'fragrances', 'skin-care'],
    homesupplies: ['furniture', 'home-decoration', 'laptops', 'smartphones', 'mobile-accessories', 'tablets'],
  }

  // Return the first API category mapped to our app category
  return categoryMap[appCategory]?.[0] || 'home-decoration'
}

// Helper function to map API categories to our app categories
const mapToAppCategory = (apiCategory: string): ProductCategory => {
  const categoryMap: Record<string, ProductCategory> = {
    // Kitchen Supplies
    groceries: 'kitchensupplies',
    'kitchen-accessories': 'kitchensupplies',

    // Bathroom Supplies
    beauty: 'bathroomsupplies',
    fragrances: 'bathroomsupplies',
    'skin-care': 'bathroomsupplies',

    // Home Supplies
    furniture: 'homesupplies',
    'home-decoration': 'homesupplies',
    laptops: 'homesupplies',
    smartphones: 'homesupplies',
    'mobile-accessories': 'homesupplies',
    tablets: 'homesupplies',
    motorcycle: 'homesupplies',
    vehicle: 'homesupplies',

    // Map remaining categories to homesupplies
    'mens-shirts': 'homesupplies',
    'mens-shoes': 'homesupplies',
    'mens-watches': 'homesupplies',
    'womens-bags': 'homesupplies',
    'womens-dresses': 'homesupplies',
    'womens-jewellery': 'homesupplies',
    'womens-shoes': 'homesupplies',
    'womens-watches': 'homesupplies',
    'sports-accessories': 'homesupplies',
    sunglasses: 'homesupplies',
    tops: 'homesupplies',
  }

  return categoryMap[apiCategory] || 'homesupplies'
}
