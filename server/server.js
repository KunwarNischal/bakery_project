const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS Configuration - Allow frontend to access backend
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        process.env.FRONTEND_URL || 'http://localhost:3000',
        /vercel\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(morgan('dev'));

// Static folders for uploads and assets (if they exist)
try {
    const uploadsPath = path.join(__dirname, '/public/uploads');
    const assetsPath = path.join(__dirname, '../client/public/assets');
    app.use('/uploads', express.static(uploadsPath));
    app.use('/assets', express.static(assetsPath));
} catch (e) {
    console.log('Static file folders not available - using cloud storage instead');
}

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'Hatemalo Bakery API Running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err })
    });
});

// Start server only if not in Vercel (Vercel handles this)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`\n✅ Hatemalo Bakery Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🗄️  Database: ${process.env.MONGO_URI ? 'MongoDB Connected' : 'MongoDB Not Connected'}\n`);
    });
}

module.exports = app;
