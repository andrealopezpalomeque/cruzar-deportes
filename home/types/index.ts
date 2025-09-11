export type CategoryType = 'afc' | 'caf' | 'eredivisie' | 'lpf_afa' | 'serie_a_enilive' | 'national_retro'

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  category: CategoryType
  subcategory?: string
  images: string[]
  totalImages?: number
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  categoryId: string
  description?: string
  image?: string
}

export interface CartItem {
  productId: string
  quantity: number
  size: string
  color: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}