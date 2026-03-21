const Order = require('../models/Order');
const { generateOrderNumber } = require('../utils/orderNumberGenerator');

// @desc    Update order status (generic)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        const { status } = req.body;
        const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Preparing'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        if (order) {
            order.orderStatus = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (can be guest or logged-in user)
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            customerDetails,
            totalAmount,
            deliveryMethod,
            paymentMethod,
            deliveryFee,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            // Generate production-style order number
            const orderNumber = await generateOrderNumber();

            const order = new Order({
                userId: req.user ? req.user._id : null, // Link to user if logged in
                orderNumber,
                orderItems,
                customerDetails,
                totalAmount,
                deliveryMethod,
                paymentMethod,
                deliveryFee,
            });

            const createdOrder = await order.save();

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = 'Delivered';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to preparing
// @route   PUT /api/orders/:id/prepare
// @access  Private/Admin
const updateOrderToPreparing = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = 'Preparing';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await Order.deleteOne({ _id: order._id });
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPreparing,
    getMyOrders,
    deleteOrder,
    updateOrderStatus,
};
