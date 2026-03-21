const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/hatemalo_bakery';
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not configured. Set MONGO_URI or MONGODB_URI environment variable.');
    }
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Don't crash the app, just log the error
    // Return false so routes can handle the error
    return false;
  }
};

module.exports = connectDB;
