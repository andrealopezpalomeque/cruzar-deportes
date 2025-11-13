import type { CategoryType } from './types'

export interface TeamCatalogEntry {
  name: string
  category: CategoryType
  price: number
  originalPrice?: number
  description?: string
}

export const teamCatalog: Record<string, TeamCatalogEntry> = {
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
  },

  // National Retro Teams
  'argentina_1978': {
    name: 'Argentina Retro 1978',
    category: 'national_retro',
    price: 120,
    originalPrice: 150,
    description: 'Historic Argentina national team jersey from 1978 World Cup'
  },
  'argentina_1986': {
    name: 'Argentina Retro 1986',
    category: 'national_retro',
    price: 130,
    originalPrice: 160,
    description: 'Legendary Argentina national team jersey from 1986 World Cup with Maradona'
  },
  'argentina_1986_long_sleeve': {
    name: 'Argentina Retro 1986 Long Sleeve',
    category: 'national_retro',
    price: 140,
    originalPrice: 170,
    description: 'Argentina 1986 World Cup long sleeve jersey'
  },
  'argentina_1994': {
    name: 'Argentina Retro 1994',
    category: 'national_retro',
    price: 115,
    originalPrice: 140,
    description: 'Classic Argentina national team jersey from 1994 World Cup'
  },
  'argentina_1998': {
    name: 'Argentina Retro 1998',
    category: 'national_retro',
    price: 110,
    originalPrice: 135,
    description: 'Argentina national team jersey from 1998 World Cup'
  },
  'argentina_2001_maradona_version': {
    name: 'Argentina 2001 Maradona Version',
    category: 'national_retro',
    price: 135,
    originalPrice: 165,
    description: 'Special Argentina jersey from 2001 Maradona tribute version'
  },
  'argentina_2006': {
    name: 'Argentina Retro 2006',
    category: 'national_retro',
    price: 105,
    originalPrice: 125,
    description: 'Argentina national team jersey from 2006 World Cup'
  },
  'argentina_2010': {
    name: 'Argentina Retro 2010',
    category: 'national_retro',
    price: 100,
    originalPrice: 120,
    description: 'Argentina national team jersey from 2010 World Cup'
  },
  'argentina_2014': {
    name: 'Argentina Retro 2014',
    category: 'national_retro',
    price: 95,
    originalPrice: 115,
    description: 'Argentina national team jersey from 2014 World Cup Final'
  },
  'argentina_2014_adizero': {
    name: 'Argentina 2014 Adizero',
    category: 'national_retro',
    price: 110,
    originalPrice: 130,
    description: 'Argentina 2014 World Cup Adizero player version jersey'
  },
  'argentina_2014_long_sleeve': {
    name: 'Argentina 2014 Long Sleeve',
    category: 'national_retro',
    price: 105,
    originalPrice: 125,
    description: 'Argentina 2014 World Cup long sleeve jersey'
  },
  'argentina_2014_long_sleeve_player_version': {
    name: 'Argentina 2014 Long Sleeve Player Version',
    category: 'national_retro',
    price: 120,
    originalPrice: 145,
    description: 'Argentina 2014 World Cup long sleeve player version jersey'
  },
  'argentina_2014_world_final': {
    name: 'Argentina 2014 World Cup Final',
    category: 'national_retro',
    price: 125,
    originalPrice: 155,
    description: 'Special Argentina jersey from 2014 World Cup Final'
  },
  'belgium_00': {
    name: 'Belgium Retro 2000',
    category: 'national_retro',
    price: 95,
    originalPrice: 110,
    description: 'Vintage Belgium national team jersey from 2000'
  },
  'bulgaria_1994': {
    name: 'Bulgaria Retro 1994',
    category: 'national_retro',
    price: 90,
    originalPrice: 105,
    description: 'Classic Bulgaria national team jersey from 1994 World Cup'
  },
  'china_01': {
    name: 'China Retro 2001',
    category: 'national_retro',
    price: 85,
    description: 'Vintage China national team jersey from 2001'
  },
  'china_01_long_sleeve': {
    name: 'China Retro 2001 Long Sleeve',
    category: 'national_retro',
    price: 95,
    description: 'Vintage China national team long sleeve jersey from 2001'
  },
  'china_02_long_sleeve': {
    name: 'China Retro 2002 Long Sleeve',
    category: 'national_retro',
    price: 95,
    description: 'Vintage China national team long sleeve jersey from 2002 World Cup'
  },
  'china_1998': {
    name: 'China Retro 1998',
    category: 'national_retro',
    price: 85,
    description: 'Classic China national team jersey from 1998'
  },
  'china_2002': {
    name: 'China Retro 2002',
    category: 'national_retro',
    price: 90,
    originalPrice: 105,
    description: 'Historic China national team jersey from 2002 World Cup'
  },
  'china_2002_short': {
    name: 'China Retro 2002 Shorts',
    category: 'national_retro',
    price: 40,
    description: 'China national team shorts from 2002 World Cup'
  },
  'czech_1996': {
    name: 'Czech Republic Retro 1996',
    category: 'national_retro',
    price: 90,
    originalPrice: 105,
    description: 'Classic Czech Republic national team jersey from Euro 1996'
  },
  'denmark_1986': {
    name: 'Denmark Retro 1986',
    category: 'national_retro',
    price: 95,
    originalPrice: 110,
    description: 'Vintage Denmark national team jersey from 1986 World Cup'
  },
  'denmark_1992': {
    name: 'Denmark Retro 1992',
    category: 'national_retro',
    price: 100,
    originalPrice: 120,
    description: 'Legendary Denmark Euro 1992 Champions jersey'
  },
  'denmark_1998': {
    name: 'Denmark Retro 1998',
    category: 'national_retro',
    price: 90,
    description: 'Classic Denmark national team jersey from 1998 World Cup'
  },
  'denmark_88': {
    name: 'Denmark Retro 1988',
    category: 'national_retro',
    price: 95,
    description: 'Vintage Denmark national team jersey from Euro 1988'
  },
  'england_02_kid_kit': {
    name: 'England Retro 2002 Kids Kit',
    category: 'national_retro',
    price: 60,
    description: 'England national team kids kit from 2002 World Cup'
  },
  'england_02_long_sleeve': {
    name: 'England Retro 2002 Long Sleeve',
    category: 'national_retro',
    price: 105,
    description: 'England national team long sleeve jersey from 2002 World Cup'
  },
  'england_06_long_sleeve': {
    name: 'England Retro 2006 Long Sleeve',
    category: 'national_retro',
    price: 105,
    description: 'England national team long sleeve jersey from 2006 World Cup'
  },
  'england_06_shorts': {
    name: 'England Retro 2006 Shorts',
    category: 'national_retro',
    price: 45,
    description: 'England national team shorts from 2006 World Cup'
  },
  'england_1966': {
    name: 'England Retro 1966',
    category: 'national_retro',
    price: 120,
    originalPrice: 150,
    description: 'Iconic England World Cup Winners 1966 jersey'
  },
  'england_1980': {
    name: 'England Retro 1980',
    category: 'national_retro',
    price: 95,
    description: 'Vintage England national team jersey from 1980'
  },
  'england_1982': {
    name: 'England Retro 1982',
    category: 'national_retro',
    price: 95,
    description: 'Classic England national team jersey from 1982 World Cup'
  },
  'england_1989': {
    name: 'England Retro 1989',
    category: 'national_retro',
    price: 90,
    description: 'Vintage England national team jersey from 1989'
  },
  'england_1990': {
    name: 'England Retro 1990',
    category: 'national_retro',
    price: 100,
    originalPrice: 120,
    description: 'Classic England national team jersey from 1990 World Cup'
  },
  'england_1992': {
    name: 'England Retro 1992',
    category: 'national_retro',
    price: 90,
    description: 'England national team jersey from Euro 1992'
  },
  'england_1994': {
    name: 'England Retro 1994',
    category: 'national_retro',
    price: 90,
    description: 'Classic England national team jersey from 1994'
  },
  'england_1996': {
    name: 'England Retro 1996',
    category: 'national_retro',
    price: 100,
    originalPrice: 120,
    description: 'Legendary England Euro 1996 home tournament jersey'
  },
  'england_1998': {
    name: 'England Retro 1998',
    category: 'national_retro',
    price: 95,
    originalPrice: 110,
    description: 'Classic England national team jersey from 1998 World Cup'
  },
  'england_1998_long_sleeve': {
    name: 'England Retro 1998 Long Sleeve',
    category: 'national_retro',
    price: 105,
    description: 'England national team long sleeve jersey from 1998 World Cup'
  },
  'england_1998_shorts': {
    name: 'England Retro 1998 Shorts',
    category: 'national_retro',
    price: 45,
    description: 'England national team shorts from 1998 World Cup'
  },
  'england_2000': {
    name: 'England Retro 2000',
    category: 'national_retro',
    price: 95,
    description: 'England national team jersey from Euro 2000'
  },
  'england_2002': {
    name: 'England Retro 2002',
    category: 'national_retro',
    price: 95,
    description: 'England national team jersey from 2002 World Cup'
  },
  'england_2004': {
    name: 'England Retro 2004',
    category: 'national_retro',
    price: 90,
    description: 'England national team jersey from Euro 2004'
  },
  'england_2006': {
    name: 'England Retro 2006',
    category: 'national_retro',
    price: 95,
    description: 'England national team jersey from 2006 World Cup'
  },
  'england_2010': {
    name: 'England Retro 2010',
    category: 'national_retro',
    price: 90,
    description: 'England national team jersey from 2010 World Cup'
  },
  'england_2012': {
    name: 'England Retro 2012',
    category: 'national_retro',
    price: 85,
    description: 'England national team jersey from Euro 2012'
  },
  'england_2013': {
    name: 'England Retro 2013',
    category: 'national_retro',
    price: 85,
    description: 'England national team jersey from 2013'
  },
  'england_2018': {
    name: 'England Retro 2018',
    category: 'national_retro',
    price: 90,
    originalPrice: 105,
    description: 'England national team jersey from 2018 World Cup'
  },
  'england_82_kid_kit': {
    name: 'England Retro 1982 Kids Kit',
    category: 'national_retro',
    price: 55,
    description: 'England national team kids kit from 1982 World Cup'
  },
  'england_86': {
    name: 'England Retro 1986',
    category: 'national_retro',
    price: 95,
    description: 'England national team jersey from 1986 World Cup'
  },
  'england_90s_kid_kit': {
    name: 'England Retro 1990s Kids Kit',
    category: 'national_retro',
    price: 60,
    description: 'England national team kids kit from the 1990s'
  },
  'england_92': {
    name: 'England Retro 1992',
    category: 'national_retro',
    price: 90,
    description: 'England national team jersey from Euro 1992'
  },
  'england_96_gk_long_sleeve': {
    name: 'England 1996 GK Long Sleeve',
    category: 'national_retro',
    price: 100,
    description: 'England goalkeeper long sleeve jersey from Euro 1996'
  },
  'england_96_kid_kit': {
    name: 'England Retro 1996 Kids Kit',
    category: 'national_retro',
    price: 65,
    description: 'England national team kids kit from Euro 1996'
  },
  'england_96_long_sleeve': {
    name: 'England Retro 1996 Long Sleeve',
    category: 'national_retro',
    price: 110,
    originalPrice: 130,
    description: 'England national team long sleeve jersey from Euro 1996'
  },
  'england_98_kid_kit': {
    name: 'England Retro 1998 Kids Kit',
    category: 'national_retro',
    price: 60,
    description: 'England national team kids kit from 1998 World Cup'
  },
  'finland_1982': {
    name: 'Finland Retro 1982',
    category: 'national_retro',
    price: 85,
    description: 'Vintage Finland national team jersey from 1982'
  },
  'greece_04': {
    name: 'Greece Retro 2004',
    category: 'national_retro',
    price: 100,
    originalPrice: 120,
    description: 'Legendary Greece Euro 2004 Champions jersey'
  },
  'iceland_16_17': {
    name: 'Iceland Retro 2016-17',
    category: 'national_retro',
    price: 85,
    description: 'Iceland national team jersey from Euro 2016'
  },
  'italy_1982': {
    name: 'Italy Retro 1982',
    category: 'national_retro',
    price: 110,
    originalPrice: 130,
    description: 'Legendary Italy 1982 World Cup Winners jersey'
  },
  'italy_1986': {
    name: 'Italy Retro 1986',
    category: 'national_retro',
    price: 100,
    description: 'Classic Italy national team jersey from 1986 World Cup'
  },
  'italy_1990': {
    name: 'Italy Retro 1990',
    category: 'national_retro',
    price: 105,
    originalPrice: 125,
    description: 'Historic Italy national team jersey from 1990 World Cup'
  },
  'italy_1994': {
    name: 'Italy Retro 1994',
    category: 'national_retro',
    price: 100,
    originalPrice: 115,
    description: 'Classic Italy national team jersey from 1994 World Cup'
  },
  'italy_70': {
    name: 'Italy Retro 1970',
    category: 'national_retro',
    price: 115,
    originalPrice: 140,
    description: 'Vintage Italy national team jersey from 1970 World Cup'
  },
  'italy_82_long_sleeve': {
    name: 'Italy Retro 1982 Long Sleeve',
    category: 'national_retro',
    price: 120,
    originalPrice: 140,
    description: 'Italy 1982 World Cup Winners long sleeve jersey'
  },
  'italy_94_kid_kit': {
    name: 'Italy Retro 1994 Kids Kit',
    category: 'national_retro',
    price: 65,
    description: 'Italy national team kids kit from 1994 World Cup'
  },
  'italy_94_long_sleeve': {
    name: 'Italy Retro 1994 Long Sleeve',
    category: 'national_retro',
    price: 110,
    description: 'Italy national team long sleeve jersey from 1994 World Cup'
  },
  'italy_94_prematch': {
    name: 'Italy Retro 1994 Pre-Match',
    category: 'national_retro',
    price: 95,
    description: 'Italy national team pre-match jersey from 1994 World Cup'
  },
  'italy_95': {
    name: 'Italy Retro 1995',
    category: 'national_retro',
    price: 95,
    description: 'Italy national team jersey from 1995'
  },
  'italy_96': {
    name: 'Italy Retro 1996',
    category: 'national_retro',
    price: 100,
    description: 'Italy national team jersey from Euro 1996'
  },
  'japan_00': {
    name: 'Japan Retro 2000',
    category: 'national_retro',
    price: 90,
    description: 'Japan national team jersey from 2000'
  },
  'japan_00_long_sleeve': {
    name: 'Japan Retro 2000 Long Sleeve',
    category: 'national_retro',
    price: 100,
    description: 'Japan national team long sleeve jersey from 2000'
  },
  'japan_06_long_sleeve': {
    name: 'Japan Retro 2006 Long Sleeve',
    category: 'national_retro',
    price: 100,
    description: 'Japan national team long sleeve jersey from 2006 World Cup'
  },
  'japan_10': {
    name: 'Japan Retro 2010',
    category: 'national_retro',
    price: 90,
    description: 'Japan national team jersey from 2010 World Cup'
  },
  'japan_14': {
    name: 'Japan Retro 2014',
    category: 'national_retro',
    price: 85,
    description: 'Japan national team jersey from 2014 World Cup'
  },
  'japan_16_17': {
    name: 'Japan Retro 2016-17',
    category: 'national_retro',
    price: 85,
    description: 'Japan national team jersey from 2016-17'
  },
  'japan_16_17_kid_kit': {
    name: 'Japan Retro 2016-17 Kids Kit',
    category: 'national_retro',
    price: 55,
    description: 'Japan national team kids kit from 2016-17'
  },
  'japan_18_kid_kit': {
    name: 'Japan Retro 2018 Kids Kit',
    category: 'national_retro',
    price: 55,
    description: 'Japan national team kids kit from 2018 World Cup'
  },
  'japan_1998': {
    name: 'Japan Retro 1998',
    category: 'national_retro',
    price: 95,
    originalPrice: 110,
    description: 'Historic Japan national team jersey from 1998 World Cup'
  },
  'japan_20': {
    name: 'Japan Retro 2020',
    category: 'national_retro',
    price: 80,
    description: 'Japan national team jersey from 2020'
  },
  'japan_2006': {
    name: 'Japan Retro 2006',
    category: 'national_retro',
    price: 90,
    description: 'Japan national team jersey from 2006 World Cup'
  },
  'japan_94': {
    name: 'Japan Retro 1994',
    category: 'national_retro',
    price: 95,
    description: 'Japan national team jersey from 1994'
  },
  'japan_94_long_sleeve': {
    name: 'Japan Retro 1994 Long Sleeve',
    category: 'national_retro',
    price: 105,
    description: 'Japan national team long sleeve jersey from 1994'
  },
  'japan_96': {
    name: 'Japan Retro 1996',
    category: 'national_retro',
    price: 90,
    description: 'Japan national team jersey from 1996'
  },
  'japan_98_gk_long_sleeve': {
    name: 'Japan 1998 GK Long Sleeve',
    category: 'national_retro',
    price: 100,
    description: 'Japan goalkeeper long sleeve jersey from 1998 World Cup'
  },
  'japan_98_kid_kit': {
    name: 'Japan Retro 1998 Kids Kit',
    category: 'national_retro',
    price: 60,
    description: 'Japan national team kids kit from 1998 World Cup'
  },
  'japan_98_long_sleeve': {
    name: 'Japan Retro 1998 Long Sleeve',
    category: 'national_retro',
    price: 105,
    description: 'Japan national team long sleeve jersey from 1998 World Cup'
  },
  'japan_99': {
    name: 'Japan Retro 1999',
    category: 'national_retro',
    price: 90,
    description: 'Japan national team jersey from 1999'
  },
  'japan_captain_tsubasa': {
    name: 'Japan Captain Tsubasa Edition',
    category: 'national_retro',
    price: 125,
    originalPrice: 150,
    description: 'Special Japan Captain Tsubasa collaboration jersey'
  },
  'korea_20': {
    name: 'South Korea Retro 2020',
    category: 'national_retro',
    price: 80,
    description: 'South Korea national team jersey from 2020'
  },
  'korea_2002': {
    name: 'South Korea Retro 2002',
    category: 'national_retro',
    price: 100,
    originalPrice: 120,
    description: 'Historic South Korea national team jersey from 2002 World Cup'
  },
  'netherland_04': {
    name: 'Netherlands Retro 2004',
    category: 'national_retro',
    price: 95,
    description: 'Netherlands national team jersey from Euro 2004'
  },
  'netherland_04_long_sleeve': {
    name: 'Netherlands Retro 2004 Long Sleeve',
    category: 'national_retro',
    price: 105,
    description: 'Netherlands national team long sleeve jersey from Euro 2004'
  },
  'netherland_08': {
    name: 'Netherlands Retro 2008',
    category: 'national_retro',
    price: 90,
    description: 'Netherlands national team jersey from Euro 2008'
  },
  'netherland_1988_training': {
    name: 'Netherlands 1988 Training',
    category: 'national_retro',
    price: 85,
    description: 'Netherlands training jersey from Euro 1988'
  },
  'netherland_2002': {
    name: 'Netherlands Retro 2002',
    category: 'national_retro',
    price: 95,
    description: 'Netherlands national team jersey from 2002 World Cup'
  },
  'netherland_2010': {
    name: 'Netherlands Retro 2010',
    category: 'national_retro',
    price: 100,
    originalPrice: 115,
    description: 'Netherlands national team jersey from 2010 World Cup'
  },
  'netherland_88_centennial_edition': {
    name: 'Netherlands 1988 Centennial Edition',
    category: 'national_retro',
    price: 115,
    originalPrice: 135,
    description: 'Netherlands Euro 1988 Champions centennial edition jersey'
  },
  'netherland_98_long_sleeve': {
    name: 'Netherlands Retro 1998 Long Sleeve',
    category: 'national_retro',
    price: 105,
    description: 'Netherlands national team long sleeve jersey from 1998 World Cup'
  },
  'netherlands_1988': {
    name: 'Netherlands Retro 1988',
    category: 'national_retro',
    price: 110,
    originalPrice: 130,
    description: 'Legendary Netherlands Euro 1988 Champions jersey'
  },
  'netherlands_1988_kid_kit': {
    name: 'Netherlands Retro 1988 Kids Kit',
    category: 'national_retro',
    price: 65,
    description: 'Netherlands national team kids kit from Euro 1988'
  },
  'netherlands_1988_long_sleeve': {
    name: 'Netherlands Retro 1988 Long Sleeve',
    category: 'national_retro',
    price: 120,
    originalPrice: 140,
    description: 'Netherlands Euro 1988 Champions long sleeve jersey'
  },
  'netherlands_1991': {
    name: 'Netherlands Retro 1991',
    category: 'national_retro',
    price: 100,
    description: 'Netherlands national team jersey from 1991'
  },
  'netherlands_1995': {
    name: 'Netherlands Retro 1995',
    category: 'national_retro',
    price: 95,
    description: 'Netherlands national team jersey from 1995'
  },
  'netherlands_1996': {
    name: 'Netherlands Retro 1996',
    category: 'national_retro',
    price: 100,
    description: 'Netherlands national team jersey from Euro 1996'
  },
  'netherlands_1998': {
    name: 'Netherlands Retro 1998',
    category: 'national_retro',
    price: 100,
    originalPrice: 115,
    description: 'Classic Netherlands national team jersey from 1998 World Cup'
  },
  'netherlands_2014': {
    name: 'Netherlands Retro 2014',
    category: 'national_retro',
    price: 85,
    description: 'Netherlands national team jersey from 2014 World Cup'
  },
  'netherlands_84': {
    name: 'Netherlands Retro 1984',
    category: 'national_retro',
    price: 100,
    description: 'Vintage Netherlands national team jersey from Euro 1984'
  },
  'north_ireland_1992': {
    name: 'Northern Ireland Retro 1992',
    category: 'national_retro',
    price: 85,
    description: 'Northern Ireland national team jersey from 1992'
  },
  'north_ireland_79': {
    name: 'Northern Ireland Retro 1979',
    category: 'national_retro',
    price: 90,
    description: 'Vintage Northern Ireland national team jersey from 1979'
  },
  'north_ireland_88': {
    name: 'Northern Ireland Retro 1988',
    category: 'national_retro',
    price: 85,
    description: 'Northern Ireland national team jersey from Euro 1988'
  },
  'north_ireland_90_92': {
    name: 'Northern Ireland Retro 1990-92',
    category: 'national_retro',
    price: 85,
    description: 'Northern Ireland national team jersey from 1990-92'
  },
  'north_ireland_90_93_away': {
    name: 'Northern Ireland Retro 1990-93 Away',
    category: 'national_retro',
    price: 85,
    description: 'Northern Ireland away jersey from 1990-93'
  },
  'north_ireland_92_94': {
    name: 'Northern Ireland Retro 1992-94',
    category: 'national_retro',
    price: 85,
    description: 'Northern Ireland national team jersey from 1992-94'
  },
  'norway_1984': {
    name: 'Norway Retro 1984',
    category: 'national_retro',
    price: 85,
    description: 'Vintage Norway national team jersey from 1984'
  },
  'norway_98_99': {
    name: 'Norway Retro 1998-99',
    category: 'national_retro',
    price: 90,
    description: 'Norway national team jersey from 1998 World Cup'
  },
  'poland_12': {
    name: 'Poland Retro 2012',
    category: 'national_retro',
    price: 80,
    description: 'Poland national team jersey from Euro 2012'
  },
  'poland_1982': {
    name: 'Poland Retro 1982',
    category: 'national_retro',
    price: 95,
    originalPrice: 110,
    description: 'Classic Poland national team jersey from 1982 World Cup'
  },
  'romania': {
    name: 'Romania Retro',
    category: 'national_retro',
    price: 90,
    description: 'Vintage Romania national team jersey'
  },
  'romania_1994': {
    name: 'Romania Retro 1994',
    category: 'national_retro',
    price: 95,
    originalPrice: 110,
    description: 'Classic Romania national team jersey from 1994 World Cup'
  },
  'serbia_2010': {
    name: 'Serbia Retro 2010',
    category: 'national_retro',
    price: 85,
    description: 'Serbia national team jersey from 2010 World Cup'
  },
  'swiss_1994': {
    name: 'Switzerland Retro 1994',
    category: 'national_retro',
    price: 85,
    description: 'Switzerland national team jersey from 1994 World Cup'
  },
  'swiss_1995': {
    name: 'Switzerland Retro 1995',
    category: 'national_retro',
    price: 85,
    description: 'Switzerland national team jersey from 1995'
  },
  'turkey_08': {
    name: 'Turkey Retro 2008',
    category: 'national_retro',
    price: 85,
    description: 'Turkey national team jersey from Euro 2008'
  },
  'turkey_1996': {
    name: 'Turkey Retro 1996',
    category: 'national_retro',
    price: 85,
    description: 'Turkey national team jersey from Euro 1996'
  },
  'ukraine_98': {
    name: 'Ukraine Retro 1998',
    category: 'national_retro',
    price: 85,
    description: 'Ukraine national team jersey from 1998'
  },
  'wales_94_95': {
    name: 'Wales Retro 1994-95',
    category: 'national_retro',
    price: 85,
    description: 'Wales national team jersey from 1994-95'
  },
  'wales_94_96': {
    name: 'Wales Retro 1994-96',
    category: 'national_retro',
    price: 85,
    description: 'Wales national team jersey from 1994-96'
  },
  'walevs_96_98': {
    name: 'Wales Retro 1996-98',
    category: 'national_retro',
    price: 85,
    description: 'Wales national team jersey from 1996-98'
  },
  'yugoslavia_1990': {
    name: 'Yugoslavia Retro 1990',
    category: 'national_retro',
    price: 100,
    originalPrice: 120,
    description: 'Historic Yugoslavia national team jersey from 1990 World Cup'
  },
  'yugoslavia_2000': {
    name: 'Yugoslavia Retro 2000',
    category: 'national_retro',
    price: 95,
    description: 'Yugoslavia national team jersey from Euro 2000'
  },
  'yugoslavia_98': {
    name: 'Yugoslavia Retro 1998',
    category: 'national_retro',
    price: 95,
    originalPrice: 110,
    description: 'Yugoslavia national team jersey from 1998 World Cup'
  },
  'yugoslavia_99': {
    name: 'Yugoslavia Retro 1999',
    category: 'national_retro',
    price: 95,
    description: 'Yugoslavia national team jersey from 1999'
  },

  // Basket Teams
  'alba_berlin': {
    name: 'Alba Berlin',
    category: 'basket',
    price: 95,
    description: 'Official Alba Berlin basketball jersey from the Cruzar collection.'
  },
  'anadolu': {
    name: 'Anadolu',
    category: 'basket',
    price: 95,
    description: 'Official Anadolu basketball jersey from the Cruzar collection.'
  },
  'angola': {
    name: 'Angola',
    category: 'basket',
    price: 95,
    description: 'Official Angola basketball jersey from the Cruzar collection.'
  },
  'argentina': {
    name: 'Argentina',
    category: 'basket',
    price: 95,
    description: 'Official Argentina basketball jersey from the Cruzar collection.'
  },
  'atm_90_91': {
    name: 'Atlético Madrid 1990-91',
    category: 'basket',
    price: 95,
    description: 'Official Atlético Madrid 1990-91 basketball jersey from the Cruzar collection.'
  },
  'australia': {
    name: 'Australia',
    category: 'basket',
    price: 95,
    description: 'Official Australia basketball jersey from the Cruzar collection.'
  },
  'b_a': {
    name: 'B. A.',
    category: 'basket',
    price: 95,
    description: 'Official B. A. basketball jersey from the Cruzar collection.'
  },
  'baskonia': {
    name: 'Baskonia',
    category: 'basket',
    price: 95,
    description: 'Official Baskonia basketball jersey from the Cruzar collection.'
  },
  'basquet_corua': {
    name: 'Basquet Corua',
    category: 'basket',
    price: 95,
    description: 'Official Basquet Corua basketball jersey from the Cruzar collection.'
  },
  'bayern': {
    name: 'Bayern',
    category: 'basket',
    price: 95,
    description: 'Official Bayern basketball jersey from the Cruzar collection.'
  },
  'bbk': {
    name: 'BBK',
    category: 'basket',
    price: 95,
    description: 'Official BBK basketball jersey from the Cruzar collection.'
  },
  'bcn': {
    name: 'FC Barcelona',
    category: 'basket',
    price: 95,
    description: 'Official FC Barcelona basketball jersey from the Cruzar collection.'
  },
  'bcn_21_22': {
    name: 'Bcn 21 22',
    category: 'basket',
    price: 95,
    description: 'Official Bcn 21 22 basketball jersey from the Cruzar collection.'
  },
  'bcn_86_87': {
    name: 'Bcn 86 87',
    category: 'basket',
    price: 95,
    description: 'Official Bcn 86 87 basketball jersey from the Cruzar collection.'
  },
  'bcn_89_90': {
    name: 'Bcn 89 90',
    category: 'basket',
    price: 95,
    description: 'Official Bcn 89 90 basketball jersey from the Cruzar collection.'
  },
  'bcn_97': {
    name: 'Bcn 97',
    category: 'basket',
    price: 95,
    description: 'Official Bcn 97 basketball jersey from the Cruzar collection.'
  },
  'belgium': {
    name: 'Belgium',
    category: 'basket',
    price: 95,
    description: 'Official Belgium basketball jersey from the Cruzar collection.'
  },
  'besiktas': {
    name: 'Besiktas',
    category: 'basket',
    price: 95,
    description: 'Official Besiktas basketball jersey from the Cruzar collection.'
  },
  'bosnia_hezergobina': {
    name: 'Bosnia Hezergobina',
    category: 'basket',
    price: 95,
    description: 'Official Bosnia Hezergobina basketball jersey from the Cruzar collection.'
  },
  'brazil': {
    name: 'Brazil',
    category: 'basket',
    price: 95,
    description: 'Official Brazil basketball jersey from the Cruzar collection.'
  },
  'breogan': {
    name: 'Breogan',
    category: 'basket',
    price: 95,
    description: 'Official Breogan basketball jersey from the Cruzar collection.'
  },
  'bts': {
    name: 'BTS',
    category: 'basket',
    price: 95,
    description: 'Official BTS basketball jersey from the Cruzar collection.'
  },
  'bulgaria': {
    name: 'Bulgaria',
    category: 'basket',
    price: 95,
    description: 'Official Bulgaria basketball jersey from the Cruzar collection.'
  },
  'burgos': {
    name: 'Burgos',
    category: 'basket',
    price: 95,
    description: 'Official Burgos basketball jersey from the Cruzar collection.'
  },
  'cameroon': {
    name: 'Cameroon',
    category: 'basket',
    price: 95,
    description: 'Official Cameroon basketball jersey from the Cruzar collection.'
  },
  'canarias': {
    name: 'Canarias',
    category: 'basket',
    price: 95,
    description: 'Official Canarias basketball jersey from the Cruzar collection.'
  },
  'catalunya': {
    name: 'Catalunya',
    category: 'basket',
    price: 95,
    description: 'Official Catalunya basketball jersey from the Cruzar collection.'
  },
  'cccp': {
    name: 'USSR',
    category: 'basket',
    price: 95,
    description: 'Official USSR basketball jersey from the Cruzar collection.'
  },
  'clesa': {
    name: 'Clesa',
    category: 'basket',
    price: 95,
    description: 'Official Clesa basketball jersey from the Cruzar collection.'
  },
  'cold_hearts_2025': {
    name: 'Cold Hearts 2025',
    category: 'basket',
    price: 95,
    description: 'Official Cold Hearts 2025 basketball jersey from the Cruzar collection.'
  },
  'cska': {
    name: 'CSKA Moscow',
    category: 'basket',
    price: 95,
    description: 'Official CSKA Moscow basketball jersey from the Cruzar collection.'
  },
  'dynamo_moscow': {
    name: 'Dynamo Moscow',
    category: 'basket',
    price: 95,
    description: 'Official Dynamo Moscow basketball jersey from the Cruzar collection.'
  },
  'eden': {
    name: 'EDEN',
    category: 'basket',
    price: 95,
    description: 'Official EDEN basketball jersey from the Cruzar collection.'
  },
  'estrella_roja': {
    name: 'Estrella Roja',
    category: 'basket',
    price: 95,
    description: 'Official Estrella Roja basketball jersey from the Cruzar collection.'
  },
  'estudiantes': {
    name: 'Estudiantes',
    category: 'basket',
    price: 95,
    description: 'Official Estudiantes basketball jersey from the Cruzar collection.'
  },
  'fenerbahce': {
    name: 'Fenerbahce',
    category: 'basket',
    price: 95,
    description: 'Official Fenerbahce basketball jersey from the Cruzar collection.'
  },
  'forum_valladolid': {
    name: 'Forum Valladolid',
    category: 'basket',
    price: 95,
    description: 'Official Forum Valladolid basketball jersey from the Cruzar collection.'
  },
  'france': {
    name: 'France',
    category: 'basket',
    price: 95,
    description: 'Official France basketball jersey from the Cruzar collection.'
  },
  'georgia': {
    name: 'Georgia',
    category: 'basket',
    price: 95,
    description: 'Official Georgia basketball jersey from the Cruzar collection.'
  },
  'germany': {
    name: 'Germany',
    category: 'basket',
    price: 95,
    description: 'Official Germany basketball jersey from the Cruzar collection.'
  },
  'gran_canaria': {
    name: 'Gran Canaria',
    category: 'basket',
    price: 95,
    description: 'Official Gran Canaria basketball jersey from the Cruzar collection.'
  },
  'granada': {
    name: 'Granada',
    category: 'basket',
    price: 95,
    description: 'Official Granada basketball jersey from the Cruzar collection.'
  },
  'greece': {
    name: 'Greece',
    category: 'basket',
    price: 95,
    description: 'Official Greece basketball jersey from the Cruzar collection.'
  },
  'italy': {
    name: 'Italy',
    category: 'basket',
    price: 95,
    description: 'Official Italy basketball jersey from the Cruzar collection.'
  },
  'ivory_coast': {
    name: 'Ivory Coast',
    category: 'basket',
    price: 95,
    description: 'Official Ivory Coast basketball jersey from the Cruzar collection.'
  },
  'joventut': {
    name: 'Joventut',
    category: 'basket',
    price: 95,
    description: 'Official Joventut basketball jersey from the Cruzar collection.'
  },
  'kazan': {
    name: 'Kazan',
    category: 'basket',
    price: 95,
    description: 'Official Kazan basketball jersey from the Cruzar collection.'
  },
  'lakers_in_n_out': {
    name: 'Lakers In N Out',
    category: 'basket',
    price: 95,
    description: 'Official Lakers In N Out basketball jersey from the Cruzar collection.'
  },
  'latvija': {
    name: 'Latvia',
    category: 'basket',
    price: 95,
    description: 'Official Latvia basketball jersey from the Cruzar collection.'
  },
  'leon': {
    name: 'Leon',
    category: 'basket',
    price: 95,
    description: 'Official Leon basketball jersey from the Cruzar collection.'
  },
  'letonia': {
    name: 'Latvia',
    category: 'basket',
    price: 95,
    description: 'Official Latvia basketball jersey from the Cruzar collection.'
  },
  'lleida': {
    name: 'Lleida',
    category: 'basket',
    price: 95,
    description: 'Official Lleida basketball jersey from the Cruzar collection.'
  },
  'maccabi': {
    name: 'Maccabi',
    category: 'basket',
    price: 95,
    description: 'Official Maccabi basketball jersey from the Cruzar collection.'
  },
  'madrid': {
    name: 'Real Madrid',
    category: 'basket',
    price: 95,
    description: 'Official Real Madrid basketball jersey from the Cruzar collection.'
  },
  'madrid_16_17': {
    name: 'Madrid 16 17',
    category: 'basket',
    price: 95,
    description: 'Official Madrid 16 17 basketball jersey from the Cruzar collection.'
  },
  'madrid_17_18': {
    name: 'Madrid 17 18',
    category: 'basket',
    price: 95,
    description: 'Official Madrid 17 18 basketball jersey from the Cruzar collection.'
  },
  'madrid_19_20': {
    name: 'Madrid 19 20',
    category: 'basket',
    price: 95,
    description: 'Official Madrid 19 20 basketball jersey from the Cruzar collection.'
  },
  'madrid_89_basketball': {
    name: 'Madrid 89 Basketball',
    category: 'basket',
    price: 95,
    description: 'Official Madrid 89 Basketball basketball jersey from the Cruzar collection.'
  },
  'madrid_doncic': {
    name: 'Real Madrid Doncic',
    category: 'basket',
    price: 95,
    description: 'Official Real Madrid Doncic basketball jersey from the Cruzar collection.'
  },
  'malaga': {
    name: 'Malaga',
    category: 'basket',
    price: 95,
    description: 'Official Malaga basketball jersey from the Cruzar collection.'
  },
  'mali': {
    name: 'Mali',
    category: 'basket',
    price: 95,
    description: 'Official Mali basketball jersey from the Cruzar collection.'
  },
  'maristas': {
    name: 'Maristas',
    category: 'basket',
    price: 95,
    description: 'Official Maristas basketball jersey from the Cruzar collection.'
  },
  'monaco': {
    name: 'Monaco',
    category: 'basket',
    price: 95,
    description: 'Official Monaco basketball jersey from the Cruzar collection.'
  },
  'montenegro': {
    name: 'Montenegro',
    category: 'basket',
    price: 95,
    description: 'Official Montenegro basketball jersey from the Cruzar collection.'
  },
  'mozzart': {
    name: 'Mozzart',
    category: 'basket',
    price: 95,
    description: 'Official Mozzart basketball jersey from the Cruzar collection.'
  },
  'murcia': {
    name: 'Murcia',
    category: 'basket',
    price: 95,
    description: 'Official Murcia basketball jersey from the Cruzar collection.'
  },
  'netherland': {
    name: 'Netherland',
    category: 'basket',
    price: 95,
    description: 'Official Netherland basketball jersey from the Cruzar collection.'
  },
  'olimpia_milano': {
    name: 'Olimpia Milano',
    category: 'basket',
    price: 95,
    description: 'Official Olimpia Milano basketball jersey from the Cruzar collection.'
  },
  'olympiakos': {
    name: 'Olympiakos',
    category: 'basket',
    price: 95,
    description: 'Official Olympiakos basketball jersey from the Cruzar collection.'
  },
  'panathinaikos': {
    name: 'Panathinaikos',
    category: 'basket',
    price: 95,
    description: 'Official Panathinaikos basketball jersey from the Cruzar collection.'
  },
  'panionios_athens': {
    name: 'Panionios Athens',
    category: 'basket',
    price: 95,
    description: 'Official Panionios Athens basketball jersey from the Cruzar collection.'
  },
  'paok': {
    name: 'PAOK',
    category: 'basket',
    price: 95,
    description: 'Official PAOK basketball jersey from the Cruzar collection.'
  },
  'paris': {
    name: 'Paris',
    category: 'basket',
    price: 95,
    description: 'Official Paris basketball jersey from the Cruzar collection.'
  },
  'partizan': {
    name: 'Partizan',
    category: 'basket',
    price: 95,
    description: 'Official Partizan basketball jersey from the Cruzar collection.'
  },
  'philippines': {
    name: 'Philippines',
    category: 'basket',
    price: 95,
    description: 'Official Philippines basketball jersey from the Cruzar collection.'
  },
  'puerto_rico': {
    name: 'Puerto Rico',
    category: 'basket',
    price: 95,
    description: 'Official Puerto Rico basketball jersey from the Cruzar collection.'
  },
  'republica_dominicana': {
    name: 'Republica Dominicana',
    category: 'basket',
    price: 95,
    description: 'Official Republica Dominicana basketball jersey from the Cruzar collection.'
  },
  'roma': {
    name: 'Roma',
    category: 'basket',
    price: 95,
    description: 'Official Roma basketball jersey from the Cruzar collection.'
  },
  'russia': {
    name: 'Russia',
    category: 'basket',
    price: 95,
    description: 'Official Russia basketball jersey from the Cruzar collection.'
  },
  'scg': {
    name: 'Serbia and Montenegro',
    category: 'basket',
    price: 95,
    description: 'Official Serbia and Montenegro basketball jersey from the Cruzar collection.'
  },
  'senegal': {
    name: 'Senegal',
    category: 'basket',
    price: 95,
    description: 'Official Senegal basketball jersey from the Cruzar collection.'
  },
  'serbia': {
    name: 'Serbia',
    category: 'basket',
    price: 95,
    description: 'Official Serbia basketball jersey from the Cruzar collection.'
  },
  'siegmund': {
    name: 'Siegmund',
    category: 'basket',
    price: 95,
    description: 'Official Siegmund basketball jersey from the Cruzar collection.'
  },
  'siroki': {
    name: 'Siroki',
    category: 'basket',
    price: 95,
    description: 'Official Siroki basketball jersey from the Cruzar collection.'
  },
  'slovenija': {
    name: 'Slovenija',
    category: 'basket',
    price: 95,
    description: 'Official Slovenija basketball jersey from the Cruzar collection.'
  },
  'spain': {
    name: 'Spain',
    category: 'basket',
    price: 95,
    description: 'Official Spain basketball jersey from the Cruzar collection.'
  },
  'stefanel': {
    name: 'Stefanel',
    category: 'basket',
    price: 95,
    description: 'Official Stefanel basketball jersey from the Cruzar collection.'
  },
  'ucam': {
    name: 'Ucam',
    category: 'basket',
    price: 95,
    description: 'Official Ucam basketball jersey from the Cruzar collection.'
  },
  'villeurbanne': {
    name: 'Villeurbanne',
    category: 'basket',
    price: 95,
    description: 'Official Villeurbanne basketball jersey from the Cruzar collection.'
  },
  'virtus': {
    name: 'Virtus',
    category: 'basket',
    price: 95,
    description: 'Official Virtus basketball jersey from the Cruzar collection.'
  },
  'vla': {
    name: 'VLA',
    category: 'basket',
    price: 95,
    description: 'Official VLA basketball jersey from the Cruzar collection.'
  },
  'yugoslavia': {
    name: 'Yugoslavia',
    category: 'basket',
    price: 95,
    description: 'Official Yugoslavia basketball jersey from the Cruzar collection.'
  },
  'zalgiris': {
    name: 'Zalgiris',
    category: 'basket',
    price: 95,
    description: 'Official Zalgiris basketball jersey from the Cruzar collection.'
  },
  'zaragoza': {
    name: 'Zaragoza',
    category: 'basket',
    price: 95,
    description: 'Official Zaragoza basketball jersey from the Cruzar collection.'
  }
}

export type TeamCatalogKey = keyof typeof teamCatalog

export const getTeamCatalog = () => teamCatalog

export const getTeamCatalogEntry = (key: string) => teamCatalog[key] || null
