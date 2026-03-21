const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        description: 'Customer who placed the order (null for guest orders)'
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true,
        index: true,
        description: 'Human-readable order number in format HMB-YYYYMMDD-XXXXX'
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        }
    ],
    customerDetails: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String },
        notes: { type: String },
    },
    deliveryMethod: { type: String },
    paymentMethod: { type: String, default: 'Cash On Delivery' },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Preparing', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
