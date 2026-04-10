/**
 * Transforms Cloudinary URLs to include delivery-time optimizations.
 *
 * Raw:  https://res.cloudinary.com/xxx/image/upload/w_800/v123/folder/img.jpg
 * Out:  https://res.cloudinary.com/xxx/image/upload/f_auto,q_auto,w_800/v123/folder/img.jpg
 */
export function useCloudinaryUrl() {
  function optimizedUrl(url: string, { width, height, crop = 'fill', quality = 'auto' }: {
    width?: number
    height?: number
    crop?: string
    quality?: string
  } = {}): string {
    if (!url || !url.includes('res.cloudinary.com')) return url

    if (url.includes('f_auto')) return url

    const baseTransforms = `f_auto,q_${quality}`
    const extraTransforms: string[] = []
    if (width) extraTransforms.push(`w_${width}`)
    if (height) extraTransforms.push(`h_${height}`)
    if ((width || height) && crop) extraTransforms.push(`c_${crop}`)

    const segment = [baseTransforms, ...extraTransforms].join(',')

    const uploadPrefix = '/upload/'
    const uploadIndex = url.indexOf(uploadPrefix)
    if (uploadIndex === -1) return url

    const afterUpload = url.substring(uploadIndex + uploadPrefix.length)

    if (/^[a-z]_/.test(afterUpload)) {
      return url.replace(uploadPrefix, `${uploadPrefix}f_auto,q_${quality},`)
    }

    return url.replace(uploadPrefix, `${uploadPrefix}${segment}/`)
  }

  return { optimizedUrl }
}
