// Mock data for development
const mockCategories = [
  {
    id: '1',
    name: 'Ropa',
    slug: 'ropa',
    description: 'Ropa deportiva de alto rendimiento',
    image: 'https://example.com/category-ropa.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Calzado',
    slug: 'calzado',
    description: 'Calzado deportivo profesional',
    image: 'https://example.com/category-calzado.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Accesorios deportivos',
    image: 'https://example.com/category-accesorios.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    // TODO: Replace with Firestore query
    res.json({
      success: true,
      data: mockCategories,
      total: mockCategories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Replace with Firestore query
    const category = mockCategories.find(c => c.id === id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    // TODO: Replace with Firestore create
    const newCategory = {
      id: String(Date.now()),
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, error: 'Failed to create category' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // TODO: Replace with Firestore update
    const category = mockCategories.find(c => c.id === id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const updatedCategory = {
      ...category,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, error: 'Failed to update category' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Replace with Firestore delete
    const category = mockCategories.find(c => c.id === id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, error: 'Failed to delete category' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
