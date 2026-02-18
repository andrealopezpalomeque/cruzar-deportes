/**
 * Composable for managing Cloudinary images via external API
 *
 * Uses the external Cruzar API for upload/delete operations (requires x-api-key header).
 * URL transformations are done client-side (no API calls).
 */
export const useCloudinary = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  const getAuthHeaders = () => {
    const headers = {}
    if (config.public.apiKey) {
      headers['x-api-key'] = config.public.apiKey
    }
    return headers
  }

  // ============================================
  // FOLDER/IMAGE LISTING
  // ============================================

  /**
   * Get all images in a specific Cloudinary folder
   * @param {string} folderPath - The Cloudinary folder path (e.g., 'cruzar-deportes/products/afc')
   * @returns {Promise<Array>} Array of image objects or empty array
   */
  const getFolderImages = async (folderPath) => {
    try {
      const response = await $fetch(`${apiUrl}/api/upload/folder-images`, {
        headers: getAuthHeaders(),
        query: { folder: folderPath }
      })
      if (response.success && response.data) {
        return response.data
      }
    } catch {
      // Endpoint may not exist yet - return empty
    }
    return []
  }

  // ============================================
  // CLIENT-SIDE COMPRESSION
  // ============================================

  const compressImage = (file, { maxSize = 1920, quality = 0.8 } = {}) => {
    if (file.size <= 2 * 1024 * 1024) return Promise.resolve(file)

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression failed'))
            const name = file.name.replace(/\.\w+$/, '.jpg')
            resolve(new File([blob], name, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // ============================================
  // UPLOAD OPERATIONS
  // ============================================

  /**
   * Upload a single image to Cloudinary
   * @param {File} file - The file to upload
   * @param {string} folder - Target Cloudinary folder
   * @returns {Promise<string>} The uploaded image URL
   */
  const uploadImage = async (file, folder = 'cruzar-deportes/products') => {
    const formData = new FormData()
    formData.append('image', file)

    const url = `${apiUrl}/api/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`

    const response = await $fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    })

    if (response.success && response.data) {
      return response.data.url
    }
    throw new Error(response.error || 'Upload failed')
  }

  /**
   * Upload multiple images to Cloudinary
   * @param {File[]} files - Array of files to upload
   * @param {string} folder - Target Cloudinary folder
   * @returns {Promise<string[]>} Array of uploaded image URLs
   */
  const uploadMultipleImages = async (files, folder = 'cruzar-deportes/products') => {
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
      return response.data.map(img => img.url)
    }
    throw new Error(response.error || 'Upload failed')
  }

  /**
   * Delete an image from Cloudinary
   * @param {string} publicId - The Cloudinary public ID (may contain slashes)
   * @returns {Promise<boolean>} Whether deletion succeeded
   */
  const deleteImage = async (publicId) => {
    try {
      const response = await $fetch(`${apiUrl}/api/upload/${publicId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      return response.success === true
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  // ============================================
  // URL TRANSFORMATION (client-side only)
  // ============================================

  /**
   * Get optimized image URL with Cloudinary transformations
   * @param {string} url - Original Cloudinary URL
   * @param {Object} options - Transformation options
   * @returns {string} Optimized URL
   */
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

    if (quality) transformations.push(`q_${quality}`)
    if (format) transformations.push(`f_${format}`)

    if (transformations.length === 0) {
      return url
    }

    const transformString = transformations.join('/')
    return url.replace('/upload/', `/upload/${transformString}/`)
  }

  /**
   * Get thumbnail URL with square crop
   * @param {string} url - Original Cloudinary URL
   * @param {number} size - Thumbnail size in pixels
   * @returns {string} Thumbnail URL
   */
  const getThumbnailUrl = (url, size = 300) => {
    return getOptimizedUrl(url, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    })
  }

  return {
    compressImage,
    getFolderImages,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    getOptimizedUrl,
    getThumbnailUrl
  }
}
