export const useCloudinary = () => {
  const config = useRuntimeConfig()

  const uploadImage = async (file: File, folder: string = 'general'): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', `cruzar-deportes/${folder}`)
      formData.append('cloud_name', config.cloudinaryCloudName)
      formData.append('upload_preset', 'unsigned_preset') // You'll need to create this in Cloudinary

      const response = await $fetch<{
        secure_url: string
        public_id: string
        format: string
      }>(`https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`, {
        method: 'POST',
        body: formData
      })

      return response.secure_url
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      throw new Error('Failed to upload image to Cloudinary')
    }
  }

  const uploadImages = async (files: File[], folder: string = 'general'): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadImage(file, folder))
    return Promise.all(uploadPromises)
  }

  const uploadProductImages = async (
    files: File[],
    productSlug: string,
    category: string
  ): Promise<string[]> => {
    const folder = `products/${category}/${productSlug}`
    return uploadImages(files, folder)
  }

  const deleteImage = async (publicId: string): Promise<void> => {
    try {
      // This requires server-side implementation for security
      // For now, we'll just handle this through the Cloudinary dashboard
      await $fetch('/api/cloudinary/delete', {
        method: 'POST',
        body: { publicId }
      })
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error)
      throw new Error('Failed to delete image from Cloudinary')
    }
  }

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
      return url // Return original URL if not a Cloudinary URL
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

    // Insert transformations into Cloudinary URL
    const transformString = transformations.join('/')
    return url.replace('/upload/', `/upload/${transformString}/`)
  }

  const getImageInfo = (url: string) => {
    if (!url.includes('cloudinary.com')) {
      return null
    }

    const matches = url.match(/\/([^\/]+)\/([^\/]+)\.(jpg|jpeg|png|gif|webp)/)
    if (!matches) return null

    return {
      folder: matches[1],
      filename: matches[2],
      format: matches[3]
    }
  }

  return {
    uploadImage,
    uploadImages,
    uploadProductImages,
    deleteImage,
    getOptimizedUrl,
    getImageInfo
  }
}