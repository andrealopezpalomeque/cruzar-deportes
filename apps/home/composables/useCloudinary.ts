import { Cloudinary } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity'
import { quality } from '@cloudinary/url-gen/actions/delivery'
import { format } from '@cloudinary/url-gen/actions/delivery'

export const useCloudinary = () => {
  const config = useRuntimeConfig()
  const cloudName = config.public.cloudinaryCloudName

  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured')
  }

  const cld = new Cloudinary({
    cloud: {
      cloudName: cloudName || ''
    },
    url: {
      secure: true
    }
  })

  /**
   * Generate optimized image URL from Cloudinary
   * @param publicId - The public ID of the image in Cloudinary
   * @param options - Transformation options
   */
  const getImageUrl = (
    publicId: string,
    options?: {
      width?: number
      height?: number
      crop?: string
      quality?: number | string
      format?: string
    }
  ): string => {
    if (!publicId) return ''

    const image = cld.image(publicId)

    // Apply transformations
    if (options?.width || options?.height) {
      const resizeAction = fill()
      if (options.width) resizeAction.width(options.width)
      if (options.height) resizeAction.height(options.height)
      resizeAction.gravity(autoGravity())
      image.resize(resizeAction)
    }

    if (options?.quality) {
      image.delivery(quality(options.quality))
    }

    if (options?.format) {
      image.delivery(format(options.format))
    }

    return image.toURL()
  }

  /**
   * Generate responsive image URLs for different screen sizes
   */
  const getResponsiveUrls = (publicId: string) => {
    return {
      thumbnail: getImageUrl(publicId, { width: 200, height: 200, quality: 'auto' }),
      small: getImageUrl(publicId, { width: 400, quality: 'auto' }),
      medium: getImageUrl(publicId, { width: 800, quality: 'auto' }),
      large: getImageUrl(publicId, { width: 1200, quality: 'auto' }),
      original: getImageUrl(publicId, { quality: 'auto', format: 'auto' })
    }
  }

  return {
    cld,
    getImageUrl,
    getResponsiveUrls
  }
}
