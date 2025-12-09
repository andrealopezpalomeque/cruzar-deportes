import { v2 as cloudinary } from 'cloudinary'
import { readMultipartFormData } from 'h3'
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

    const form = await readMultipartFormData(event)
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se recibió ningún archivo'
      })
    }

    const filePart = form.find(part => part.name === 'file')
    if (!filePart || !filePart.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Archivo inválido'
      })
    }

    const folderPart = form.find(part => part.name === 'folder')
    const folder = folderPart?.data?.toString() || 'cruzar-deportes/manual-uploads'

    const fileType = filePart.type || 'application/octet-stream'
    const base64 = filePart.data.toString('base64')
    const uploadPayload = `data:${fileType};base64,${base64}`

    const result = await cloudinary.uploader.upload(uploadPayload, {
      folder,
      resource_type: 'image'
    })

    return {
      success: true,
      data: result,
      message: 'Imagen subida correctamente'
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error.statusMessage || error.message || 'No pudimos subir la imagen'
    }
  }
})
