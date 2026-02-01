const { db, admin } = require('../config/firebase');

const productsCollection = db.collection('products');

// Helper to convert Firestore doc to plain object with id
const docToProduct = (doc) => {
  const data = doc.data();
  const createdAt = data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null;
  const updatedAt = data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null;
  return {
    id: doc.id,
    ...data,
    createdAt,
    updatedAt,
    lastModified: updatedAt || createdAt // Alias for back-office compatibility
  };
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
    const products = snapshot.docs.map(docToProduct);

    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: docToProduct(doc) });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const now = admin.firestore.FieldValue.serverTimestamp();

    const newProduct = {
      name: productData.name || '',
      slug: productData.slug || '',
      description: productData.description || '',
      price: productData.price || 0,
      originalPrice: productData.originalPrice || null,
      categoryId: productData.categoryId || '',
      images: productData.images || [],
      selectedImages: productData.selectedImages || productData.images || [],
      allAvailableImages: productData.allAvailableImages || productData.images || [],
      cloudinaryFolderPath: productData.cloudinaryFolderPath || null,
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      isActive: productData.isActive ?? true,
      inStock: productData.inStock ?? true,
      featured: productData.featured ?? false,
      stockStatus: productData.stockStatus || 'in_stock',
      createdAt: now,
      updatedAt: now
    };

    // Use provided ID if available, otherwise auto-generate
    let docRef;
    if (productData.id) {
      docRef = productsCollection.doc(productData.id);
      await docRef.set(newProduct);
    } else {
      docRef = await productsCollection.add(newProduct);
    }
    const createdDoc = await docRef.get();

    res.status(201).json({
      success: true,
      data: docToProduct(createdDoc)
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const docRef = productsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Product not found' });
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

    res.json({ success: true, data: docToProduct(updatedDoc) });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = productsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await docRef.delete();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
