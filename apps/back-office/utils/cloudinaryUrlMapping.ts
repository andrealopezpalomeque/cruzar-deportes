// URL mapping is no longer used - we now use the external API for images
// This file is kept for backwards compatibility but returns empty results
const cloudinaryUrlMapping: Record<string, string> = {}

/**
 * Get Cloudinary URL for a local image path
 */
export function getCloudinaryUrl(localPath: string): string | null {
  // Normalize the local path to match the mapping format
  const normalizedPath = localPath.startsWith('/') ? localPath : `/${localPath}`

  return cloudinaryUrlMapping[normalizedPath] || null
}

/**
 * Get all Cloudinary URLs for a team
 */
export function getTeamCloudinaryUrls(teamKey: string, category: string): string[] {
  const teamUrls: string[] = []

  // Search for all images matching the team pattern
  const teamPattern = `/images/${category}/${teamKey}/`

  for (const [localPath, cloudinaryUrl] of Object.entries(cloudinaryUrlMapping)) {
    if (localPath.startsWith(teamPattern)) {
      teamUrls.push(cloudinaryUrl)
    }
  }

  // Sort URLs to maintain consistent order
  return teamUrls.sort()
}

/**
 * Check if we have Cloudinary URLs available
 */
export function hasCloudinaryUrls(): boolean {
  return Object.keys(cloudinaryUrlMapping).length > 0
}

/**
 * Get total number of migrated images
 */
export function getMigratedImageCount(): number {
  return Object.keys(cloudinaryUrlMapping).length
}