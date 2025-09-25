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

  // Get albums organized by category
  const getAlbumsByCategory = async (): Promise<Record<CategoryType, Album[]>> => {
    try {
      const folders = await getFolders()

      const albumsByCategory: Record<CategoryType, Album[]> = {
        afc: [],
        caf: [],
        eredivisie: [],
        lpf_afa: [],
        serie_a_enilive: [],
        national_retro: []
      }

      // Filter folders that match the category structure
      const categoryFolders = folders.filter(folder =>
        folder.path.startsWith('cruzar-deportes/') &&
        folder.path.split('/').length === 3 // cruzar-deportes/category/team
      )

      // Group folders by category
      for (const folder of categoryFolders) {
        const pathParts = folder.path.split('/')
        if (pathParts.length >= 3) {
          const category = pathParts[1] as CategoryType
          const teamName = pathParts[2]

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
      }

      return albumsByCategory
    } catch (error: any) {
      console.error('Error getting albums by category:', error)
      throw error
    }
  }

  // Get a single album by path
  const getAlbum = async (folderPath: string): Promise<Album> => {
    try {
      const images = await getFolderImages(folderPath)
      const pathParts = folderPath.split('/')
      const category = pathParts[1] as CategoryType
      const teamName = pathParts[2]

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
        isProcessed: false
      }
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

  return {
    getFolders,
    getFolderImages,
    getAlbumsByCategory,
    getAlbum,
    uploadImage,
    deleteImage,
    getOptimizedUrl,
    getThumbnailUrl
  }
}