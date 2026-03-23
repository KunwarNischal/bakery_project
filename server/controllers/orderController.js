const Order = require('../models/Order');
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
            const orderNumber = await generateOrderNumber();

            const order = new Order({
                userId: req.user ? req.user._id : null,
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

const getMyOrders = async (req, res) => {
    try {
        
        const orders = await Order.find({
            $or: [
                { userId: req.user._id },
                { 'customerDetails.email': req.user.email }
            ]
        }).sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error('Error fetching myorders:', error);
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const generateOrderNumber = async () => {
    try {
        const totalOrders = await Order.countDocuments({});

        const orderNumber = `HMB-${totalOrders + 1}`;

        return orderNumber;
    } catch (error) {
        console.error('Error generating order number:', error);
        throw new Error('Failed to generate order number');
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
    generateOrderNumber
};
