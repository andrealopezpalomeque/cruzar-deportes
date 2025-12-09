export interface AvailableCategory {
  slug: string
  name: string
  nameEs?: string | null
  emoji?: string | null
}

export const HARDCODED_AVAILABLE_CATEGORIES: AvailableCategory[] = [
  { slug: 'afc', name: 'AFC', emoji: '🇰🇷' },
  { slug: 'basket', name: 'BASKET', emoji: '🏀' },
  { slug: 'brasileiro_betano', name: 'BRASILEIRÃO BETANO', emoji: '🇧🇷' },
  { slug: 'bundesliga', name: 'BUNDESLIGA', emoji: '🇩🇪' },
  { slug: 'caf', name: 'CAF', emoji: '🇿🇦' },
  { slug: 'club_retro', name: 'CLUB RETRO' },
  { slug: 'conmebol_concacaf', name: 'CONMEBOL - CONCACAF', emoji: '🇨🇴' },
  { slug: 'eredivisie', name: 'EREDIVISIE', emoji: '🇳🇱' },
  { slug: 'f1', name: 'F1', emoji: '🏎️' },
  { slug: 'kings_league', name: 'KINGS LEAGUE', emoji: '👑' },
  { slug: 'laliga_ea_sports_hypermotion', name: 'LALIGA EA SPORTS - HYPERMOTION', emoji: '🇪🇸' },
  { slug: 'liga_bbva_mx_liga_expansion_mx', name: 'LIGA BBVA MX - LIGA EXPANSION MX', emoji: '🇲🇽' },
  { slug: 'liga_portugal_betclic', name: 'LIGA PORTUGAL BETCLIC', emoji: '🇵🇹' },
  { slug: 'ligue1_mcdonalds', name: 'LIGUE1 MCDONALDS', emoji: '🇫🇷' },
  { slug: 'lpf_afa', name: 'LPF AFA', emoji: '🇦🇷' },
  { slug: 'mls', name: 'MLS', emoji: '🇺🇸' },
  { slug: 'national_retro', name: 'NATIONAL RETRO' },
  { slug: 'rsl', name: 'RSL', emoji: '🇸🇦' },
  { slug: 'serie_a_enilive', name: 'SERIE A ENILIVE', emoji: '🇮🇹' },
  { slug: 'uefa', name: 'UEFA', emoji: '🇪🇺' }
]

export const loadAvailableCategories = async (): Promise<AvailableCategory[]> => {
  return HARDCODED_AVAILABLE_CATEGORIES
}

export const buildCategoryLabel = (category: AvailableCategory): string => {
  const parts: string[] = []

  if (category.emoji) {
    parts.push(category.emoji)
  }

  parts.push(category.name)

  if (category.nameEs && category.nameEs !== category.name) {
    parts.push(`(${category.nameEs})`)
  }

  return parts.join(' ').trim()
}
