// Shared types between back-office and main store
export type CategoryType =
  | 'afc'
  | 'caf'
  | 'eredivisie'
  | 'lpf_afa'
  | 'serie_a_enilive'
  | 'national_retro'
  | 'misc'

export interface SharedProduct {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  category: CategoryType
  subcategory?: string

  // Image management
  selectedImages: string[]          // Images chosen to display on store
  allAvailableImages: string[]      // All images from Cloudinary album
  cloudinaryFolderPath: string      // e.g., "cruzar-deportes/lpf_afa/boca"

  // Product attributes
  sizes: string[]
  colors: string[]
  inStock: boolean
  stockStatus: 'in_stock' | 'available_on_order'
  featured?: boolean

  // Metadata
  lastModified: string
  isProcessed: boolean              // Has been curated by admin
  createdAt: string
  createdBy: 'scraper' | 'admin'
}

export interface SharedCategory {
  id: CategoryType
  name: string
  slug: string
  description?: string
  productCount: number
  lastModified: string
}

export interface ImageSelection {
  productId: string
  albumPath: string
  selectedUrls: string[]
  allUrls: string[]
  selectionDate: string
}

export interface ProductDatabase {
  version: string
  lastUpdated: string
  products: Record<string, SharedProduct>
  categories: Record<CategoryType, SharedCategory>
  metadata: {
    totalProducts: number
    totalImages: number
    lastSync: string
  }
}
