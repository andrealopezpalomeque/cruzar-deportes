import type { Product, Category } from '~/types'

interface ImageMapping {
  [key: string]: string[]
}

// Map from scraped folder names to product information
const teamData: Record<string, {
  name: string
  category: 'afc' | 'caf'
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
  }
}

async function getImagesForTeam(teamKey: string, category: 'afc' | 'caf'): Promise<string[]> {
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
      name: 'AFC Teams',
      slug: 'afc',
      description: 'Asian Football Confederation teams jerseys and merchandise'
    },
    {
      id: 'caf', 
      name: 'CAF Teams',
      slug: 'caf',
      description: 'Confederation of African Football teams jerseys and merchandise'
    }
  ]
}

// Helper function to get actual image files from the public directory
export function getActualImages(teamKey: string, category: 'afc' | 'caf'): string[] {
  // This would typically be done server-side or with a build-time script
  // For now, we'll return placeholder paths that match our folder structure
  const basePath = `/images/${category}/${teamKey}`
  
  // Based on the file structure we saw, generate actual image paths
  const imageCount = getImageCountForTeam(teamKey)
  const images: string[] = []
  
  for (let i = 0; i < imageCount; i++) {
    images.push(`${basePath}/${teamKey}_photo_img_${i}_*.jpg`)
  }
  
  return images
}

function getImageCountForTeam(teamKey: string): number {
  // Based on the actual scraped data we saw
  const imageCounts: Record<string, number> = {
    'johor': 15,
    'johor_kid_kit': 2,
    'seoul_fc': 7,
    'suwon_fc': 5,
    'suwon_samsung': 2,
    'ulsan_hd': 8,
    'al_ahly': 4,
    'cs_constantine_player_version': 7,
    'kaizer_chiefs': 14,
    'mamelodi_player_version': 18,
    'orlando_pirates': 12,
    'young_africans': 6
  }
  
  return imageCounts[teamKey] || 5
}