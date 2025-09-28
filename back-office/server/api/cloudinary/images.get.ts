import { v2 as cloudinary } from 'cloudinary'
import type { ApiResponse, CloudinaryAsset } from '~/types'
import { requireSession } from '../../utils/session'

export default defineEventHandler(async (event): Promise<ApiResponse<CloudinaryAsset[]>> => {
  try {
    // Validate session
    requireSession(event)

    // Get folder from query parameters
    const query = getQuery(event)
    const folder = query.folder as string

    if (!folder) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Folder parameter is required'
      })
    }

    // Configure Cloudinary
    const config = useRuntimeConfig()
    cloudinary.config({
      cloud_name: config.public.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })

    // Get images from the specified folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      resource_type: 'image',
      max_results: 500 // Increase if needed
    })

    // Transform the response to match our CloudinaryAsset interface
    const images: CloudinaryAsset[] = result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      created_at: resource.created_at,
      folder: folder,
      filename: resource.public_id.split('/').pop()?.split('.')[0] || '',
      resource_type: resource.resource_type
    }))

    // Sort by creation date (newest first)
    images.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return {
      success: true,
      data: images,
      message: `Retrieved ${images.length} images from ${folder}`
    }
  } catch (error: any) {
    console.error('Cloudinary images error:', error)

    return {
      success: false,
      error: error.message || 'Failed to retrieve images'
    }
  }
})
