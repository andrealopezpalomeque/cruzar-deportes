const { db, admin } = require('../config/firebase');

const productTypesCollection = db.collection('productTypes');

// Helper to convert Firestore doc to plain object with id
const docToProductType = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
  };
};

// Get all product types
const getAllProductTypes = async (req, res) => {
  try {
    const snapshot = await productTypesCollection.orderBy('order', 'asc').get();
    const productTypes = snapshot.docs.map(docToProductType);

    res.json({
      success: true,
      data: productTypes,
      total: productTypes.length
    });
  } catch (error) {
    console.error('Error fetching product types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product types',
      message: error.message
    });
  }
};

// Get single product type by ID
const getProductTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await productTypesCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Product type not found' });
    }

    res.json({ success: true, data: docToProductType(doc) });
  } catch (error) {
    console.error('Error fetching product type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product type',
      message: error.message
    });
  }
};

// Create new product type
const createProductType = async (req, res) => {
  try {
    const productTypeData = req.body;
    const now = admin.firestore.FieldValue.serverTimestamp();

    const newProductType = {
      name: productTypeData.name || '',
      slug: productTypeData.slug || '',
      order: productTypeData.order ?? 0,
      isActive: productTypeData.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await productTypesCollection.add(newProductType);
    const createdDoc = await docRef.get();

    res.status(201).json({
      success: true,
      data: docToProductType(createdDoc)
    });
  } catch (error) {
    console.error('Error creating product type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product type',
      message: error.message
    });
  }
};

// Update product type
const updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const docRef = productTypesCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Product type not found' });
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

    res.json({ success: true, data: docToProductType(updatedDoc) });
  } catch (error) {
    console.error('Error updating product type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product type',
      message: error.message
    });
  }
};

// Delete product type
const deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = productTypesCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Product type not found' });
    }

    await docRef.delete();

    res.json({ success: true, message: 'Product type deleted successfully' });
  } catch (error) {
    console.error('Error deleting product type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product type',
      message: error.message
    });
  }
};

module.exports = {
  getAllProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType
};
