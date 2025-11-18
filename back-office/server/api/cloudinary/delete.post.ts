import { v2 as cloudinary } from 'cloudinary'
import type { ApiResponse } from '~/types'
import { requireSession } from '../../utils/session'

export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  try {
    requireSession(event)

    const config = useRuntimeConfig()
    if (!config.public.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Cloudinary no está configurado. Define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.'
      })
    }

    cloudinary.config({
      cloud_name: config.public.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })

    const body = await readBody<{ publicId?: string }>(event)
    if (!body?.publicId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'publicId es requerido'
      })
    }

    const result = await cloudinary.uploader.destroy(body.publicId, {
      resource_type: 'image',
      invalidate: true
    })

    return {
      success: true,
      data: result,
      message: 'Imagen eliminada correctamente'
    }
  } catch (error: any) {
    console.error('Cloudinary delete error:', error)
    return {
      success: false,
      error: error.statusMessage || error.message || 'No pudimos eliminar la imagen'
    }
  }
})
