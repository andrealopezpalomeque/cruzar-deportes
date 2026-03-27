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
      return {
        original: response.data.url,
        main: response.data.main || response.data.url,
        thumbnail: response.data.thumbnail || response.data.url
      }
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
      return response.data.map(img => ({
        original: img.url,
        main: img.main || img.url,
        thumbnail: img.thumbnail || img.url
      }))
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

  return {
    compressImage,
    getFolderImages,
    uploadImage,
    uploadMultipleImages,
    deleteImage
  }
}
