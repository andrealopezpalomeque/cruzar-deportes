import type { H3Event } from 'h3'
import { getCookie, deleteCookie, createError } from 'h3'

const isProduction = process.env.NODE_ENV === 'production'
const COOKIE_DOMAIN = process.env.BACKOFFICE_COOKIE_DOMAIN || (isProduction ? 'deportes-cruzar-admin.web.app' : undefined)
const SESSION_COOKIE_NAME = '__session'

const COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: true,
  secure: isProduction,
  // Domain not set: defaults to host-only (safest for single-site apps)
}

export const getSessionToken = (event: H3Event): string | null => {
  const cookieToken = getCookie(event, SESSION_COOKIE_NAME)
  if (cookieToken) {
    return cookieToken
  }

  const authHeader = event.node?.req?.headers?.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    if (token) {
      return token
    }
  }

  return null
}

export const clearSession = (event: H3Event) => {
  try {
    deleteCookie(event, SESSION_COOKIE_NAME, COOKIE_OPTIONS)
  } catch (error) {
    console.warn('Unable to clear session cookie:', error)
  }
}

export const setSessionCookieOptions = (overrides: Record<string, any> = {}) => ({
  ...COOKIE_OPTIONS,
  ...overrides
})

export const requireSession = (event: H3Event): string => {
  const token = getSessionToken(event)
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  return token
}
