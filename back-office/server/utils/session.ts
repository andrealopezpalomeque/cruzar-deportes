import type { H3Event } from 'h3'
import { getCookie, deleteCookie, createError } from 'h3'

const COOKIE_OPTIONS = {
  path: '/',
  domain: 'cruzar-back-office.web.app'
}

export const getSessionToken = (event: H3Event): string | null => {
  const cookieToken = getCookie(event, 'backoffice_session')
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
    deleteCookie(event, 'backoffice_session', COOKIE_OPTIONS)
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
