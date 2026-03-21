const Order = require('../models/Order');

/**
 * Generates a simple sequential order number
 * Format: HMB-1, HMB-2, HMB-3, etc.
 * 
 * HMB = Hatemalo Bakery (company prefix)
 * Sequential counter starting from 1
 */
const generateOrderNumber = async () => {
    try {
        // Count total orders in database
        const totalOrders = await Order.countDocuments({});

        // Next order number is total + 1
        const orderNumber = `HMB-${totalOrders + 1}`;

        return orderNumber;
    } catch (error) {
        console.error('Error generating order number:', error);
        throw new Error('Failed to generate order number');
    }
};

module.exports = { generateOrderNumber };
