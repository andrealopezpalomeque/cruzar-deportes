import type { ApiResponse } from '~/types'
import { clearSession, getSessionToken } from '../../utils/session'

export default defineEventHandler(async (event): Promise<ApiResponse<{ valid: boolean }>> => {
  try {
    const sessionToken = getSessionToken(event)

    if (!sessionToken) {
      return {
        success: false,
        error: 'No session found'
      }
    }

    try {
      // Decode and validate the session token
      const decoded = Buffer.from(sessionToken, 'base64').toString()
      const [username, timestamp] = decoded.split(':')

      if (!username || !timestamp) {
        throw new Error('Invalid token format')
      }

      // Check if session is not expired (24 hours)
      const sessionTime = parseInt(timestamp)
      const currentTime = Date.now()
      const hoursDiff = (currentTime - sessionTime) / (1000 * 60 * 60)

      if (hoursDiff > 24) {
        // Session expired
        clearSession(event)
        return {
          success: false,
          error: 'Session expired'
        }
      }

      // Validate username against config
      const config = useRuntimeConfig()
      if (username !== config.backofficeUsername) {
        throw new Error('Invalid session user')
      }

      return {
        success: true,
        data: { valid: true },
        message: 'Session is valid'
      }
    } catch (tokenError) {
      // Invalid token, clear it
      clearSession(event)
      return {
        success: false,
        error: 'Invalid session'
      }
    }
  } catch (error: any) {
    console.error('Session validation error:', error)

    return {
      success: false,
      error: 'Session validation failed'
    }
  }
})
