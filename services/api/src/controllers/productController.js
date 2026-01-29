// Mock data for development
const mockProducts = [
  {
    id: '1',
    name: 'Camiseta Deportiva',
    description: 'Camiseta de alto rendimiento',
    price: 29990,
    category: 'ropa',
    stock: 50,
    images: ['https://example.com/image1.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Zapatillas Running',
    description: 'Zapatillas para correr profesionales',
    price: 89990,
    category: 'calzado',
    stock: 25,
    images: ['https://example.com/image2.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all products
const getAllProducts = async (req, res) => {
  try {
    // TODO: Replace with Firestore query
    res.json({
      success: true,
      data: mockProducts,
      total: mockProducts.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Replace with Firestore query
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    // TODO: Replace with Firestore create
    const newProduct = {
      id: String(Date.now()),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // TODO: Replace with Firestore update
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const updatedProduct = {
      ...product,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Replace with Firestore delete
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
