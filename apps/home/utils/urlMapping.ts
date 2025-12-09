// URL mapping utility for converting local image paths to Cloudinary URLs
let urlMapping: Record<string, string> = {}
let isLoaded = false

/**
 * Load URL mapping from the migration file
 */
async function loadUrlMapping(): Promise<Record<string, string>> {
  if (!isLoaded) {
    try {
      // Always use fetch in browser/Nuxt context for better compatibility
      if (typeof window !== 'undefined' || typeof fetch !== 'undefined') {
        const response = await fetch('/scripts/url-mapping.json')
        urlMapping = await response.json()
      } else {
        // SSR context - try to load from file system
        try {
          // Dynamic import to avoid bundling fs/path in client
          const fs = await import('fs')
          const path = await import('path')
          const filePath = path.resolve(process.cwd(), 'scripts/url-mapping.json')
          const fileContent = fs.readFileSync(filePath, 'utf-8')
          urlMapping = JSON.parse(fileContent)
        } catch (fsError) {
          // Fallback: Use empty mapping for SSR builds
          console.warn('SSR: Could not load URL mapping, using fallback')
          urlMapping = {}
        }
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