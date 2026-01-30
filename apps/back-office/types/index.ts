// Category type (simple string for flexibility with external API)
export type CategoryType = string

// Base interfaces
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

// Back-office specific extensions
export interface BackofficeProduct extends Product {
  totalAvailableImages: number
  selectedImages: string[]
  stockStatus: 'in_stock' | 'available_on_order'
  lastModified: string
  isModified: boolean
}


export interface BulkOperation {
  type: 'price' | 'discount' | 'featured' | 'stock' | 'category'
  productIds: string[]
  value: any
  filters?: BulkOperationFilters
}

export interface BulkOperationFilters {
  category?: CategoryType[]
  priceRange?: { min: number; max: number }
  stockStatus?: ('in_stock' | 'available_on_order')[]
  featured?: boolean
}

export interface PriceUpdate {
  productId: string
  price: number
  originalPrice?: number
  discount?: number
}

export interface StockUpdate {
  productId: string
  inStock: boolean
  stockStatus: 'in_stock' | 'available_on_order'
}

export interface FeaturedUpdate {
  productId: string
  featured: boolean
}

// Authentication types
export interface AuthUser {
  username: string
  isAuthenticated: boolean
  loginTime: string
  sessionToken?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

// Dashboard statistics
export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  featuredProducts: number
  inStockProducts: number
  availableOnOrderProducts: number
  recentlyModified: number
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filter and search types
export interface ProductFilters {
  category?: CategoryType[]
  stockStatus?: ('in_stock' | 'available_on_order')[]
  featured?: boolean
  priceRange?: { min: number; max: number }
  hasDiscount?: boolean
  search?: string
}

export interface SortOptions {
  field: 'name' | 'price' | 'category' | 'lastModified' | 'featured'
  direction: 'asc' | 'desc'
}

// Form validation types
export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationRules {
  [field: string]: ValidationRule
}

export interface ValidationErrors {
  [field: string]: string
}

// UI State types
export interface UIState {
  loading: boolean
  error: string | null
  selectedItems: string[]
  bulkMode: boolean
  viewMode: 'grid' | 'list'
  filters: ProductFilters
  sort: SortOptions
}

// Toast notification types
export interface ToastNotification {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}
