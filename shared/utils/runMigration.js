const fs = require('fs').promises;
const path = require('path');

// Read the current URL mapping from main store
async function migrateFromMainStore() {
  console.log('🔄 Starting migration from main store...');

  const HOME_DIR = '/Users/andreavictorialopezpalomeque/Documents/personal-projects/cruzar-deportes/home';

  // Sample team data based on what exists in the main store
  const teamData = {
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

    // National Retro Teams
    'argentina_1986': {
      name: 'Argentina Retro 1986',
      category: 'national_retro',
      price: 130,
      originalPrice: 160,
      description: 'Legendary Argentina national team jersey from 1986 World Cup with Maradona'
    },
    'netherlands_1988': {
      name: 'Netherlands Retro 1988',
      category: 'national_retro',
      price: 110,
      originalPrice: 130,
      description: 'Legendary Netherlands Euro 1988 Champions jersey'
    }
  };

  // Read the URL mapping to get the actual Cloudinary URLs
  let urlMapping = {};
  try {
    const urlMappingPath = path.join(HOME_DIR, 'scripts/url-mapping.json');
    const mappingData = await fs.readFile(urlMappingPath, 'utf-8');
    urlMapping = JSON.parse(mappingData);
    console.log(`📁 Loaded ${Object.keys(urlMapping).length} image URLs from mapping`);
  } catch (error) {
    console.warn('⚠️ Could not read URL mapping, proceeding without image URLs');
  }

  // Convert to SharedProduct format
  const products = {};

  for (const [teamKey, teamInfo] of Object.entries(teamData)) {
    // Get all images for this team from URL mapping
    const teamPattern = `/images/${teamInfo.category}/${teamKey}/`;
    const teamUrls = Object.entries(urlMapping)
      .filter(([localPath]) => localPath.startsWith(teamPattern))
      .map(([, cloudinaryUrl]) => cloudinaryUrl);

    const product = {
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
      createdAt: new Date().toISOString(),
      createdBy: 'scraper'
    };

    products[product.id] = product;
    console.log(`✨ Processed ${teamInfo.name} (${teamUrls.length} images)`);
  }

  // Create the complete database
  const now = new Date().toISOString();
  const database = {
    version: '1.0.0',
    lastUpdated: now,
    products,
    categories: {
      afc: { id: 'afc', name: 'Equipos AFC', slug: 'afc', productCount: 0, lastModified: now },
      caf: { id: 'caf', name: 'Equipos CAF', slug: 'caf', productCount: 0, lastModified: now },
      eredivisie: { id: 'eredivisie', name: 'Equipos Eredivisie', slug: 'eredivisie', productCount: 0, lastModified: now },
      lpf_afa: { id: 'lpf_afa', name: 'Liga Profesional Argentina', slug: 'lpf_afa', productCount: 0, lastModified: now },
      serie_a_enilive: { id: 'serie_a_enilive', name: 'Serie A Enilive', slug: 'serie_a_enilive', productCount: 0, lastModified: now },
      national_retro: { id: 'national_retro', name: 'Camisetas Retro Selecciones', slug: 'national_retro', productCount: 0, lastModified: now }
    },
    metadata: {
      totalProducts: Object.keys(products).length,
      totalImages: Object.values(products).reduce((total, p) => total + p.selectedImages.length, 0),
      lastSync: now
    }
  };

  // Update category counts
  for (const categoryId of Object.keys(database.categories)) {
    database.categories[categoryId].productCount = Object.values(products)
      .filter(p => p.category === categoryId).length;
  }

  // Write to shared products.json
  const sharedDir = '/Users/andreavictorialopezpalomeque/Documents/personal-projects/cruzar-deportes/shared';
  const productsFile = path.join(sharedDir, 'products.json');

  await fs.writeFile(productsFile, JSON.stringify(database, null, 2), 'utf-8');

  console.log(`✅ Migration completed successfully!`);
  console.log(`📊 Migrated ${database.metadata.totalProducts} products`);
  console.log(`🖼️ Migrated ${database.metadata.totalImages} selected images`);
  console.log(`📁 Products saved to: ${productsFile}`);

  return database;
}

// Run the migration
migrateFromMainStore().catch(console.error);
