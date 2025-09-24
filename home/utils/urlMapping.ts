// URL mapping utility for converting local image paths to Cloudinary URLs
let urlMapping: Record<string, string> = {}
let isLoaded = false

/**
 * Load URL mapping from the migration file
 */
async function loadUrlMapping(): Promise<Record<string, string>> {
  if (!isLoaded) {
    try {
      // Use dynamic import with JSON assertion for Node.js compatibility
      const { readFile } = await import('fs/promises')
      const { resolve } = await import('path')

      // In browser/Nuxt context, use fetch or import
      if (typeof window !== 'undefined') {
        const response = await fetch('/scripts/url-mapping.json')
        urlMapping = await response.json()
      } else {
        // In Node.js context, read file directly
        const filePath = resolve(process.cwd(), 'scripts/url-mapping.json')
        const fileContent = await readFile(filePath, 'utf-8')
        urlMapping = JSON.parse(fileContent)
      }
      isLoaded = true
    } catch (error) {
      console.warn('Could not load URL mapping:', error)
      urlMapping = {}
      isLoaded = true
    }
  }
  return urlMapping
}

/**
 * Map a local image URL to its Cloudinary equivalent
 */
export async function mapLocalUrlToCloudinary(localUrl: string): Promise<string> {
  const mapping = await loadUrlMapping()

  // Check if we have a direct mapping
  if (mapping[localUrl]) {
    return mapping[localUrl]
  }

  // If no mapping found, return the original URL
  return localUrl
}

/**
 * Check if a URL is a local static file
 */
export function isLocalStaticFile(url: string): boolean {
  return url.startsWith('/images/') && !url.includes('cloudinary.com')
}

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com')
}

/**
 * Get the mapped URL (Cloudinary if available, otherwise original)
 */
export async function getOptimalImageUrl(url: string): Promise<string> {
  if (isLocalStaticFile(url)) {
    return await mapLocalUrlToCloudinary(url)
  }
  return url
}