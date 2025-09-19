/**
 * Device detection utilities for mobile-specific functionality
 */

/**
 * Detects if the current device is mobile
 * Uses user agent and screen size detection for better accuracy
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false // Server-side, assume desktop
  }

  // User agent detection for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || ''
  const mobileUserAgentRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  // Screen size detection (mobile screens are typically <= 768px wide)
  const isMobileScreen = window.innerWidth <= 768

  // Touch capability detection
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // Combine multiple detection methods for better accuracy
  return mobileUserAgentRegex.test(userAgent) || (isMobileScreen && isTouchDevice)
}

/**
 * Detects if the current device is iOS
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent || navigator.vendor || ''
  return /iPad|iPhone|iPod/.test(userAgent)
}

/**
 * Detects if the current device is Android
 */
export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent || navigator.vendor || ''
  return /Android/.test(userAgent)
}

/**
 * Opens a URL with mobile-optimized behavior
 * Uses window.location.href for mobile and window.open for desktop
 */
export function openURLMobileOptimized(url: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    if (isMobileDevice()) {
      // On mobile, use direct navigation for better app deep linking
      window.location.href = url
      return true
    } else {
      // On desktop, use window.open for new tab
      const newWindow = window.open(url, '_blank')
      return !!(newWindow && !newWindow.closed)
    }
  } catch (error) {
    console.error('Error opening URL:', error)
    return false
  }
}