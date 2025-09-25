import type { ApiResponse } from '~/types'

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    // Clear the session cookie
    deleteCookie(event, 'backoffice_session')

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