const { db, admin } = require('../config/firebase');

const ordersCollection = db.collection('orders');
const countersCollection = db.collection('counters');

// Helper to convert Firestore doc to plain object with id
const docToOrder = (doc) => {
  const data = doc.data();
  const createdAt = data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null;
  const updatedAt = data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null;
  return {
    id: doc.id,
    ...data,
    createdAt,
    updatedAt
  };
};

// Generate next order number (CD-0001, CD-0002, etc.)
const generateOrderNumber = async () => {
  const counterRef = countersCollection.doc('orders');

  const result = await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    let nextNumber = 1;
    if (counterDoc.exists) {
      nextNumber = (counterDoc.data().current || 0) + 1;
    }

    transaction.set(counterRef, { current: nextNumber }, { merge: true });

    return `CD-${String(nextNumber).padStart(4, '0')}`;
  });

  return result;
};

// Valid status values
const VALID_STATUSES = [
  'nuevo',
  'en_conversacion',
  'confirmado',
  'pagado',
  'enviado',
  'entregado',
  'cancelado'
];

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { status, limit: queryLimit, offset } = req.query;

    let query = ordersCollection.orderBy('createdAt', 'desc');

    // Filter by status if provided
    if (status && VALID_STATUSES.includes(status)) {
      query = ordersCollection
        .where('status', '==', status)
        .orderBy('createdAt', 'desc');
    }

    const snapshot = await query.get();
    let orders = snapshot.docs.map(docToOrder);

    // Apply pagination if provided
    const total = orders.length;
    if (offset) {
      orders = orders.slice(parseInt(offset));
    }
    if (queryLimit) {
      orders = orders.slice(0, parseInt(queryLimit));
    }

    res.json({
      success: true,
      data: orders,
      total
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ordersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: docToOrder(doc) });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
};

// Create new order (called by storefront - no auth required)
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const now = admin.firestore.FieldValue.serverTimestamp();

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Validate required fields
    if (!orderData.customer || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customer and items are required'
      });
    }

    const newOrder = {
      orderNumber,

      // Customer info
      customer: {
        name: orderData.customer.name || '',
        phone: orderData.customer.phone || '',
        email: orderData.customer.email || '',
        address: orderData.customer.address || ''
      },

      // Products ordered
      items: orderData.items.map(item => ({
        productId: item.productId || '',
        productName: item.productName || '',
        size: item.size || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        subtotal: item.subtotal || (item.unitPrice || 0) * (item.quantity || 1)
      })),

      // Totals
      totalItems: orderData.totalItems || orderData.items.reduce((sum, item) => sum + (item.quantity || 1), 0),
      totalAmount: orderData.totalAmount || 0,
      adjustedAmount: orderData.adjustedAmount || orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'transfer',

      // Tracking
      status: 'nuevo',
      notes: '',

      // Metadata
      contactado: false,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await ordersCollection.add(newOrder);
    const createdDoc = await docRef.get();

    res.status(201).json({
      success: true,
      data: docToOrder(createdDoc)
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
};

// Update order (full update)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const docRef = ordersCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Validate status if provided
    if (updateData.status && !VALID_STATUSES.includes(updateData.status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const dataToUpdate = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Remove fields that shouldn't be updated
    delete dataToUpdate.id;
    delete dataToUpdate.orderNumber;
    delete dataToUpdate.createdAt;

    await docRef.update(dataToUpdate);
    const updatedDoc = await docRef.get();

    res.json({ success: true, data: docToOrder(updatedDoc) });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order',
      message: error.message
    });
  }
};

// Quick status update
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, contactado } = req.body;

    const docRef = ordersCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Validate and set status if provided
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
        });
      }
      updateData.status = status;
    }

    // Set contactado if provided
    if (contactado !== undefined) {
      updateData.contactado = Boolean(contactado);
    }

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    res.json({ success: true, data: docToOrder(updatedDoc) });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      message: error.message
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = ordersCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    await docRef.delete();

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order',
      message: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
};
