import type { ProductImage } from '~/types'

const CLOUDINARY_OPTIMIZATIONS = 'f_auto,q_auto'

function applyCloudinaryOptimizations(url: string): string {
  if (!url || !url.includes('res.cloudinary.com') || url.includes('f_auto')) return url
  return url.replace('/upload/', `/upload/${CLOUDINARY_OPTIMIZATIONS},`)
}

/**
 * Extract the display URL from a product image entry.
 * Handles both legacy string URLs and new {original, main, thumbnail} objects.
 * Automatically applies f_auto,q_auto Cloudinary optimizations.
 */
export function getImageUrl(
  image: ProductImage | string | undefined,
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string {
  if (!image) return ''
  const raw = typeof image === 'string' ? image : (image[variant] || image.main || image.original || '')
  return applyCloudinaryOptimizations(raw)
}

/**
 * Extract display URLs from a product images array.
 * Returns an array of URL strings for the given variant.
 */
export function getImageUrls(
  images: (ProductImage | string)[],
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string[] {
  return images.map(img => getImageUrl(img, variant)).filter(Boolean)
}

/**
 * Get the first image URL from a product's images array.
 */
export function getFirstImageUrl(
  images: (ProductImage | string)[] | undefined,
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string {
  if (!images || images.length === 0) return ''
  return getImageUrl(images[0], variant)
}
