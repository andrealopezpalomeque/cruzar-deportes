/**
 * Formats a numeric value into Argentinian Peso style.
 * Removes decimals for whole amounts while preserving cents when provided.
 */
export function formatArs(
  value: number | string | null | undefined,
  options?: { includeSymbol?: boolean }
): string {
  const amount = typeof value === 'number'
    ? value
    : Number(value ?? 0)

  if (!Number.isFinite(amount)) {
    return ''
  }

  const hasDecimals = !Number.isInteger(amount)
  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0
  }

  if (options?.includeSymbol === false) {
    formatOptions.style = 'decimal'
  } else {
    formatOptions.style = 'currency'
    formatOptions.currency = 'ARS'
  }

  return new Intl.NumberFormat('es-AR', formatOptions).format(amount)
}
