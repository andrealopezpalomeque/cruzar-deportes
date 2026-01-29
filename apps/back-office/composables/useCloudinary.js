/**
 * Composable for managing Cloudinary images via external API
 *
 * Uses the external Cruzar API at https://cruzar-api.onrender.com
 * - Upload/Delete operations require x-api-key header
 * - URL transformations are done client-side (no API calls)
 *
 * TODO: Folder/image listing endpoints need to be added to external API
 */
export const useCloudinary = () => {
  const config = useRuntimeConfig()

  // Base URL for the external API
  const apiUrl = config.public.apiUrl

  // Simple in-memory cache with TTL
  const cache = new Map()
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  // Helper to get headers for authenticated requests
  const getAuthHeaders = () => {
    const headers = {}
    if (config.public.apiKey) {
      headers['x-api-key'] = config.public.apiKey
    }
    return headers
  }

  // Helper function to get cached data or fetch fresh
  const getCachedOrFetch = async (key, fetchFn) => {
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

  // ============================================
  // FOLDER/IMAGE LISTING (TODO: Need API endpoints)
  // ============================================

  // Get all folders (albums) from Cloudinary
  // TODO: Add GET /api/cloudinary/folders endpoint to external API
  const getFolders = async () => {
    console.warn('getFolders: This endpoint is not yet available in the external API')
    // Fallback to local API if still available, otherwise return empty
    try {
      const response = await $fetch('/api/cloudinary/folders')
      if (response.success && response.data) {
        return response.data
      }
    } catch {
      // Local API not available
    }
    return []
  }

  // Get all images in a specific folder
  // TODO: Add GET /api/cloudinary/images endpoint to external API
  const getFolderImages = async (folderPath) => {
    console.warn('getFolderImages: This endpoint is not yet available in the external API')
    // Fallback to local API if still available, otherwise return empty
    try {
      const response = await $fetch('/api/cloudinary/images', {
        query: { folder: folderPath }
      })
      if (response.success && response.data) {
        return response.data
      }
    } catch {
      // Local API not available
    }
    return []
  }

  // Get albums organized by category (optimized - no image loading)
  // TODO: Add GET /api/cloudinary/albums-summary endpoint to external API
  const getAlbumsByCategory = async (useCache = true) => {
    console.warn('getAlbumsByCategory: This endpoint is not yet available in the external API')

    const emptyResult = {
      afc: [],
      caf: [],
      eredivisie: [],
      lpf_afa: [],
      serie_a_enilive: [],
      national_retro: [],
      misc: []
    }

    try {
      if (!useCache) {
        clearCache()
      }

      return await getCachedOrFetch('albums-summary', async () => {
        // Fallback to local API if still available
        try {
          const response = await $fetch('/api/cloudinary/albums-summary')
          if (response.success && response.data) {
            const albumsByCategory = { ...emptyResult }

            for (const [category, summaries] of Object.entries(response.data)) {
              if (albumsByCategory[category]) {
                albumsByCategory[category] = summaries.map(summary => ({
                  name: summary.name,
                  path: summary.path,
                  category: summary.category,
                  images: [],
                  totalImages: summary.totalImages,
                  lastModified: summary.lastModified,
                  coverImage: summary.coverImage
                }))
              }
            }

            return albumsByCategory
          }
        } catch {
          // Local API not available
        }
        return emptyResult
      })
    } catch (error) {
      console.error('Error getting albums by category:', error)
      return emptyResult
    }
  }

  // Get albums organized by category (legacy - with full image loading)
  const getAlbumsByCategoryWithImages = async () => {
    const albumsByCategory = {
      afc: [],
      caf: [],
      eredivisie: [],
      lpf_afa: [],
      serie_a_enilive: [],
      national_retro: [],
      misc: []
    }

    try {
      const folders = await getFolders()

      const categoryFolders = folders.filter(folder =>
        folder.path.startsWith('cruzar-deportes/') &&
        (folder.path.split('/').length === 3 || folder.path.split('/').length === 4)
      )

      for (const folder of categoryFolders) {
        const pathParts = folder.path.split('/')
        let category
        let teamName

        if (pathParts.length === 4 && pathParts[1] === 'products') {
          category = pathParts[2]
          teamName = pathParts[3]
        } else if (pathParts.length === 3) {
          category = pathParts[1]
          teamName = pathParts[2]
        } else {
          continue
        }

        if (albumsByCategory[category] && teamName) {
          const images = await getFolderImages(folder.path)

          const album = {
            name: teamName,
            path: folder.path,
            category,
            images,
            totalImages: images.length,
            lastModified: images.length > 0
              ? new Date(Math.max(...images.map(img => new Date(img.created_at).getTime()))).toISOString()
              : new Date().toISOString()
          }

          albumsByCategory[category].push(album)
        }
      }

      return albumsByCategory
    } catch (error) {
      console.error('Error getting albums by category:', error)
      return albumsByCategory
    }
  }

  // Get a single album by path (with caching)
  const getAlbum = async (folderPath, useCache = true) => {
    try {
      return await getCachedOrFetch(`album-${folderPath}`, async () => {
        const images = await getFolderImages(folderPath)
        const pathParts = folderPath.split('/')

        let category
        let teamName

        if (pathParts.length === 4 && pathParts[1] === 'products') {
          category = pathParts[2]
          teamName = pathParts[3]
        } else if (pathParts.length === 3) {
          category = pathParts[1]
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
          coverImage: images.length > 0 ? images[0].secure_url : undefined
        }
      })
    } catch (error) {
      console.error('Error getting album:', error)
      throw error
    }
  }

  // ============================================
  // UPLOAD OPERATIONS (via external API)
  // ============================================

  // Upload single image to Cloudinary via external API
  const uploadImage = async (file, folder = 'cruzar-deportes/products') => {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const url = `${apiUrl}/api/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`

      const response = await $fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })

      if (response.success && response.data) {
        // Clear cache since we added a new image
        clearCache()
        return response.data.url
      } else {
        throw new Error(response.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  // Upload multiple images to Cloudinary via external API
  const uploadMultipleImages = async (files, folder = 'cruzar-deportes/products') => {
    try {
      const formData = new FormData()
      for (const file of files) {
        formData.append('images', file)
      }

      const url = `${apiUrl}/api/upload/multiple${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`

      const response = await $fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })

      if (response.success && response.data) {
        // Clear cache since we added new images
        clearCache()
        return response.data.map(img => img.url)
      } else {
        throw new Error(response.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading multiple images:', error)
      throw error
    }
  }

  // Delete image from Cloudinary via external API
  const deleteImage = async (publicId) => {
    try {
      // publicId may contain slashes (e.g., "cruzar-deportes/products/afc/image123")
      // The API uses a wildcard route, so we pass the full path
      const url = `${apiUrl}/api/upload/${publicId}`

      const response = await $fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.success) {
        // Clear cache since we deleted an image
        clearCache()
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  // ============================================
  // URL TRANSFORMATION UTILITIES (client-side only)
  // ============================================

  // Get optimized image URL (client-side URL manipulation)
  const getOptimizedUrl = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
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
  const getThumbnailUrl = (url, size = 300) => {
    return getOptimizedUrl(url, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    })
  }

  // ============================================
  // IMAGE SELECTION (TODO: May need external API endpoints)
  // ============================================

  // Save image selection for an album
  // TODO: Consider if this should be stored in product data instead
  const saveImageSelection = async (albumPath, selectedImages) => {
    try {
      const response = await $fetch('/api/images/selection', {
        method: 'POST',
        body: {
          albumPath,
          selectedImages
        }
      })

      return response.success
    } catch (error) {
      console.error('Error saving image selection:', error)
      return false
    }
  }

  // Load image selection for an album
  const loadImageSelection = async (albumPath) => {
    try {
      const response = await $fetch('/api/images/selection', {
        query: { albumPath }
      })

      return response.success && response.data ? response.data : []
    } catch (error) {
      console.error('Error loading image selection:', error)
      return []
    }
  }

  // Split album into multiple products
  const splitAlbum = async (
    albumPath,
    selectedImages,
    baseName,
    imagesPerProduct
  ) => {
    try {
      const response = await $fetch('/api/images/split', {
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
    } catch (error) {
      console.error('Error splitting album:', error)
      throw error
    }
  }

  return {
    // Folder/Album operations (TODO: need external API endpoints)
    getFolders,
    getFolderImages,
    getAlbumsByCategory,
    getAlbumsByCategoryWithImages,
    getAlbum,

    // Upload operations (via external API)
    uploadImage,
    uploadMultipleImages,
    deleteImage,

    // URL utilities (client-side)
    getOptimizedUrl,
    getThumbnailUrl,

    // Image selection (may need external API)
    saveImageSelection,
    loadImageSelection,
    splitAlbum,

    // Cache utilities
    clearCache
  }
}
