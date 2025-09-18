import type { CategoryType } from '~/types'
import { getTeamCloudinaryUrls, hasCloudinaryUrls } from './cloudinaryUrlMapping'

// Environment-aware image loader for Cloudinary integration
export class CloudinaryImageLoader {
  private cloudName: string
  private useCloudinary: boolean

  constructor() {
    const config = useRuntimeConfig()
    this.cloudName = config.cloudinaryCloudName || ''
    // Use Cloudinary if we have the cloud name AND migrated URLs are available
    this.useCloudinary = !!this.cloudName && hasCloudinaryUrls()
  }

  /**
   * Get team images with Cloudinary optimization
   */
  async getTeamImages(teamKey: string, category: CategoryType): Promise<string[]> {
    if (this.useCloudinary) {
      return this.getCloudinaryImages(teamKey, category)
    } else {
      // Fallback to local images for development
      return this.getLocalImages(teamKey, category)
    }
  }

  /**
   * Get images from Cloudinary using the migrated URL mapping
   */
  private async getCloudinaryImages(teamKey: string, category: CategoryType): Promise<string[]> {
    try {
      // Get actual migrated URLs for this team
      const cloudinaryUrls = getTeamCloudinaryUrls(teamKey, category)

      if (cloudinaryUrls.length > 0) {
        // Return up to 5 images for product display, optimized for performance
        return cloudinaryUrls.slice(0, 5).map(url => {
          const optimizedUrl = this.getOptimizedUrl(url, { width: 800, quality: 'auto', format: 'auto' })
          // Add cache-busting parameter to force browser refresh
          return this.addCacheBuster(optimizedUrl)
        })
      }

      return this.getFallbackImages()
    } catch (error) {
      console.error(`Error getting Cloudinary images for ${teamKey}:`, error)
      return this.getFallbackImages()
    }
  }

  /**
   * Get local images for development
   */
  private async getLocalImages(teamKey: string, category: CategoryType): Promise<string[]> {
    try {
      // Import the existing imageManifest
      const { getTeamImagesFromManifest } = await import('./imageManifest')
      const images = getTeamImagesFromManifest(teamKey, category)

      if (images.length > 0) {
        return images
      }

      return this.getFallbackImages()
    } catch (error) {
      console.error(`Error loading local images for ${teamKey}:`, error)
      return this.getFallbackImages()
    }
  }

  /**
   * Get fallback images when other methods fail
   */
  private getFallbackImages(): string[] {
    if (this.useCloudinary) {
      return [`https://res.cloudinary.com/${this.cloudName}/image/upload/c_limit,w_800,q_auto,f_auto/cruzar-deportes/fallback/jersey-placeholder.jpg`]
    } else {
      return ['/images/cruzar-logo-1.png']
    }
  }

  /**
   * Get optimized thumbnail image
   */
  async getTeamThumbnail(teamKey: string, category: CategoryType): Promise<string> {
    const images = await this.getTeamImages(teamKey, category)
    const firstImage = images[0]

    if (this.useCloudinary && firstImage.includes('cloudinary.com')) {
      // Apply thumbnail optimization
      const thumbnailUrl = firstImage.replace('/upload/', '/upload/c_thumb,w_300,h_300,g_face/')
      return this.addCacheBuster(thumbnailUrl)
    }

    return firstImage
  }

  /**
   * Add cache-busting parameter to force browser refresh
   */
  private addCacheBuster(url: string): string {
    if (!url.includes('cloudinary.com')) {
      return url // Only add cache buster to Cloudinary URLs
    }

    // Use current deployment timestamp as cache buster
    const cacheBuster = 'v1758169200' // Updated: 2025-01-18 - Cache fix deployment
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}cb=${cacheBuster}`
  }

  /**
   * Get limited number of images
   */
  async getTeamImagesLimited(teamKey: string, category: CategoryType, limit: number): Promise<string[]> {
    const images = await this.getTeamImages(teamKey, category)
    return images.slice(0, limit)
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(url: string, options: {
    width?: number
    height?: number
    quality?: 'auto' | number
    format?: 'auto' | 'webp' | 'avif'
    crop?: 'fill' | 'fit' | 'thumb'
    addCacheBuster?: boolean
  } = {}): string {
    if (!this.useCloudinary || !url.includes('cloudinary.com')) {
      return url // Return original if not Cloudinary
    }

    const {
      width = 800,
      height,
      quality = 'auto',
      format = 'auto',
      crop = 'limit',
      addCacheBuster = false
    } = options

    const transformations = []

    if (crop) transformations.push(`c_${crop}`)
    if (width) transformations.push(`w_${width}`)
    if (height) transformations.push(`h_${height}`)
    if (quality) transformations.push(`q_${quality}`)
    if (format) transformations.push(`f_${format}`)

    const transformString = transformations.join(',')

    let optimizedUrl = url
    // Replace existing transformations or add new ones
    if (url.includes('/upload/')) {
      optimizedUrl = url.replace('/upload/', `/upload/${transformString}/`)
    }

    // Add cache buster if requested
    if (addCacheBuster) {
      optimizedUrl = this.addCacheBuster(optimizedUrl)
    }

    return optimizedUrl
  }
}

// Create singleton instance
let imageLoader: CloudinaryImageLoader

export function getImageLoader(): CloudinaryImageLoader {
  if (!imageLoader) {
    imageLoader = new CloudinaryImageLoader()
  }
  return imageLoader
}

// Convenience functions for backward compatibility
export async function getTeamImages(teamKey: string, category: CategoryType): Promise<string[]> {
  return getImageLoader().getTeamImages(teamKey, category)
}

export async function getTeamThumbnail(teamKey: string, category: CategoryType): Promise<string> {
  return getImageLoader().getTeamThumbnail(teamKey, category)
}

export async function getTeamImagesLimited(teamKey: string, category: CategoryType, limit: number): Promise<string[]> {
  return getImageLoader().getTeamImagesLimited(teamKey, category, limit)
}