export const slugify = (value?: string | number | null): string => {
  return (value ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const buildProductIdFromSlug = (slug: string, prefix = 'team'): string => {
  const sanitizedSlug = slugify(slug)
  const teamKey = sanitizedSlug.replace(/-/g, '_')
  return `${prefix}-${teamKey || 'producto'}`
}
