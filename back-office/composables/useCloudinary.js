export const useCloudinary = () => {
  const config = useRuntimeConfig()

  // Simple in-memory cache with TTL
  const cache = new Map()
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  // Get all folders (albums) from Cloudinary
  const getFolders = async () => {
    try {
      const response = await $fetch('/api/cloudinary/folders')

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch folders')
      }
    } catch (error) {
      console.error('Error fetching Cloudinary folders:', error)
      throw error
    }
  }

  // Get all images in a specific folder
  const getFolderImages = async (folderPath) => {
    try {
      const response = await $fetch('/api/cloudinary/images', {
        query: { folder: folderPath }
      })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch folder images')
      }
    } catch (error) {
      console.error('Error fetching folder images:', error)
      throw error
    }
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

  // Get albums organized by category (optimized - no image loading)
  const getAlbumsByCategory = async (useCache = true) => {
    try {
      if (!useCache) {
        clearCache()
      }

      return await getCachedOrFetch('albums-summary', async () => {
        const response = await $fetch('/api/cloudinary/albums-summary')

        if (response.success && response.data) {
          // Convert summary data to Album format (without images initially)
          const albumsByCategory = {
            afc: [],
            caf: [],
            eredivisie: [],
            lpf_afa: [],
            serie_a_enilive: [],
            national_retro: [],
            misc: []
          }

          for (const [category, summaries] of Object.entries(response.data)) {
            albumsByCategory[category] = summaries.map(summary => ({
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
    } catch (error) {
      console.error('Error getting albums by category:', error)
      throw error
    }
  }

  // Get albums organized by category (legacy - with full image loading)
  const getAlbumsByCategoryWithImages = async () => {
    try {
      const folders = await getFolders()

      const albumsByCategory = {
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
        let category
        let teamName

        if (pathParts.length === 4 && pathParts[1] === 'products') {
          // New structure: cruzar-deportes/products/category/team
          category = pathParts[2]
          teamName = pathParts[3]
        } else if (pathParts.length === 3) {
          // Legacy structure: cruzar-deportes/category/team
          category = pathParts[1]
          teamName = pathParts[2]
        } else {
          continue // Skip invalid paths
        }

        if (albumsByCategory[category] && teamName) {
          // Get images for this folder
          const images = await getFolderImages(folder.path)

          const album = {
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
    } catch (error) {
      console.error('Error getting albums by category:', error)
      throw error
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
          // New structure: cruzar-deportes/products/category/team
          category = pathParts[2]
          teamName = pathParts[3]
        } else if (pathParts.length === 3) {
          // Legacy structure: cruzar-deportes/category/team
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
          isProcessed: false,
          coverImage: images.length > 0 ? images[0].secure_url : undefined
        }
      })
    } catch (error) {
      console.error('Error getting album:', error)
      throw error
    }
  }

  // Upload image to Cloudinary
  const uploadImage = async (file, folder = 'general') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await $fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData
      })

      if (response.success && response.data) {
        return response.data.secure_url
      } else {
        throw new Error(response.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  // Delete image from Cloudinary
  const deleteImage = async (publicId) => {
    try {
      const response = await $fetch('/api/cloudinary/delete', {
        method: 'POST',
        body: { publicId }
      })

      return response.success
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  // Get optimized image URL
  const getOptimizedUrl = (url, options = {}) => {
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
  const getThumbnailUrl = (url, size = 300) => {
    return getOptimizedUrl(url, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    })
  }

  // Save image selection for an album
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
