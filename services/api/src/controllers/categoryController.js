const { db, admin } = require('../config/firebase');

const categoriesCollection = db.collection('categories');

// Helper to convert Firestore doc to plain object with id
const docToCategory = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
  };
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const snapshot = await categoriesCollection.orderBy('order', 'asc').get();
    const categories = snapshot.docs.map(docToCategory);

    res.json({
      success: true,
      data: categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await categoriesCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, data: docToCategory(doc) });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category',
      message: error.message
    });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const now = admin.firestore.FieldValue.serverTimestamp();

    const newCategory = {
      name: categoryData.name || '',
      slug: categoryData.slug || '',
      description: categoryData.description || '',
      image: categoryData.image || null,
      order: categoryData.order ?? 0,
      isActive: categoryData.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await categoriesCollection.add(newCategory);
    const createdDoc = await docRef.get();

    res.status(201).json({
      success: true,
      data: docToCategory(createdDoc)
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category',
      message: error.message
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const docRef = categoriesCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Category not found' });
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

    res.json({ success: true, data: docToCategory(updatedDoc) });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category',
      message: error.message
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = categoriesCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    await docRef.delete();

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
      message: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
