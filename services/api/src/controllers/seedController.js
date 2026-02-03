const { db, admin } = require('../config/firebase');

const productTypesCollection = db.collection('productTypes');
const leaguesCollection = db.collection('leagues');
const productsCollection = db.collection('products');

// Seed data for product types
const productTypesData = [
  { name: 'Camisetas', slug: 'camisetas', order: 1, isActive: true },
  { name: 'Shorts', slug: 'shorts', order: 2, isActive: true },
  { name: 'Kit Niños', slug: 'kit-ninos', order: 3, isActive: true },
  { name: 'Otros Productos', slug: 'otros-productos', order: 4, isActive: true }
];

// Seed data for leagues with applicable types
const leaguesData = [
  { name: 'Fútbol Argentino', slug: 'futbol-argentino', order: 1, isActive: true, applicableTypes: ['camisetas', 'shorts', 'kit-ninos'] },
  { name: 'Premier League', slug: 'premier-league', order: 2, isActive: true, applicableTypes: ['camisetas', 'shorts', 'kit-ninos'] },
  { name: 'La Liga', slug: 'la-liga', order: 3, isActive: true, applicableTypes: ['camisetas', 'shorts', 'kit-ninos'] },
  { name: 'Serie A', slug: 'serie-a', order: 4, isActive: true, applicableTypes: ['camisetas', 'shorts', 'kit-ninos'] },
  { name: 'Bundesliga', slug: 'bundesliga', order: 5, isActive: true, applicableTypes: ['camisetas', 'shorts', 'kit-ninos'] },
  { name: 'Brasileirão', slug: 'brasileirao', order: 6, isActive: true, applicableTypes: ['camisetas', 'shorts', 'kit-ninos'] },
  { name: 'Resto del Mundo', slug: 'resto-del-mundo', order: 7, isActive: true, applicableTypes: ['camisetas', 'shorts', 'kit-ninos'] },
  { name: 'Selecciones', slug: 'selecciones', order: 8, isActive: true, applicableTypes: ['camisetas', 'shorts', 'kit-ninos'] },
  { name: 'Básquet', slug: 'basquet', order: 9, isActive: true, applicableTypes: ['camisetas', 'shorts'] },
  { name: 'Otros Deportes', slug: 'otros-deportes', order: 10, isActive: true, applicableTypes: ['camisetas'] },
  { name: 'Pelotas', slug: 'pelotas', order: 11, isActive: true, applicableTypes: ['otros-productos'] },
  { name: 'Guantes', slug: 'guantes', order: 12, isActive: true, applicableTypes: ['otros-productos'] },
  { name: 'Botines', slug: 'botines', order: 13, isActive: true, applicableTypes: ['otros-productos'] },
  { name: 'Abrigos', slug: 'abrigos', order: 14, isActive: true, applicableTypes: ['otros-productos'] },
  { name: 'Ropa de Entrenamiento', slug: 'ropa-de-entrenamiento', order: 15, isActive: true, applicableTypes: ['otros-productos'] }
];

// Seed categories (product types and leagues)
const seedCategories = async (req, res) => {
  try {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const batch = db.batch();

    // Clear existing data
    const existingTypes = await productTypesCollection.get();
    existingTypes.docs.forEach(doc => batch.delete(doc.ref));

    const existingLeagues = await leaguesCollection.get();
    existingLeagues.docs.forEach(doc => batch.delete(doc.ref));

    // Add product types
    for (const type of productTypesData) {
      const docRef = productTypesCollection.doc();
      batch.set(docRef, {
        ...type,
        createdAt: now,
        updatedAt: now
      });
    }

    // Add leagues
    for (const league of leaguesData) {
      const docRef = leaguesCollection.doc();
      batch.set(docRef, {
        ...league,
        createdAt: now,
        updatedAt: now
      });
    }

    await batch.commit();

    res.json({
      success: true,
      message: 'Categories seeded successfully',
      data: {
        productTypesCreated: productTypesData.length,
        leaguesCreated: leaguesData.length
      }
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed categories',
      message: error.message
    });
  }
};

// Mapping from old category slugs to new productType and league
// Adjust this mapping based on your existing categories
const categoryMigrationMap = {
  // Football leagues -> camisetas + respective league
  'futbol-argentino': { productType: 'camisetas', league: 'futbol-argentino' },
  'premier-league': { productType: 'camisetas', league: 'premier-league' },
  'la-liga': { productType: 'camisetas', league: 'la-liga' },
  'serie-a': { productType: 'camisetas', league: 'serie-a' },
  'bundesliga': { productType: 'camisetas', league: 'bundesliga' },
  'brasileirao': { productType: 'camisetas', league: 'brasileirao' },
  'resto-del-mundo': { productType: 'camisetas', league: 'resto-del-mundo' },
  'selecciones': { productType: 'camisetas', league: 'selecciones' },
  'basquet': { productType: 'camisetas', league: 'basquet' },
  'otros-deportes': { productType: 'camisetas', league: 'otros-deportes' },
  // Other products
  'pelotas': { productType: 'otros-productos', league: 'pelotas' },
  'guantes': { productType: 'otros-productos', league: 'guantes' },
  'botines': { productType: 'otros-productos', league: 'botines' },
  'abrigos': { productType: 'otros-productos', league: 'abrigos' },
  'ropa-de-entrenamiento': { productType: 'otros-productos', league: 'ropa-de-entrenamiento' },
  // Product types as categories (if they used type names as category)
  'camisetas': { productType: 'camisetas', league: '' },
  'shorts': { productType: 'shorts', league: '' },
  'kit-ninos': { productType: 'kit-ninos', league: '' },
  'otros-productos': { productType: 'otros-productos', league: '' }
};

// Migrate existing products to use productType and league fields
const migrateProducts = async (req, res) => {
  try {
    const snapshot = await productsCollection.get();
    const products = snapshot.docs;

    if (products.length === 0) {
      return res.json({
        success: true,
        message: 'No products found to migrate',
        data: { migrated: 0, skipped: 0, errors: [] }
      });
    }

    const results = {
      migrated: 0,
      skipped: 0,
      errors: [],
      details: []
    };

    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();

    for (const doc of products) {
      const product = doc.data();
      const productId = doc.id;
      const categorySlug = product.category || product.categoryId || '';

      // Skip if already has productType set
      if (product.productType) {
        results.skipped++;
        results.details.push({
          id: productId,
          name: product.name,
          status: 'skipped',
          reason: 'Already has productType'
        });
        continue;
      }

      // Try to map from old category
      const mapping = categoryMigrationMap[categorySlug];

      if (mapping) {
        batch.update(doc.ref, {
          productType: mapping.productType,
          league: mapping.league,
          updatedAt: now
        });
        results.migrated++;
        results.details.push({
          id: productId,
          name: product.name,
          status: 'migrated',
          oldCategory: categorySlug,
          newProductType: mapping.productType,
          newLeague: mapping.league
        });
      } else {
        // Default to camisetas if no mapping found
        batch.update(doc.ref, {
          productType: 'camisetas',
          league: '',
          updatedAt: now
        });
        results.migrated++;
        results.details.push({
          id: productId,
          name: product.name,
          status: 'migrated-default',
          oldCategory: categorySlug,
          newProductType: 'camisetas',
          newLeague: '',
          note: 'No mapping found, used default'
        });
      }
    }

    await batch.commit();

    res.json({
      success: true,
      message: `Migration completed. ${results.migrated} products migrated, ${results.skipped} skipped.`,
      data: results
    });
  } catch (error) {
    console.error('Error migrating products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to migrate products',
      message: error.message
    });
  }
};

module.exports = {
  seedCategories,
  migrateProducts
};
