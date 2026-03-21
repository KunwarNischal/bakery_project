const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPreparing,
    getMyOrders,
    deleteOrder,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes (guest or logged in)
router.route('/')
    .post(protect, addOrderItems)  // Logged in users can place orders
    .get(protect, admin, getOrders);  // Only admins can view all orders

// Customer routes
router.route('/myorders').get(protect, getMyOrders);  // Customers can view their orders

// Admin routes
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/prepare').put(protect, admin, updateOrderToPreparing);
router.route('/:id').delete(protect, admin, deleteOrder);

module.exports = router;
