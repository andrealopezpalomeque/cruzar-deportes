import type { ApiResponse } from '~/types'
import { clearSession } from '../../utils/session'

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    // Clear the session cookie
    clearSession(event)

    return {
      success: true,
      message: 'Logout successful'
    }
  } catch (error: any) {
    console.error('Logout error:', error)

    return {
      success: false,
      error: 'Logout failed'
    }
  }
})
