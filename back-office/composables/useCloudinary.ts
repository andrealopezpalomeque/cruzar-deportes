import type { CloudinaryAsset, Album, CategoryType } from '~/types'

interface CloudinaryResponse {
  resources: CloudinaryAsset[]
  next_cursor?: string
  total_count: number
}

interface CloudinaryFolder {
  name: string
  path: string
}

export const useCloudinary = () => {
  const config = useRuntimeConfig()

  // Simple in-memory cache with TTL
  const cache = new Map<string, { data: any, timestamp: number }>()
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  // Get all folders (albums) from Cloudinary
  const getFolders = async (): Promise<CloudinaryFolder[]> => {
    try {
      const response = await $fetch<{
        success: boolean
        data?: CloudinaryFolder[]
        error?: string
      }>('/api/cloudinary/folders')

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch folders')
      }
    } catch (error: any) {
      console.error('Error fetching Cloudinary folders:', error)
      throw error
    }
  }

  // Get all images in a specific folder
  const getFolderImages = async (folderPath: string): Promise<CloudinaryAsset[]> => {
    try {
      const response = await $fetch<{
        success: boolean
        data?: CloudinaryAsset[]
        error?: string
      }>('/api/cloudinary/images', {
        query: { folder: folderPath }
      })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch folder images')
      }
    } catch (error: any) {
      console.error('Error fetching folder images:', error)
      throw error
    }
  }

  // Helper function to get cached data or fetch fresh
  const getCachedOrFetch = async <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
    const cached = cache.get(key)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return cached.data
    }

    const data = await fetchFn()
    cache.set(key, { data, timestamp: now })
    return data
  }

  // Clear cache (useful for refresh operations)
  const clearCache = () => {
    cache.clear()
  }

  // Get albums organized by category (optimized - no image loading)
  const getAlbumsByCategory = async (useCache: boolean = true): Promise<Record<CategoryType, Album[]>> => {
    try {
      if (!useCache) {
        clearCache()
      }

      return await getCachedOrFetch('albums-summary', async () => {
        const response = await $fetch<{
          success: boolean
          data?: Record<CategoryType, any[]>
          error?: string
        }>('/api/cloudinary/albums-summary')

        if (response.success && response.data) {
          // Convert summary data to Album format (without images initially)
          const albumsByCategory: Record<CategoryType, Album[]> = {
            afc: [],
            caf: [],
            eredivisie: [],
            lpf_afa: [],
            serie_a_enilive: [],
            national_retro: [],
            misc: []
          }

          for (const [category, summaries] of Object.entries(response.data)) {
            albumsByCategory[category as CategoryType] = summaries.map(summary => ({
              name: summary.name,
              path: summary.path,
              category: summary.category,
              images: [], // Empty initially - will be loaded on demand
              totalImages: summary.totalImages,
              lastModified: summary.lastModified,
              isProcessed: summary.isProcessed,
              coverImage: summary.coverImage
            }))
          }

          return albumsByCategory
        } else {
          throw new Error(response.error || 'Failed to fetch album summaries')
        }
      })
    } catch (error: any) {
      console.error('Error getting albums by category:', error)
      throw error
    }
  }

  // Get albums organized by category (legacy - with full image loading)
  const getAlbumsByCategoryWithImages = async (): Promise<Record<CategoryType, Album[]>> => {
    try {
      const folders = await getFolders()

      const albumsByCategory: Record<CategoryType, Album[]> = {
        afc: [],
        caf: [],
        eredivisie: [],
        lpf_afa: [],
        serie_a_enilive: [],
        national_retro: [],
        misc: []
      }

      // Filter folders that match either category structure
      const categoryFolders = folders.filter(folder =>
        folder.path.startsWith('cruzar-deportes/') &&
        (folder.path.split('/').length === 3 || folder.path.split('/').length === 4) // legacy or new structure
      )

      // Group folders by category
      for (const folder of categoryFolders) {
        const pathParts = folder.path.split('/')
        let category: CategoryType
        let teamName: string

        if (pathParts.length === 4 && pathParts[1] === 'products') {
          // New structure: cruzar-deportes/products/category/team
          category = pathParts[2] as CategoryType
          teamName = pathParts[3]
        } else if (pathParts.length === 3) {
          // Legacy structure: cruzar-deportes/category/team
          category = pathParts[1] as CategoryType
          teamName = pathParts[2]
        } else {
          continue // Skip invalid paths
        }

        if (albumsByCategory[category] && teamName) {
          // Get images for this folder
          const images = await getFolderImages(folder.path)

          const album: Album = {
            name: teamName,
            path: folder.path,
            category,
            images,
            totalImages: images.length,
            lastModified: images.length > 0
              ? new Date(Math.max(...images.map(img => new Date(img.created_at).getTime()))).toISOString()
              : new Date().toISOString(),
            isProcessed: false // We'll determine this based on product generation
          }

          albumsByCategory[category].push(album)
        }
      }

      return albumsByCategory
    } catch (error: any) {
      console.error('Error getting albums by category:', error)
      throw error
    }
  }

  // Get a single album by path (with caching)
  const getAlbum = async (folderPath: string, useCache: boolean = true): Promise<Album> => {
    try {
      return await getCachedOrFetch(`album-${folderPath}`, async () => {
        const images = await getFolderImages(folderPath)
        const pathParts = folderPath.split('/')

        let category: CategoryType
        let teamName: string

        if (pathParts.length === 4 && pathParts[1] === 'products') {
          // New structure: cruzar-deportes/products/category/team
          category = pathParts[2] as CategoryType
          teamName = pathParts[3]
        } else if (pathParts.length === 3) {
          // Legacy structure: cruzar-deportes/category/team
          category = pathParts[1] as CategoryType
          teamName = pathParts[2]
        } else {
          throw new Error('Invalid folder path structure')
        }

        if (!teamName) {
          throw new Error('Invalid folder path: team name not found')
        }

        return {
          name: teamName,
          path: folderPath,
          category,
          images,
          totalImages: images.length,
          lastModified: images.length > 0
            ? new Date(Math.max(...images.map(img => new Date(img.created_at).getTime()))).toISOString()
            : new Date().toISOString(),
          isProcessed: false,
          coverImage: images.length > 0 ? images[0].secure_url : undefined
        }
      })
    } catch (error: any) {
      console.error('Error getting album:', error)
      throw error
    }
  }

  // Upload image to Cloudinary
  const uploadImage = async (file: File, folder: string = 'general'): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await $fetch<{
        success: boolean
        data?: { secure_url: string }
        error?: string
      }>('/api/cloudinary/upload', {
        method: 'POST',
        body: formData
      })

      if (response.success && response.data) {
        return response.data.secure_url
      } else {
        throw new Error(response.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  // Delete image from Cloudinary
  const deleteImage = async (publicId: string): Promise<boolean> => {
    try {
      const response = await $fetch<{
        success: boolean
        error?: string
      }>('/api/cloudinary/delete', {
        method: 'POST',
        body: { publicId }
      })

      return response.success
    } catch (error: any) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  // Get optimized image URL
  const getOptimizedUrl = (
    url: string,
    options: {
      width?: number
      height?: number
      quality?: 'auto' | number
      format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
      crop?: 'fill' | 'fit' | 'crop' | 'scale'
    } = {}
  ): string => {
    if (!url.includes('cloudinary.com')) {
      return url
    }

    const {
      width,
      height,
      quality = 'auto',
      format = 'auto',
      crop = 'fit'
    } = options

    const transformations = []

    if (width || height) {
      const dimensions = []
      if (width) dimensions.push(`w_${width}`)
      if (height) dimensions.push(`h_${height}`)
      if (crop) dimensions.push(`c_${crop}`)
      transformations.push(dimensions.join(','))
    }

    if (quality) {
      transformations.push(`q_${quality}`)
    }

    if (format) {
      transformations.push(`f_${format}`)
    }

    if (transformations.length === 0) {
      return url
    }

    const transformString = transformations.join('/')
    return url.replace('/upload/', `/upload/${transformString}/`)
  }

  // Get thumbnail URL
  const getThumbnailUrl = (url: string, size: number = 300): string => {
    return getOptimizedUrl(url, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    })
  }

  // Save image selection for an album
  const saveImageSelection = async (albumPath: string, selectedImages: string[]): Promise<boolean> => {
    try {
      const response = await $fetch<{
        success: boolean
        error?: string
      }>('/api/images/selection', {
        method: 'POST',
        body: {
          albumPath,
          selectedImages
        }
      })

      return response.success
    } catch (error: any) {
      console.error('Error saving image selection:', error)
      return false
    }
  }

  // Load image selection for an album
  const loadImageSelection = async (albumPath: string): Promise<string[]> => {
    try {
      const response = await $fetch<{
        success: boolean
        data?: string[]
        error?: string
      }>('/api/images/selection', {
        query: { albumPath }
      })

      return response.success && response.data ? response.data : []
    } catch (error: any) {
      console.error('Error loading image selection:', error)
      return []
    }
  }

  // Split album into multiple products
  const splitAlbum = async (
    albumPath: string,
    selectedImages: string[],
    baseName: string,
    imagesPerProduct: number
  ): Promise<any[]> => {
    try {
      const response = await $fetch<{
        success: boolean
        data?: any[]
        error?: string
      }>('/api/images/split', {
        method: 'POST',
        body: {
          albumPath,
          selectedImages,
          baseName,
          imagesPerProduct
        }
      })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Split failed')
      }
    } catch (error: any) {
      console.error('Error splitting album:', error)
      throw error
    }
  }

  return {
    getFolders,
    getFolderImages,
    getAlbumsByCategory,
    getAlbumsByCategoryWithImages,
    getAlbum,
    uploadImage,
    deleteImage,
    getOptimizedUrl,
    getThumbnailUrl,
    saveImageSelection,
    loadImageSelection,
    splitAlbum,
    clearCache
  }
}