import type { CategoryType } from '~/types'
import { imageManifest, getTeamImagesFromManifest } from './imageManifest'

// Simple and efficient image loader using pre-generated manifest
export async function getTeamImages(teamKey: string, category: CategoryType): Promise<string[]> {
  try {
    // Get images from the manifest
    const images = getTeamImagesFromManifest(teamKey, category)
    
    // Return images or fallback to placeholder
    if (images.length > 0) {
      return images
    }
    
    // Fallback to placeholder image if no images found
    console.warn(`No images found for ${teamKey} in ${category}`)
    return ['/images/cruzar-logo-1.png']
    
  } catch (error) {
    console.error(`Error loading images for ${teamKey}:`, error)
    return ['/images/cruzar-logo-1.png']
  }
}

// Helper function to get just the first image (for thumbnails)
export async function getTeamThumbnail(teamKey: string, category: CategoryType): Promise<string> {
  const images = await getTeamImages(teamKey, category)
  return images[0] || '/images/cruzar-logo-1.png'
}

// Helper function to get a specific number of images
export async function getTeamImagesLimited(teamKey: string, category: CategoryType, limit: number): Promise<string[]> {
  const images = await getTeamImages(teamKey, category)
  return images.slice(0, limit)
}