import type { LoginCredentials, ApiResponse, AuthUser } from '~/types'

export default defineEventHandler(async (event): Promise<ApiResponse<AuthUser>> => {
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

    // Simple username/password validation
    const validUsername = config.backofficeUsername
    const validPassword = config.backofficePassword

    if (body.username === validUsername && body.password === validPassword) {
      // Create session token (simple implementation)
      const sessionToken = Buffer.from(`${body.username}:${Date.now()}`).toString('base64')

      // Set HTTP-only cookie for session
      setCookie(event, 'backoffice_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return {
        success: true,
        data: {
          username: body.username,
          isAuthenticated: true,
          loginTime: new Date().toISOString()
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