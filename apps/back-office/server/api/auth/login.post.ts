import { setCookie, readBody, createError } from 'h3'
import { randomUUID } from 'node:crypto'
import type { LoginCredentials, ApiResponse } from '~/types'
import { setSessionCookieOptions } from '../../utils/session'

export default defineEventHandler(async (event): Promise<ApiResponse<{ username: string }>> => {
  try {
    const body = await readBody<LoginCredentials>(event)
    const config = useRuntimeConfig()

    // Validate request body
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username and password are required'
      })
    }

    // Simple username/password validation against env variables
    const validUsername = config.backofficeUsername
    const validPassword = config.backofficePassword

    if (body.username === validUsername && body.password === validPassword) {
      const sessionToken = randomUUID()
      const cookieOptions = setSessionCookieOptions({
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 24 hours
        secure: process.env.NODE_ENV === 'production'
      })

      setCookie(event, '__session', sessionToken, cookieOptions)

      return {
        success: true,
        data: {
          username: body.username
        },
        message: 'Login successful'
      }
    } else {
      return {
        success: false,
        error: 'Invalid username or password'
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)

    return {
      success: false,
      error: error.statusMessage || 'Login failed'
    }
  }
})
