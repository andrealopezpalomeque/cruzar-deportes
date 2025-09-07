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

  // Serie A Enilive Teams (Only teams with actual images)
  'atalanta_kid_kit': {
    name: 'Atalanta BC Kids Kit',
    category: 'serie_a_enilive',
    price: 55,
    description: 'Official Atalanta BC kids jersey from Serie A Enilive'
  },
  'inter_authentic_kid_kit': {
    name: 'Inter Milan Authentic Kids Kit',
    category: 'serie_a_enilive',
    price: 75,
    description: 'Authentic Inter Milan kids jersey from Serie A Enilive'
  },
  'inter_gk': {
    name: 'Inter Milan Goalkeeper',
    category: 'serie_a_enilive',
    price: 80,
    description: 'Official Inter Milan goalkeeper jersey from Serie A Enilive'
  },
  'inter_gk_kid_kit': {
    name: 'Inter Milan GK Kids Kit',
    category: 'serie_a_enilive',
    price: 55,
    description: 'Inter Milan goalkeeper kids jersey from Serie A Enilive'
  },
  'inter_gk_short': {
    name: 'Inter Milan GK Shorts',
    category: 'serie_a_enilive',
    price: 30,
    description: 'Inter Milan goalkeeper shorts from Serie A Enilive'
  },
  'jv_authentic': {
    name: 'Juventus Authentic',
    category: 'serie_a_enilive',
    price: 125,
    originalPrice: 145,
    description: 'Authentic Juventus jersey - player version from Serie A Enilive'
  },
  'jv_girl_size': {
    name: 'Juventus Girl Size',
    category: 'serie_a_enilive',
    price: 55,
    description: 'Juventus jersey in girl sizes from Serie A Enilive'
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
  'jv_kid_kit_player_version': {
    name: 'Juventus Kids Kit Player Version',
    category: 'serie_a_enilive',
    price: 75,
    description: 'Juventus player version kids jersey from Serie A Enilive'
  },
  'jv_short_player_version': {
    name: 'Juventus Shorts Player Version',
    category: 'serie_a_enilive',
    price: 45,
    description: 'Juventus player version shorts from Serie A Enilive'
  },
  'lazio_25_26': {
    name: 'SS Lazio 25/26',
    category: 'serie_a_enilive',
    price: 90,
    originalPrice: 105,
    description: 'SS Lazio 25/26 season jersey from Serie A Enilive'
  },
  'milan_gk': {
    name: 'AC Milan Goalkeeper',
    category: 'serie_a_enilive',
    price: 80,
    description: 'Official AC Milan goalkeeper jersey from Serie A Enilive'
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
  'napoles': {
    name: 'SSC Napoli',
    category: 'serie_a_enilive',
    price: 90,
    originalPrice: 100,
    description: 'Official SSC Napoli jersey from Serie A Enilive'
  },
  'napoles_authentic': {
    name: 'SSC Napoli Authentic',
    category: 'serie_a_enilive',
    price: 125,
    originalPrice: 145,
    description: 'Authentic SSC Napoli jersey - player version from Serie A Enilive'
  },
  'napoles_gk': {
    name: 'SSC Napoli Goalkeeper',
    category: 'serie_a_enilive',
    price: 80,
    description: 'Official SSC Napoli goalkeeper jersey from Serie A Enilive'
  },
  'parma_kid_kit': {
    name: 'Parma Kids Kit',
    category: 'serie_a_enilive',
    price: 50,
    description: 'Official Parma Calcio kids jersey from Serie A Enilive'
  },
  'parma_short': {
    name: 'Parma Shorts',
    category: 'serie_a_enilive',
    price: 30,
    description: 'Official Parma Calcio shorts from Serie A Enilive'
  },
  'roma_short_authentic': {
    name: 'AS Roma Shorts Authentic',
    category: 'serie_a_enilive',
    price: 45,
    description: 'Authentic AS Roma shorts from Serie A Enilive'
  },
  'sassuolo': {
    name: 'US Sassuolo',
    category: 'serie_a_enilive',
    price: 70,
    description: 'Official US Sassuolo jersey from Serie A Enilive'
  },
  'sorrento': {
    name: 'Sorrento Calcio',
    category: 'serie_a_enilive',
    price: 65,
    description: 'Official Sorrento Calcio jersey from Serie A Enilive'
  },

  // LPF AFA Teams
  'boca': {
    name: 'Boca Juniors',
    category: 'lpf_afa',
    price: 85,
    originalPrice: 95,
    description: 'Official Boca Juniors jersey from Liga Profesional de Fútbol'
  },
  'boca_authentic': {
    name: 'Boca Juniors Authentic',
    category: 'lpf_afa',
    price: 110,
    originalPrice: 130,
    description: 'Authentic Boca Juniors match jersey from Liga Profesional de Fútbol'
  },
  'boca_kid_kits': {
    name: 'Boca Juniors Kids Kit',
    category: 'lpf_afa',
    price: 55,
    description: 'Official Boca Juniors kids jersey from Liga Profesional de Fútbol'
  },
  'boca_shorts': {
    name: 'Boca Juniors Shorts',
    category: 'lpf_afa',
    price: 35,
    description: 'Official Boca Juniors shorts from Liga Profesional de Fútbol'
  },
  'river_plate': {
    name: 'River Plate',
    category: 'lpf_afa',
    price: 85,
    originalPrice: 95,
    description: 'Official River Plate jersey from Liga Profesional de Fútbol'
  },
  'river_plate_authentic': {
    name: 'River Plate Authentic',
    category: 'lpf_afa',
    price: 110,
    originalPrice: 130,
    description: 'Authentic River Plate match jersey from Liga Profesional de Fútbol'
  },
  'river_kid_kit': {
    name: 'River Plate Kids Kit',
    category: 'lpf_afa',
    price: 55,
    description: 'Official River Plate kids jersey from Liga Profesional de Fútbol'
  },
  'river_shorts': {
    name: 'River Plate Shorts',
    category: 'lpf_afa',
    price: 35,
    description: 'Official River Plate shorts from Liga Profesional de Fútbol'
  },
  'racing': {
    name: 'Racing Club',
    category: 'lpf_afa',
    price: 80,
    description: 'Official Racing Club jersey from Liga Profesional de Fútbol'
  },
  'racing_player_version': {
    name: 'Racing Club Player Version',
    category: 'lpf_afa',
    price: 95,
    originalPrice: 110,
    description: 'Racing Club player version jersey from Liga Profesional de Fútbol'
  },
  'atletico_independiente': {
    name: 'Independiente',
    category: 'lpf_afa',
    price: 75,
    description: 'Official Independiente jersey from Liga Profesional de Fútbol'
  },
  'san_lorenzo': {
    name: 'San Lorenzo',
    category: 'lpf_afa',
    price: 75,
    description: 'Official San Lorenzo jersey from Liga Profesional de Fútbol'
  },
  'newells_old_boys': {
    name: 'Newell\'s Old Boys',
    category: 'lpf_afa',
    price: 70,
    description: 'Official Newell\'s Old Boys jersey from Liga Profesional de Fútbol'
  },
  'rosario_central': {
    name: 'Rosario Central',
    category: 'lpf_afa',
    price: 70,
    description: 'Official Rosario Central jersey from Liga Profesional de Fútbol'
  },
  'argentina_juniors': {
    name: 'Argentinos Juniors',
    category: 'lpf_afa',
    price: 65,
    description: 'Official Argentinos Juniors jersey from Liga Profesional de Fútbol'
  },
  'atletico_huracan': {
    name: 'Huracán',
    category: 'lpf_afa',
    price: 65,
    description: 'Official Huracán jersey from Liga Profesional de Fútbol'
  },
  'la_plata': {
    name: 'Estudiantes de La Plata',
    category: 'lpf_afa',
    price: 70,
    description: 'Official Estudiantes de La Plata jersey from Liga Profesional de Fútbol'
  },
  'atletico_tigre': {
    name: 'Atlético Tigre',
    category: 'lpf_afa',
    price: 65,
    description: 'Official Atlético Tigre jersey from Liga Profesional de Fútbol'
  },
  'atletico_tucuman': {
    name: 'Atlético Tucumán',
    category: 'lpf_afa',
    price: 65,
    description: 'Official Atlético Tucumán jersey from Liga Profesional de Fútbol'
  },
  'barracas_central': {
    name: 'Barracas Central',
    category: 'lpf_afa',
    price: 60,
    description: 'Official Barracas Central jersey from Liga Profesional de Fútbol'
  },
  'boca_gk': {
    name: 'Boca Juniors Goalkeeper',
    category: 'lpf_afa',
    price: 75,
    description: 'Official Boca Juniors goalkeeper jersey from Liga Profesional de Fútbol'
  },
  'boca_gk_kid_kit': {
    name: 'Boca Juniors GK Kids Kit',
    category: 'lpf_afa',
    price: 45,
    description: 'Official Boca Juniors goalkeeper kids kit from Liga Profesional de Fútbol'
  },
  'boca_gk_short': {
    name: 'Boca Juniors GK Shorts',
    category: 'lpf_afa',
    price: 30,
    description: 'Official Boca Juniors goalkeeper shorts from Liga Profesional de Fútbol'
  },
  'boca_long_sleeve_authentic': {
    name: 'Boca Juniors Long Sleeve Authentic',
    category: 'lpf_afa',
    price: 115,
    originalPrice: 135,
    description: 'Authentic Boca Juniors long sleeve jersey from Liga Profesional de Fútbol'
  },
  'lunus': {
    name: 'Lanús',
    category: 'lpf_afa',
    price: 65,
    description: 'Official Lanús jersey from Liga Profesional de Fútbol'
  },
  'racing_kid_kit': {
    name: 'Racing Club Kids Kit',
    category: 'lpf_afa',
    price: 50,
    description: 'Official Racing Club kids kit from Liga Profesional de Fútbol'
  },
  'river_gk': {
    name: 'River Plate Goalkeeper',
    category: 'lpf_afa',
    price: 75,
    description: 'Official River Plate goalkeeper jersey from Liga Profesional de Fútbol'
  },
  'river_gk_kid_kit': {
    name: 'River Plate GK Kids Kit',
    category: 'lpf_afa',
    price: 45,
    description: 'Official River Plate goalkeeper kids kit from Liga Profesional de Fútbol'
  },
  'river_gk_short': {
    name: 'River Plate GK Shorts',
    category: 'lpf_afa',
    price: 30,
    description: 'Official River Plate goalkeeper shorts from Liga Profesional de Fútbol'
  },
  'river_long_sleeve': {
    name: 'River Plate Long Sleeve',
    category: 'lpf_afa',
    price: 90,
    description: 'Official River Plate long sleeve jersey from Liga Profesional de Fútbol'
  },
  'river_long_sleeve_authentic': {
    name: 'River Plate Long Sleeve Authentic',
    category: 'lpf_afa',
    price: 115,
    originalPrice: 135,
    description: 'Authentic River Plate long sleeve jersey from Liga Profesional de Fútbol'
  },
  'san_diego_kid_kit': {
    name: 'San Diego Kids Kit',
    category: 'lpf_afa',
    price: 45,
    description: 'Official San Diego kids kit from Liga Profesional de Fútbol'
  },
  'san_diego_short': {
    name: 'San Diego Shorts',
    category: 'lpf_afa',
    price: 30,
    description: 'Official San Diego shorts from Liga Profesional de Fútbol'
  },
  'sarsfield': {
    name: 'Vélez Sarsfield',
    category: 'lpf_afa',
    price: 70,
    description: 'Official Vélez Sarsfield jersey from Liga Profesional de Fútbol'
  },
  'union_santa_fe': {
    name: 'Unión de Santa Fe',
    category: 'lpf_afa',
    price: 65,
    description: 'Official Unión de Santa Fe jersey from Liga Profesional de Fútbol'
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
    },
    {
      id: 'lpf_afa',
      name: 'Liga Profesional Argentina',
      slug: 'lpf_afa',
      description: 'Camisetas y mercadería de equipos de la Liga Profesional de Fútbol Argentina'
    }
  ]
}

// Note: Image loading is now handled by imageLoader.ts using a generated manifest
// This eliminates the need for hardcoded image counts and paths