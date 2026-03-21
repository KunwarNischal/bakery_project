const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: Number, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  icon: { type: String },
  description: { type: String },
  ingredients: [String],
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
