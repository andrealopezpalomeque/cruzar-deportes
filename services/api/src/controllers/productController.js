const { db, admin } = require('../config/firebase');
const cloudinary = require('../config/cloudinary');

const productsCollection = db.collection('products');

// Helper: generate URL-friendly slug
const slugify = (text) => {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper: convert Firestore doc to plain object with id
const docToProduct = (doc) => {
  const data = doc.data();
  const createdAt = data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null;
  const updatedAt = data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null;
  return {
    id: doc.id,
    ...data,
    createdAt,
    updatedAt,
    lastModified: updatedAt || createdAt
  };
};

// Get all products (public, supports query filters)
const getAllProducts = async (req, res) => {
  try {
    const { category, productType, league, featured, limit } = req.query;

    let query = productsCollection.orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    let products = snapshot.docs.map(docToProduct);

    // Apply filters in-memory (Firestore composite index limitations)
    if (category) {
      products = products.filter(p => p.categoryId === category);
    }
    if (productType) {
      products = products.filter(p => p.productType === productType);
    }
    if (league) {
      products = products.filter(p => p.league === league);
    }
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }
    if (limit) {
      products = products.slice(0, parseInt(limit, 10));
    }

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

// Get single product by ID or slug
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try by document ID first
    const doc = await productsCollection.doc(id).get();
    if (doc.exists) {
      return res.json({ success: true, data: docToProduct(doc) });
    }

    // Fall back to slug lookup
    const slugSnapshot = await productsCollection.where('slug', '==', id).limit(1).get();
    if (!slugSnapshot.empty) {
      return res.json({ success: true, data: docToProduct(slugSnapshot.docs[0]) });
    }

    res.status(404).json({ success: false, error: 'Product not found' });
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
      slug: productData.slug || slugify(productData.name),
      description: productData.description || '',
      price: productData.price || 0,
      originalPrice: productData.originalPrice || null,
      categoryId: productData.categoryId || '',
      productType: productData.productType || '',
      league: productData.league || '',
      images: productData.images || [],
      selectedImages: productData.selectedImages || productData.images || [],
      allAvailableImages: productData.allAvailableImages || productData.images || [],
      cloudinaryFolderPath: productData.cloudinaryFolderPath || null,
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      isActive: productData.isActive ?? true,
      inStock: productData.inStock ?? true,
      featured: productData.featured ?? false,
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

    // Regenerate slug if name changed and slug wasn't explicitly provided
    if (updateData.name && !updateData.slug) {
      updateData.slug = slugify(updateData.name);
    }

    const dataToUpdate = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Protect immutable fields
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

// Delete product (with Cloudinary image cleanup)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = productsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Clean up Cloudinary images
    const productData = doc.data();
    const images = productData.images || productData.selectedImages || [];
    for (const image of images) {
      const publicId = typeof image === 'string' ? null : image.publicId;
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error(`Failed to delete Cloudinary image ${publicId}:`, err.message);
        }
      }
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
