const { db, admin } = require('../config/firebase');

const productTypesCollection = db.collection('productTypes');
const leaguesCollection = db.collection('leagues');

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

module.exports = {
  seedCategories
};
