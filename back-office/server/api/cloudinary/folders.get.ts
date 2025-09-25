import { v2 as cloudinary } from 'cloudinary'
import type { ApiResponse } from '~/types'

interface CloudinaryFolder {
  name: string
  path: string
}

export default defineEventHandler(async (event): Promise<ApiResponse<CloudinaryFolder[]>> => {
  try {
    // Validate session
    const sessionToken = getCookie(event, 'backoffice_session')
    if (!sessionToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

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

    // Process main category folders
    if (result.folders) {
      for (const categoryFolder of result.folders) {
        try {
          // Get subfolders (team folders) within each category
          const subResult = await cloudinary.api.sub_folders(`cruzar-deportes/${categoryFolder.name}`)

          if (subResult.folders) {
            for (const teamFolder of subResult.folders) {
              folders.push({
                name: teamFolder.name,
                path: `cruzar-deportes/${categoryFolder.name}/${teamFolder.name}`
              })
            }
          }
        } catch (subError) {
          console.warn(`Error getting subfolders for ${categoryFolder.name}:`, subError)
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