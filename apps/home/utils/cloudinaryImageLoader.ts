/**
 * Cloudinary Image Optimization Utilities
 * Provides responsive image generation and URL optimization for Cloudinary-hosted images
 */

export class CloudinaryImageLoader {
  private cloudName: string

  constructor() {
    try {
      const config = useRuntimeConfig()
      const publicConfig = (config && 'public' in config ? (config as any).public : {}) || {}
      this.cloudName = publicConfig.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME || 'dmb1vyveg'
    } catch (error) {
      // Fallback when useRuntimeConfig is not available (e.g., in server context)
      this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dmb1vyveg'
    }
  }

  /**
   * Check if a URL is a Cloudinary URL
   */
  isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com')
  }

  /**
   * Get fallback images when other methods fail
   */
  getFallbackImages(): string[] {
    return ['/images/cruzar-logo-1.png']
  }

  /**
   * Add cache-busting parameter to force browser refresh
   */
  private addCacheBuster(url: string): string {
    if (!url.includes('cloudinary.com')) {
      return url
    }

    const cacheBuster = 'v1758169200'
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}cb=${cacheBuster}`
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
    if (!this.isCloudinaryUrl(url)) {
      return url
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

    if (addCacheBuster) {
      optimizedUrl = this.addCacheBuster(optimizedUrl)
    }

    return optimizedUrl
  }

  /**
   * Generate responsive srcset for different screen densities and breakpoints
   */
  generateSrcSet(url: string, sizes: number[], options: {
    format?: 'webp' | 'avif' | 'auto'
    quality?: 'auto' | number
    crop?: 'fill' | 'fit' | 'limit' | 'thumb'
  } = {}): string {
    if (!this.isCloudinaryUrl(url)) {
      return url
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
    if (!this.isCloudinaryUrl(url)) {
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

    formats.forEach(format => {
      result[format] = {
        mobile: this.generateSrcSet(url, breakpoints.mobile, { format, quality, crop }),
        desktop: this.generateSrcSet(url, breakpoints.desktop, { format, quality, crop })
      }
    })

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
        mobile: [350, 525, 700],
        desktop: [400, 600, 800]
      },
      gallery: {
        mobile: [375, 563, 750],
        desktop: [600, 900, 1200]
      },
      thumbnail: {
        mobile: [64, 96, 128],
        desktop: [64, 96, 128]
      },
      logo: {
        mobile: [80, 120, 160],
        desktop: [100, 150, 200]
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
