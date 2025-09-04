import type { Product, Category, CategoryType } from '~/types'

interface ImageMapping {
  [key: string]: string[]
}

// Map from scraped folder names to product information
const teamData: Record<string, {
  name: string
  category: CategoryType
  price: number
  originalPrice?: number
  description?: string
}> = {
  // AFC Teams
  'johor': {
    name: 'Johor Darul Ta\'zim FC',
    category: 'afc',
    price: 75,
    originalPrice: 90,
    description: 'Official Johor Darul Ta\'zim FC jersey from Malaysia\'s Super League'
  },
  'johor_kid_kit': {
    name: 'Johor Darul Ta\'zim FC Kids Kit',
    category: 'afc', 
    price: 45,
    description: 'Official kids jersey for Johor Darul Ta\'zim FC'
  },
  'seoul_fc': {
    name: 'FC Seoul',
    category: 'afc',
    price: 70,
    description: 'Official FC Seoul jersey from K League 1'
  },
  'suwon_fc': {
    name: 'Suwon FC',
    category: 'afc',
    price: 65,
    description: 'Official Suwon FC jersey from K League 1'
  },
  'suwon_samsung': {
    name: 'Suwon Samsung Bluewings',
    category: 'afc',
    price: 70,
    originalPrice: 85,
    description: 'Official Suwon Samsung Bluewings jersey from K League 1'
  },
  'ulsan_hd': {
    name: 'Ulsan HD FC',
    category: 'afc',
    price: 75,
    description: 'Official Ulsan HD FC jersey from K League 1'
  },

  // CAF Teams
  'al_ahly': {
    name: 'Al Ahly SC',
    category: 'caf',
    price: 65,
    description: 'Official Al Ahly SC jersey from Egyptian Premier League'
  },
  'cs_constantine_player_version': {
    name: 'CS Constantine Player Version',
    category: 'caf',
    price: 85,
    originalPrice: 100,
    description: 'Player version CS Constantine jersey from Algerian Ligue Professionnelle 1'
  },
  'kaizer_chiefs': {
    name: 'Kaizer Chiefs',
    category: 'caf',
    price: 70,
    description: 'Official Kaizer Chiefs jersey from DStv Premiership'
  },
  'mamelodi_player_version': {
    name: 'Mamelodi Sundowns Player Version',
    category: 'caf',
    price: 90,
    originalPrice: 110,
    description: 'Player version Mamelodi Sundowns jersey from DStv Premiership'
  },
  'orlando_pirates': {
    name: 'Orlando Pirates',
    category: 'caf',
    price: 70,
    description: 'Official Orlando Pirates jersey from DStv Premiership'
  },
  'young_africans': {
    name: 'Young Africans SC',
    category: 'caf',
    price: 60,
    description: 'Official Young Africans SC jersey from Tanzanian Premier League'
  },

  // Eredivisie Teams
  'ajax': {
    name: 'AFC Ajax',
    category: 'eredivisie',
    price: 85,
    originalPrice: 95,
    description: 'Official AFC Ajax jersey from Eredivisie'
  },
  'ajax_authentic': {
    name: 'AFC Ajax Authentic',
    category: 'eredivisie',
    price: 110,
    originalPrice: 130,
    description: 'Authentic AFC Ajax jersey - player version from Eredivisie'
  },
  'ajax_gk': {
    name: 'AFC Ajax Goalkeeper',
    category: 'eredivisie',
    price: 80,
    description: 'Official AFC Ajax goalkeeper jersey from Eredivisie'
  },
  'ajax_kid_kit': {
    name: 'AFC Ajax Kids Kit',
    category: 'eredivisie',
    price: 55,
    description: 'Official AFC Ajax kids jersey from Eredivisie'
  },
  'ajax_shorts': {
    name: 'AFC Ajax Shorts',
    category: 'eredivisie',
    price: 35,
    description: 'Official AFC Ajax shorts from Eredivisie'
  },
  'ajax_shorts_authentic': {
    name: 'AFC Ajax Shorts Authentic',
    category: 'eredivisie',
    price: 45,
    description: 'Authentic AFC Ajax shorts - player version from Eredivisie'
  },
  'az_alkmaar': {
    name: 'AZ Alkmaar',
    category: 'eredivisie',
    price: 70,
    description: 'Official AZ Alkmaar jersey from Eredivisie'
  },
  'az_alkmaar_kid_kit': {
    name: 'AZ Alkmaar Kids Kit',
    category: 'eredivisie',
    price: 45,
    description: 'Official AZ Alkmaar kids jersey from Eredivisie'
  },
  'az_alkmaar_shorts': {
    name: 'AZ Alkmaar Shorts',
    category: 'eredivisie',
    price: 30,
    description: 'Official AZ Alkmaar shorts from Eredivisie'
  },
  'feyenoord': {
    name: 'Feyenoord Rotterdam',
    category: 'eredivisie',
    price: 80,
    originalPrice: 90,
    description: 'Official Feyenoord Rotterdam jersey from Eredivisie'
  },
  'feyenoord_kid_kit': {
    name: 'Feyenoord Kids Kit',
    category: 'eredivisie',
    price: 50,
    description: 'Official Feyenoord Rotterdam kids jersey from Eredivisie'
  },
  'feyenoord_short': {
    name: 'Feyenoord Shorts',
    category: 'eredivisie',
    price: 30,
    description: 'Official Feyenoord Rotterdam shorts from Eredivisie'
  },
  'psv': {
    name: 'PSV Eindhoven',
    category: 'eredivisie',
    price: 80,
    originalPrice: 90,
    description: 'Official PSV Eindhoven jersey from Eredivisie'
  },
  'psv_gk': {
    name: 'PSV Eindhoven Goalkeeper',
    category: 'eredivisie',
    price: 75,
    description: 'Official PSV Eindhoven goalkeeper jersey from Eredivisie'
  },
  'psv_gk_kid_kit': {
    name: 'PSV GK Kids Kit',
    category: 'eredivisie',
    price: 45,
    description: 'Official PSV Eindhoven goalkeeper kids jersey from Eredivisie'
  },
  'psv_gk_short': {
    name: 'PSV GK Shorts',
    category: 'eredivisie',
    price: 30,
    description: 'Official PSV Eindhoven goalkeeper shorts from Eredivisie'
  },
  'psv_kid_kit': {
    name: 'PSV Eindhoven Kids Kit',
    category: 'eredivisie',
    price: 50,
    description: 'Official PSV Eindhoven kids jersey from Eredivisie'
  },
  'psv_short': {
    name: 'PSV Eindhoven Shorts',
    category: 'eredivisie',
    price: 30,
    description: 'Official PSV Eindhoven shorts from Eredivisie'
  },
  'sc_heerenveen': {
    name: 'SC Heerenveen',
    category: 'eredivisie',
    price: 65,
    description: 'Official SC Heerenveen jersey from Eredivisie'
  },
  'twente': {
    name: 'FC Twente',
    category: 'eredivisie',
    price: 70,
    description: 'Official FC Twente jersey from Eredivisie'
  },
  '164829969': {
    name: 'Eredivisie Special Collection 164829969',
    category: 'eredivisie',
    price: 75,
    description: 'Special collection jersey from Eredivisie'
  },
  '197081703': {
    name: 'Eredivisie Special Collection 197081703',
    category: 'eredivisie',
    price: 75,
    description: 'Special collection jersey from Eredivisie'
  },
  'ajax_gk_kid_kit': {
    name: 'AFC Ajax GK Kids Kit',
    category: 'eredivisie',
    price: 45,
    description: 'AFC Ajax goalkeeper kids jersey from Eredivisie'
  },
  'ajax_gk_short': {
    name: 'AFC Ajax GK Shorts',
    category: 'eredivisie',
    price: 30,
    description: 'AFC Ajax goalkeeper shorts from Eredivisie'
  },
  'ajax_short': {
    name: 'AFC Ajax Shorts',
    category: 'eredivisie',
    price: 35,
    description: 'AFC Ajax shorts from Eredivisie'
  },
  'ajax_short_player_version': {
    name: 'AFC Ajax Shorts Player Version',
    category: 'eredivisie',
    price: 45,
    description: 'AFC Ajax player version shorts from Eredivisie'
  },
  'feyenoord_gk': {
    name: 'Feyenoord Goalkeeper',
    category: 'eredivisie',
    price: 75,
    description: 'Feyenoord Rotterdam goalkeeper jersey from Eredivisie'
  },
  'feyenoord_gk_kid_kit': {
    name: 'Feyenoord GK Kids Kit',
    category: 'eredivisie',
    price: 45,
    description: 'Feyenoord Rotterdam goalkeeper kids jersey from Eredivisie'
  },
  'feyenoord_gk_short': {
    name: 'Feyenoord GK Shorts',
    category: 'eredivisie',
    price: 30,
    description: 'Feyenoord Rotterdam goalkeeper shorts from Eredivisie'
  },

  // Serie A Enilive Teams
  'atalanta': {
    name: 'Atalanta BC',
    category: 'serie_a_enilive',
    price: 85,
    originalPrice: 95,
    description: 'Official Atalanta BC jersey from Serie A Enilive'
  },
  'atalanta_kit_kit': {
    name: 'Atalanta BC Kids Kit',
    category: 'serie_a_enilive',
    price: 55,
    description: 'Official Atalanta BC kids jersey from Serie A Enilive'
  },
  'atalanta_short': {
    name: 'Atalanta BC Shorts',
    category: 'serie_a_enilive',
    price: 35,
    description: 'Official Atalanta BC shorts from Serie A Enilive'
  },
  'cagliari': {
    name: 'Cagliari Calcio',
    category: 'serie_a_enilive',
    price: 75,
    description: 'Official Cagliari Calcio jersey from Serie A Enilive'
  },
  'cagliari_kid_kit': {
    name: 'Cagliari Kids Kit',
    category: 'serie_a_enilive',
    price: 45,
    description: 'Official Cagliari Calcio kids jersey from Serie A Enilive'
  },
  'cagliari_short': {
    name: 'Cagliari Shorts',
    category: 'serie_a_enilive',
    price: 30,
    description: 'Official Cagliari Calcio shorts from Serie A Enilive'
  },
  'fiorentina': {
    name: 'ACF Fiorentina',
    category: 'serie_a_enilive',
    price: 85,
    originalPrice: 95,
    description: 'Official ACF Fiorentina jersey from Serie A Enilive'
  },
  'fiorentina_kid_kit': {
    name: 'Fiorentina Kids Kit',
    category: 'serie_a_enilive',
    price: 55,
    description: 'Official ACF Fiorentina kids jersey from Serie A Enilive'
  },
  'fiorentina_short': {
    name: 'Fiorentina Shorts',
    category: 'serie_a_enilive',
    price: 35,
    description: 'Official ACF Fiorentina shorts from Serie A Enilive'
  },
  'inter_authentic': {
    name: 'Inter Milan Authentic',
    category: 'serie_a_enilive',
    price: 120,
    originalPrice: 140,
    description: 'Authentic Inter Milan jersey - player version from Serie A Enilive'
  },
  'inter_kid_kit': {
    name: 'Inter Milan Kids Kit',
    category: 'serie_a_enilive',
    price: 60,
    description: 'Official Inter Milan kids jersey from Serie A Enilive'
  },
  'inter_kid_kit_authentic': {
    name: 'Inter Milan Kids Kit Authentic',
    category: 'serie_a_enilive',
    price: 75,
    description: 'Authentic Inter Milan kids jersey from Serie A Enilive'
  },
  'bologna_kid_kit': {
    name: 'Bologna FC Kids Kit',
    category: 'serie_a_enilive',
    price: 50,
    description: 'Official Bologna FC kids jersey from Serie A Enilive'
  },
  'bologna_short': {
    name: 'Bologna FC Shorts',
    category: 'serie_a_enilive',
    price: 30,
    description: 'Official Bologna FC shorts from Serie A Enilive'
  },
  'bari_long_sleeve': {
    name: 'FC Bari Long Sleeve',
    category: 'serie_a_enilive',
    price: 80,
    description: 'Official FC Bari long sleeve jersey from Serie A Enilive'
  },
  'frosinone': {
    name: 'Frosinone Calcio',
    category: 'serie_a_enilive',
    price: 70,
    description: 'Official Frosinone Calcio jersey from Serie A Enilive'
  },
  'inter_girl_size': {
    name: 'Inter Milan Girl Size',
    category: 'serie_a_enilive',
    price: 55,
    description: 'Inter Milan jersey in girl sizes from Serie A Enilive'
  },
  'inter_long_sleeve_kid_kit': {
    name: 'Inter Milan Long Sleeve Kids Kit',
    category: 'serie_a_enilive',
    price: 65,
    description: 'Inter Milan long sleeve kids jersey from Serie A Enilive'
  },
  'inter_long_sleeve_player_version': {
    name: 'Inter Milan Long Sleeve Player Version',
    category: 'serie_a_enilive',
    price: 130,
    originalPrice: 150,
    description: 'Inter Milan long sleeve player version jersey from Serie A Enilive'
  },
  'inter_short': {
    name: 'Inter Milan Shorts',
    category: 'serie_a_enilive',
    price: 35,
    description: 'Official Inter Milan shorts from Serie A Enilive'
  },
  'inter_short_player_version': {
    name: 'Inter Milan Shorts Player Version',
    category: 'serie_a_enilive',
    price: 45,
    description: 'Inter Milan player version shorts from Serie A Enilive'
  },
  'jv_authentic': {
    name: 'Juventus Authentic',
    category: 'serie_a_enilive',
    price: 125,
    originalPrice: 145,
    description: 'Authentic Juventus jersey - player version from Serie A Enilive'
  },
  'jv_gk_kid_kit': {
    name: 'Juventus GK Kids Kit',
    category: 'serie_a_enilive',
    price: 55,
    description: 'Juventus goalkeeper kids jersey from Serie A Enilive'
  },
  'jv_gk_short': {
    name: 'Juventus GK Shorts',
    category: 'serie_a_enilive',
    price: 30,
    description: 'Juventus goalkeeper shorts from Serie A Enilive'
  },
  'jv_kid_kit': {
    name: 'Juventus Kids Kit',
    category: 'serie_a_enilive',
    price: 65,
    description: 'Official Juventus kids jersey from Serie A Enilive'
  },
  'jv_long_sleeve_authentic': {
    name: 'Juventus Long Sleeve Authentic',
    category: 'serie_a_enilive',
    price: 135,
    originalPrice: 155,
    description: 'Authentic Juventus long sleeve jersey from Serie A Enilive'
  },
  'jv_long_sleeve_kid_kit': {
    name: 'Juventus Long Sleeve Kids Kit',
    category: 'serie_a_enilive',
    price: 70,
    description: 'Juventus long sleeve kids jersey from Serie A Enilive'
  },
  'jv_short_authentic': {
    name: 'Juventus Shorts Authentic',
    category: 'serie_a_enilive',
    price: 50,
    description: 'Authentic Juventus shorts from Serie A Enilive'
  },
  'lazio_authentic': {
    name: 'SS Lazio Authentic',
    category: 'serie_a_enilive',
    price: 120,
    originalPrice: 140,
    description: 'Authentic SS Lazio jersey - player version from Serie A Enilive'
  },
  'lazio_kid_kit': {
    name: 'SS Lazio Kids Kit',
    category: 'serie_a_enilive',
    price: 60,
    description: 'Official SS Lazio kids jersey from Serie A Enilive'
  },
  'lazio_short': {
    name: 'SS Lazio Shorts',
    category: 'serie_a_enilive',
    price: 35,
    description: 'Official SS Lazio shorts from Serie A Enilive'
  },
  'milan_authentic': {
    name: 'AC Milan Authentic',
    category: 'serie_a_enilive',
    price: 125,
    originalPrice: 145,
    description: 'Authentic AC Milan jersey - player version from Serie A Enilive'
  },
  'milan_gk_kid_kit': {
    name: 'AC Milan GK Kids Kit',
    category: 'serie_a_enilive',
    price: 55,
    description: 'AC Milan goalkeeper kids jersey from Serie A Enilive'
  },
  'milan_gk_short': {
    name: 'AC Milan GK Shorts',
    category: 'serie_a_enilive',
    price: 30,
    description: 'AC Milan goalkeeper shorts from Serie A Enilive'
  },
  'milan_kid_kit': {
    name: 'AC Milan Kids Kit',
    category: 'serie_a_enilive',
    price: 65,
    description: 'Official AC Milan kids jersey from Serie A Enilive'
  },
  'milan_kid_kit_long_sleeve': {
    name: 'AC Milan Kids Kit Long Sleeve',
    category: 'serie_a_enilive',
    price: 70,
    description: 'AC Milan long sleeve kids jersey from Serie A Enilive'
  },
  'milan_long_sleeve': {
    name: 'AC Milan Long Sleeve',
    category: 'serie_a_enilive',
    price: 90,
    description: 'Official AC Milan long sleeve jersey from Serie A Enilive'
  },
  'milan_long_sleeve_authentic': {
    name: 'AC Milan Long Sleeve Authentic',
    category: 'serie_a_enilive',
    price: 135,
    originalPrice: 155,
    description: 'Authentic AC Milan long sleeve jersey from Serie A Enilive'
  },
  'milan_short': {
    name: 'AC Milan Shorts',
    category: 'serie_a_enilive',
    price: 35,
    description: 'Official AC Milan shorts from Serie A Enilive'
  },
  'milan_short_authentic': {
    name: 'AC Milan Shorts Authentic',
    category: 'serie_a_enilive',
    price: 45,
    description: 'Authentic AC Milan shorts from Serie A Enilive'
  },
  'napoles_authentic': {
    name: 'SSC Napoli Authentic',
    category: 'serie_a_enilive',
    price: 125,
    originalPrice: 145,
    description: 'Authentic SSC Napoli jersey - player version from Serie A Enilive'
  },
  'napoles_kid_kit': {
    name: 'SSC Napoli Kids Kit',
    category: 'serie_a_enilive',
    price: 65,
    description: 'Official SSC Napoli kids jersey from Serie A Enilive'
  },
  'napoles_short': {
    name: 'SSC Napoli Shorts',
    category: 'serie_a_enilive',
    price: 35,
    description: 'Official SSC Napoli shorts from Serie A Enilive'
  },
  'roma_authentic': {
    name: 'AS Roma Authentic',
    category: 'serie_a_enilive',
    price: 125,
    originalPrice: 145,
    description: 'Authentic AS Roma jersey - player version from Serie A Enilive'
  },
  'roma_kid_kit': {
    name: 'AS Roma Kids Kit',
    category: 'serie_a_enilive',
    price: 65,
    description: 'Official AS Roma kids jersey from Serie A Enilive'
  },
  'roma_short': {
    name: 'AS Roma Shorts',
    category: 'serie_a_enilive',
    price: 35,
    description: 'Official AS Roma shorts from Serie A Enilive'
  },
  'salernitana': {
    name: 'US Salernitana',
    category: 'serie_a_enilive',
    price: 75,
    description: 'Official US Salernitana jersey from Serie A Enilive'
  },
  'sampdoria': {
    name: 'UC Sampdoria',
    category: 'serie_a_enilive',
    price: 80,
    description: 'Official UC Sampdoria jersey from Serie A Enilive'
  },
  'torino_kid_kit': {
    name: 'Torino FC Kids Kit',
    category: 'serie_a_enilive',
    price: 55,
    description: 'Official Torino FC kids jersey from Serie A Enilive'
  },
  'torino_short': {
    name: 'Torino FC Shorts',
    category: 'serie_a_enilive',
    price: 30,
    description: 'Official Torino FC shorts from Serie A Enilive'
  },
  'venezia_gk': {
    name: 'Venezia FC Goalkeeper',
    category: 'serie_a_enilive',
    price: 75,
    description: 'Official Venezia FC goalkeeper jersey from Serie A Enilive'
  },
  'venezia_kid_kit': {
    name: 'Venezia FC Kids Kit',
    category: 'serie_a_enilive',
    price: 50,
    description: 'Official Venezia FC kids jersey from Serie A Enilive'
  },
  'venezia_long_sleeve': {
    name: 'Venezia FC Long Sleeve',
    category: 'serie_a_enilive',
    price: 85,
    description: 'Official Venezia FC long sleeve jersey from Serie A Enilive'
  },
  'venezia_short': {
    name: 'Venezia FC Shorts',
    category: 'serie_a_enilive',
    price: 30,
    description: 'Official Venezia FC shorts from Serie A Enilive'
  },
  '161842622uid1issubcatefalsereferrercate334382': {
    name: 'Serie A Special Edition',
    category: 'serie_a_enilive',
    price: 95,
    originalPrice: 110,
    description: 'Special edition Serie A Enilive jersey'
  }
}

async function getImagesForTeam(teamKey: string, category: CategoryType): Promise<string[]> {
  const { getTeamImages } = await import('~/utils/imageLoader')
  return getTeamImages(teamKey, category)
}

export async function generateProducts(): Promise<Product[]> {
  const products: Product[] = []

  for (const [teamKey, teamInfo] of Object.entries(teamData)) {
    const images = await getImagesForTeam(teamKey, teamInfo.category)
    
    const product: Product = {
      id: `team-${teamKey}`,
      name: teamInfo.name,
      slug: teamKey.replace(/_/g, '-'),
      description: teamInfo.description,
      price: teamInfo.price,
      originalPrice: teamInfo.originalPrice,
      category: teamInfo.category,
      images: images.slice(0, 5), // Use first 5 images for product display
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Home', 'Away'],
      inStock: true,
      featured: Math.random() > 0.5 // Randomly mark some as featured
    }

    products.push(product)
  }

  return products
}

export function generateCategories(): Category[] {
  return [
    {
      id: 'afc',
      name: 'Equipos AFC',
      slug: 'afc',
      description: 'Camisetas y mercadería de equipos de la Confederación Asiática de Fútbol'
    },
    {
      id: 'caf', 
      name: 'Equipos CAF',
      slug: 'caf',
      description: 'Camisetas y mercadería de equipos de la Confederación Africana de Fútbol'
    },
    {
      id: 'eredivisie',
      name: 'Equipos Eredivisie',
      slug: 'eredivisie',
      description: 'Camisetas y mercadería de equipos de la Eredivisie holandesa'
    },
    {
      id: 'serie_a_enilive',
      name: 'Serie A Enilive',
      slug: 'serie_a_enilive',
      description: 'Camisetas y mercadería de equipos de la Serie A Enilive italiana'
    }
  ]
}

// Note: Image loading is now handled by imageLoader.ts using a generated manifest
// This eliminates the need for hardcoded image counts and paths