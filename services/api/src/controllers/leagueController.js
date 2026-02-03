const { db, admin } = require('../config/firebase');

const leaguesCollection = db.collection('leagues');

// Helper to convert Firestore doc to plain object with id
const docToLeague = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
  };
};

// Get all leagues
const getAllLeagues = async (req, res) => {
  try {
    const snapshot = await leaguesCollection.orderBy('order', 'asc').get();
    const leagues = snapshot.docs.map(docToLeague);

    res.json({
      success: true,
      data: leagues,
      total: leagues.length
    });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leagues',
      message: error.message
    });
  }
};

// Get single league by ID
const getLeagueById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await leaguesCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'League not found' });
    }

    res.json({ success: true, data: docToLeague(doc) });
  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch league',
      message: error.message
    });
  }
};

// Get leagues by product type slug
const getLeaguesByProductType = async (req, res) => {
  try {
    const { slug } = req.params;
    const snapshot = await leaguesCollection
      .where('applicableTypes', 'array-contains', slug)
      .orderBy('order', 'asc')
      .get();
    const leagues = snapshot.docs.map(docToLeague);

    res.json({
      success: true,
      data: leagues,
      total: leagues.length
    });
  } catch (error) {
    console.error('Error fetching leagues by product type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leagues by product type',
      message: error.message
    });
  }
};

// Create new league
const createLeague = async (req, res) => {
  try {
    const leagueData = req.body;
    const now = admin.firestore.FieldValue.serverTimestamp();

    const newLeague = {
      name: leagueData.name || '',
      slug: leagueData.slug || '',
      order: leagueData.order ?? 0,
      isActive: leagueData.isActive ?? true,
      applicableTypes: leagueData.applicableTypes || [],
      createdAt: now,
      updatedAt: now
    };

    const docRef = await leaguesCollection.add(newLeague);
    const createdDoc = await docRef.get();

    res.status(201).json({
      success: true,
      data: docToLeague(createdDoc)
    });
  } catch (error) {
    console.error('Error creating league:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create league',
      message: error.message
    });
  }
};

// Update league
const updateLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const docRef = leaguesCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'League not found' });
    }

    const dataToUpdate = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Remove id from update data if present
    delete dataToUpdate.id;
    delete dataToUpdate.createdAt;

    await docRef.update(dataToUpdate);
    const updatedDoc = await docRef.get();

    res.json({ success: true, data: docToLeague(updatedDoc) });
  } catch (error) {
    console.error('Error updating league:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update league',
      message: error.message
    });
  }
};

// Delete league
const deleteLeague = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = leaguesCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'League not found' });
    }

    await docRef.delete();

    res.json({ success: true, message: 'League deleted successfully' });
  } catch (error) {
    console.error('Error deleting league:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete league',
      message: error.message
    });
  }
};

module.exports = {
  getAllLeagues,
  getLeagueById,
  getLeaguesByProductType,
  createLeague,
  updateLeague,
  deleteLeague
};
