import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!body.publicId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Public ID is required'
    })
  }

  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })

    // Delete the image
    const result = await cloudinary.uploader.destroy(body.publicId)

    if (result.result === 'ok') {
      return { success: true, result }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: `Failed to delete image: ${result.result}`
      })
    }
  } catch (error) {
    console.error('Cloudinary deletion error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while deleting image'
    })
  }
})