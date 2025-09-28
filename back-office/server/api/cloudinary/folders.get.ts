import { v2 as cloudinary } from 'cloudinary'
import type { ApiResponse } from '~/types'
import { requireSession } from '../../utils/session'

interface CloudinaryFolder {
  name: string
  path: string
}

export default defineEventHandler(async (event): Promise<ApiResponse<CloudinaryFolder[]>> => {
  try {
    // Validate session
    requireSession(event)

    // Configure Cloudinary
    const config = useRuntimeConfig()
    cloudinary.config({
      cloud_name: config.public.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })

    // Get folders from Cloudinary
    const result = await cloudinary.api.sub_folders('cruzar-deportes')

    const folders: CloudinaryFolder[] = []

    // Process main folders (should include both 'products' and direct category folders)
    if (result.folders) {
      for (const mainFolder of result.folders) {
        try {
          if (mainFolder.name === 'products') {
            // Handle products structure: cruzar-deportes/products/category/team
            const categoriesResult = await cloudinary.api.sub_folders(`cruzar-deportes/products`)

            if (categoriesResult.folders) {
              for (const categoryFolder of categoriesResult.folders) {
                try {
                  const teamsResult = await cloudinary.api.sub_folders(`cruzar-deportes/products/${categoryFolder.name}`)

                  if (teamsResult.folders) {
                    for (const teamFolder of teamsResult.folders) {
                      folders.push({
                        name: teamFolder.name,
                        path: `cruzar-deportes/products/${categoryFolder.name}/${teamFolder.name}`
                      })
                    }
                  }
                } catch (teamError) {
                  console.warn(`Error getting team folders for products/${categoryFolder.name}:`, teamError)
                }
              }
            }
          } else {
            // Handle direct category structure: cruzar-deportes/category/team (legacy)
            const subResult = await cloudinary.api.sub_folders(`cruzar-deportes/${mainFolder.name}`)

            if (subResult.folders) {
              for (const teamFolder of subResult.folders) {
                folders.push({
                  name: teamFolder.name,
                  path: `cruzar-deportes/${mainFolder.name}/${teamFolder.name}`
                })
              }
            }
          }
        } catch (subError) {
          console.warn(`Error getting subfolders for ${mainFolder.name}:`, subError)
        }
      }
    }

    return {
      success: true,
      data: folders,
      message: 'Folders retrieved successfully'
    }
  } catch (error: any) {
    console.error('Cloudinary folders error:', error)

    return {
      success: false,
      error: error.message || 'Failed to retrieve folders'
    }
  }
})
