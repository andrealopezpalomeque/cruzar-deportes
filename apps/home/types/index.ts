export type CategoryType = string

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  category: CategoryType
  productType?: string
  league?: string
  subcategory?: string
  images: string[]
  totalImages?: number
  sizes: string[]
  inStock: boolean
  featured?: boolean
}

export interface ProductType {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
}

export interface League {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
  applicableTypes: string[]
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
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}
