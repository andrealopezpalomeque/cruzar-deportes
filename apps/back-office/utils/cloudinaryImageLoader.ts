import type { CategoryType } from '~/types'
import { getTeamCloudinaryUrls, hasCloudinaryUrls, getMigratedImageCount } from './cloudinaryUrlMapping'

// Environment-aware image loader for Cloudinary integration
export class CloudinaryImageLoader {
  private cloudName: string
  private useCloudinary: boolean

  constructor() {
    try {
      const config = useRuntimeConfig()
      this.cloudName = config.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME || 'dmb1vyveg'
    } catch (error) {
      // Fallback when useRuntimeConfig is not available (e.g., in server context)
      this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dmb1vyveg'
    }

    // Use Cloudinary if we have the cloud name AND migrated URLs are available
    this.useCloudinary = !!this.cloudName && hasCloudinaryUrls()

    // CloudinaryImageLoader initialized successfully
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
      // Get actual migrated URLs for this team from the mapping
      const cloudinaryUrls = getTeamCloudinaryUrls(teamKey, category)

      if (cloudinaryUrls.length > 0) {
        // Return the raw Cloudinary URLs - these are already uploaded and valid
        // DO NOT apply transformations or modifications - use URLs as-is from mapping
        return cloudinaryUrls
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
      return this.getOptimizedUrl(firstImage, {
        width: 300,
        height: 300,
        crop: 'thumb',
        gravity: 'face',
        addCacheBuster: true
      })
    }

    return firstImage
  }

  /**
   * Ensure URL has an image extension for storefront validation
   */
  private ensureImageExtension(url: string): string {
    if (!url.includes('cloudinary.com')) {
      return url
    }

    // Check if URL already has an image extension
    const extensionRegex = /\.(jpe?g|png|webp|avif|gif|bmp|tiff)(\?|$)/i
    if (extensionRegex.test(url)) {
      return url
    }

    // Add .jpg extension before query params or at the end
    const queryIndex = url.indexOf('?')
    if (queryIndex !== -1) {
      return url.slice(0, queryIndex) + '.jpg' + url.slice(queryIndex)
    }
    return url + '.jpg'
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
    crop?: 'fill' | 'fit' | 'limit' | 'thumb'
    gravity?: string
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
      gravity,
      addCacheBuster = false
    } = options

    const transformations = []

    if (crop) transformations.push(`c_${crop}`)
    if (width) transformations.push(`w_${width}`)
    if (height) transformations.push(`h_${height}`)
    if (quality) transformations.push(`q_${quality}`)
    if (format) transformations.push(`f_${format}`)
    if (gravity) transformations.push(`g_${gravity}`)

    const transformString = transformations.join(',')

    const uploadSegment = '/upload/'
    const uploadIndex = url.indexOf(uploadSegment)

    if (uploadIndex === -1 || !transformString) {
      return addCacheBuster ? this.addCacheBuster(url) : url
    }

    const prefix = url.slice(0, uploadIndex + uploadSegment.length)
    const suffix = url.slice(uploadIndex + uploadSegment.length)
    const suffixParts = suffix.split('/')

    const isTransformationSegment = (segment: string | undefined): boolean => {
      if (!segment) return false
      const tokens = segment.split(',')
      if (tokens.length === 0) return false
      return tokens.every(token => /^[a-zA-Z0-9-]+_[^/]+$/.test(token))
    }

    const isVersionSegment = (segment: string | undefined): boolean => {
      return !!segment && /^v\d+$/.test(segment)
    }

    let index = 0
    while (index < suffixParts.length && isTransformationSegment(suffixParts[index])) {
      index++
    }

    const versionSegment = isVersionSegment(suffixParts[index]) ? suffixParts[index] : undefined
    if (versionSegment) {
      index++
    }

    const normalizedSuffix = suffixParts.slice(index).join('/')
    const versionPrefix = versionSegment ? `${versionSegment}/` : ''

    if (!normalizedSuffix) {
      return addCacheBuster ? this.addCacheBuster(url) : url
    }

    let optimizedUrl = `${prefix}${transformString}/${versionPrefix}${normalizedSuffix}`

    // Add cache buster if requested
    if (addCacheBuster) {
      optimizedUrl = this.addCacheBuster(optimizedUrl)
    }

    return optimizedUrl
  }

  /**
   * Generate responsive srcset for different screen densities and breakpoints
   */
  generateSrcSet(url: string, sizes: number[], options: {
    format?: 'webp' | 'avif' | 'auto' | 'jpeg'
    quality?: 'auto' | number
    crop?: 'fill' | 'fit' | 'limit' | 'thumb'
  } = {}): string {
    if (!this.useCloudinary || !url.includes('cloudinary.com')) {
      return url // Return original if not Cloudinary
    }

    const {
      format = 'auto',
      quality = 'auto',
      crop = 'limit'
    } = options

    return sizes.map(width => {
      const optimizedUrl = this.getOptimizedUrl(url, {
        width,
        format,
        quality,
        crop,
        addCacheBuster: true
      })
      return `${optimizedUrl} ${width}w`
    }).join(', ')
  }

  /**
   * Generate responsive image data for picture element
   */
  generateResponsiveImageData(url: string, breakpoints: {
    mobile: number[]
    desktop: number[]
  }, options: {
    quality?: 'auto' | number
    crop?: 'fill' | 'fit' | 'limit' | 'thumb'
    formats?: ('webp' | 'avif' | 'jpeg')[]
  } = {}) {
    if (!this.useCloudinary || !url.includes('cloudinary.com')) {
      return {
        webp: { mobile: url, desktop: url },
        avif: { mobile: url, desktop: url },
        jpeg: { mobile: url, desktop: url },
        fallback: url
      }
    }

    const {
      quality = 'auto',
      crop = 'limit',
      formats = ['webp', 'avif', 'jpeg']
    } = options

    const result: any = {}

    // Generate sources for each format
    formats.forEach(format => {
      result[format] = {
        mobile: this.generateSrcSet(url, breakpoints.mobile, { format, quality, crop }),
        desktop: this.generateSrcSet(url, breakpoints.desktop, { format, quality, crop })
      }
    })

    // Fallback image (usually the smallest desktop size)
    result.fallback = this.getOptimizedUrl(url, {
      width: Math.min(...breakpoints.desktop),
      format: 'auto',
      quality,
      crop,
      addCacheBuster: true
    })

    return result
  }

  /**
   * Get breakpoints for different use cases
   */
  getBreakpoints() {
    return {
      productCard: {
        mobile: [350, 525, 700],    // 1x, 1.5x, 2x for ~350px container
        desktop: [400, 600, 800]    // 1x, 1.5x, 2x for ~400px container
      },
      gallery: {
        mobile: [375, 563, 750],    // 1x, 1.5x, 2x for ~375px container
        desktop: [600, 900, 1200]   // 1x, 1.5x, 2x for ~600px container
      },
      thumbnail: {
        mobile: [64, 96, 128],      // 1x, 1.5x, 2x for 64px thumbnails
        desktop: [64, 96, 128]      // Same sizes for thumbnails
      },
      logo: {
        mobile: [80, 120, 160],     // 1x, 1.5x, 2x for ~80px logos
        desktop: [100, 150, 200]    // 1x, 1.5x, 2x for ~100px logos
      }
    }
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
