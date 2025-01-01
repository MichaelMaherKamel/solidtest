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

export interface SingleProductResponse {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
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

export const getProduct = query(async (id: string) => {
  'use server'
  try {
     //await delay(3000)

    const response = await fetch(`https://dummyjson.com/products/${id}`)
    if (!response.ok) {
      throw new Error('Product not found')
    }
    const product: SingleProductResponse = await response.json()

    return {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
      description: product.description,
      category: mapToAppCategory(product.category),
      images: product.images,
      stock: product.stock,
      rating: product.rating,
      brand: product.brand,
      discountPercentage: product.discountPercentage,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }
}, 'product')

// Helper function to map our app categories to API categories
const getApiCategory = (appCategory: ProductCategory): string => {
  const categoryMap: Record<ProductCategory, string[]> = {
    kitchensupplies: ['kitchen-accessories', 'groceries'],
    bathroomsupplies: ['home-decoration', 'skin-care', 'beauty', 'fragrances'],
    homesupplies: ['furniture', 'laptops', 'smartphones', 'mobile-accessories', 'tablets'],
  }

  return categoryMap[appCategory]?.[0] || 'furniture'
}

// Helper function to map API categories to our app categories
const mapToAppCategory = (apiCategory: string): ProductCategory => {
  const categoryMap: Record<string, ProductCategory> = {
    // Kitchen Supplies - Items related to cooking and food preparation
    'kitchen-accessories': 'kitchensupplies',
    groceries: 'kitchensupplies',

    // Bathroom Supplies - Items for decoration and personal care
    'home-decoration': 'bathroomsupplies',
    'skin-care': 'bathroomsupplies',
    beauty: 'bathroomsupplies',
    fragrances: 'bathroomsupplies',

    // Home Supplies - Furniture and electronics
    furniture: 'homesupplies',
    laptops: 'homesupplies',
    smartphones: 'homesupplies',
    'mobile-accessories': 'homesupplies',
    tablets: 'homesupplies',
    motorcycle: 'homesupplies',
    vehicle: 'homesupplies',

    // Clothing and accessories defaulting to home supplies
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
