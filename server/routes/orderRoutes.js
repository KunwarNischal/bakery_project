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
const { protect, admin } = require('../controllers/authController');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/prepare').put(protect, admin, updateOrderToPreparing);
router.route('/:id').delete(protect, admin, deleteOrder);

module.exports = router;

