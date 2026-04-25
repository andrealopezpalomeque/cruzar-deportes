import type { ProductImage } from '~/types'

export function getImageUrl(
  image: ProductImage | string | undefined,
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string {
  if (!image) return ''
  return typeof image === 'string' ? image : (image[variant] || image.main || image.original || '')
}

export function getImageUrls(
  images: (ProductImage | string)[],
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string[] {
  return images.map(img => getImageUrl(img, variant)).filter(Boolean)
}

export function getFirstImageUrl(
  images: (ProductImage | string)[] | undefined,
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string {
  if (!images || images.length === 0) return ''
  return getImageUrl(images[0], variant)
}
