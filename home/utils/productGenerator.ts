import type { Product, Category, CategoryType } from '~/types'
import { teamCatalog } from '~/shared/catalog'

// Core product metadata now lives in shared/catalog.ts
async function getImagesForTeam(teamKey: string, category: CategoryType): Promise<string[]> {
  const { getTeamImages } = await import('~/utils/cloudinaryImageLoader')
  return getTeamImages(teamKey, category)
}

export async function generateProducts(): Promise<Product[]> {
  const products: Product[] = []

  for (const [teamKey, teamInfo] of Object.entries(teamCatalog)) {
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
      totalImages: images.length, // Store the actual total count
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
    },
    {
      id: 'national_retro',
      name: 'Camisetas Retro Selecciones',
      slug: 'national_retro',
      description: 'Camisetas retro y vintage de selecciones nacionales de fútbol'
    }
  ]
}

// Note: Image loading is now handled by cloudinaryImageLoader.ts with environment-aware loading
// Development: Uses local images via imageManifest.ts
// Production: Uses optimized Cloudinary URLs with automatic transformations
