import { promises as fs } from 'fs'
import { join } from 'path'
import type { SharedProduct, ProductDatabase, CategoryType } from '../types'

// Import the existing team data from main store
const HOME_DIR = '/Users/andreavictorialopezpalomeque/Documents/personal-projects/cruzar-deportes/home'

// Read the current productGenerator data and convert it to shared format
export async function migrateFromMainStore(): Promise<ProductDatabase> {
  // This is a simplified version - in reality, we'd parse the actual productGenerator.ts file
  // For now, I'll create a structure based on what we know exists

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

    // CAF Teams
    'al_ahly': {
      name: 'Al Ahly SC',
      category: 'caf',
      price: 65,
      description: 'Official Al Ahly SC jersey from Egyptian Premier League'
    },
    'kaizer_chiefs': {
      name: 'Kaizer Chiefs',
      category: 'caf',
      price: 70,
      description: 'Official Kaizer Chiefs jersey from DStv Premiership'
    },

    // Eredivisie Teams
    'ajax': {
      name: 'AFC Ajax',
      category: 'eredivisie',
      price: 85,
      originalPrice: 95,
      description: 'Official AFC Ajax jersey from Eredivisie'
    },
    'feyenoord': {
      name: 'Feyenoord Rotterdam',
      category: 'eredivisie',
      price: 80,
      originalPrice: 90,
      description: 'Official Feyenoord Rotterdam jersey from Eredivisie'
    },
    'psv': {
      name: 'PSV Eindhoven',
      category: 'eredivisie',
      price: 80,
      originalPrice: 90,
      description: 'Official PSV Eindhoven jersey from Eredivisie'
    },

    // Serie A Teams
    'jv_authentic': {
      name: 'Juventus Authentic',
      category: 'serie_a_enilive',
      price: 125,
      originalPrice: 145,
      description: 'Authentic Juventus jersey - player version from Serie A Enilive'
    },
    'milan_gk': {
      name: 'AC Milan Goalkeeper',
      category: 'serie_a_enilive',
      price: 80,
      description: 'Official AC Milan goalkeeper jersey from Serie A Enilive'
    },

    // LPF AFA Teams
    'boca': {
      name: 'Boca Juniors',
      category: 'lpf_afa',
      price: 85,
      originalPrice: 95,
      description: 'Official Boca Juniors jersey from Liga Profesional de Fútbol'
    },
    'river_plate': {
      name: 'River Plate',
      category: 'lpf_afa',
      price: 85,
      originalPrice: 95,
      description: 'Official River Plate jersey from Liga Profesional de Fútbol'
    },
    'racing': {
      name: 'Racing Club',
      category: 'lpf_afa',
      price: 80,
      description: 'Official Racing Club jersey from Liga Profesional de Fútbol'
    },

    // National Retro Teams
    'argentina_1986': {
      name: 'Argentina Retro 1986',
      category: 'national_retro',
      price: 130,
      originalPrice: 160,
      description: 'Legendary Argentina national team jersey from 1986 World Cup with Maradona'
    },
    'england_1966': {
      name: 'England Retro 1966',
      category: 'national_retro',
      price: 120,
      originalPrice: 150,
      description: 'Iconic England World Cup Winners 1966 jersey'
    },
    'netherlands_1988': {
      name: 'Netherlands Retro 1988',
      category: 'national_retro',
      price: 110,
      originalPrice: 130,
      description: 'Legendary Netherlands Euro 1988 Champions jersey'
    }
  }

  // Read the URL mapping to get the actual Cloudinary URLs
  let urlMapping: Record<string, string> = {}
  try {
    const urlMappingPath = join(HOME_DIR, 'scripts/url-mapping.json')
    const mappingData = await fs.readFile(urlMappingPath, 'utf-8')
    urlMapping = JSON.parse(mappingData)
  } catch (error) {
    console.warn('Could not read URL mapping, proceeding without image URLs')
  }

  // Convert to SharedProduct format
  const products: Record<string, SharedProduct> = {}

  for (const [teamKey, teamInfo] of Object.entries(teamData)) {
    // Get all images for this team from URL mapping
    const teamPattern = `/images/${teamInfo.category}/${teamKey}/`
    const teamUrls = Object.entries(urlMapping)
      .filter(([localPath]) => localPath.startsWith(teamPattern))
      .map(([, cloudinaryUrl]) => cloudinaryUrl)

    const product: SharedProduct = {
      id: `team-${teamKey}`,
      name: teamInfo.name,
      slug: teamKey.replace(/_/g, '-'),
      description: teamInfo.description,
      price: teamInfo.price,
      originalPrice: teamInfo.originalPrice,
      category: teamInfo.category,

      // Images - initially all available images are selected
      selectedImages: teamUrls.slice(0, 5), // First 5 images selected by default
      allAvailableImages: teamUrls,
      cloudinaryFolderPath: `cruzar-deportes/${teamInfo.category}/${teamKey}`,

      // Default product attributes
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Home', 'Away'],
      inStock: true,
      stockStatus: 'in_stock',
      featured: Math.random() > 0.7, // 30% chance of being featured

      // Metadata
      lastModified: new Date().toISOString(),
      isProcessed: false, // Needs admin curation
      createdAt: new Date().toISOString(),
      createdBy: 'scraper'
    }

    products[product.id] = product
  }

  // Create the complete database
  const database: ProductDatabase = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    products,
    categories: {
      afc: { id: 'afc', name: 'Equipos AFC', slug: 'afc', productCount: 0, lastModified: new Date().toISOString() },
      caf: { id: 'caf', name: 'Equipos CAF', slug: 'caf', productCount: 0, lastModified: new Date().toISOString() },
      eredivisie: { id: 'eredivisie', name: 'Equipos Eredivisie', slug: 'eredivisie', productCount: 0, lastModified: new Date().toISOString() },
      lpf_afa: { id: 'lpf_afa', name: 'Liga Profesional Argentina', slug: 'lpf_afa', productCount: 0, lastModified: new Date().toISOString() },
      serie_a_enilive: { id: 'serie_a_enilive', name: 'Serie A Enilive', slug: 'serie_a_enilive', productCount: 0, lastModified: new Date().toISOString() },
      national_retro: { id: 'national_retro', name: 'Camisetas Retro Selecciones', slug: 'national_retro', productCount: 0, lastModified: new Date().toISOString() }
    },
    metadata: {
      totalProducts: Object.keys(products).length,
      totalImages: Object.values(products).reduce((total, p) => total + p.selectedImages.length, 0),
      lastSync: new Date().toISOString()
    }
  }

  // Update category counts
  for (const categoryId of Object.keys(database.categories) as CategoryType[]) {
    database.categories[categoryId].productCount = Object.values(products)
      .filter(p => p.category === categoryId).length
  }

  return database
}

// Script to run the migration
export async function runMigration(): Promise<void> {
  console.log('🔄 Starting migration from main store...')

  try {
    const database = await migrateFromMainStore()

    // Write to shared products.json
    const sharedDir = '/Users/andreavictorialopezpalomeque/Documents/personal-projects/cruzar-deportes/shared'
    const productsFile = join(sharedDir, 'products.json')

    await fs.writeFile(productsFile, JSON.stringify(database, null, 2), 'utf-8')

    console.log(`✅ Migration completed successfully!`)
    console.log(`📊 Migrated ${database.metadata.totalProducts} products`)
    console.log(`🖼️ Migrated ${database.metadata.totalImages} selected images`)
    console.log(`📁 Products saved to: ${productsFile}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  runMigration().catch(console.error)
}