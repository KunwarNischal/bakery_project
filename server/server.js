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

// Connect Database (but don't crash if it fails)
connectDB().catch(err => console.error('Database connection failed:', err));

// Init Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS Configuration - Allow frontend to access backend
const corsOptions = {
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            process.env.FRONTEND_URL || '',
        ];
        
        // Allow all Vercel domains
        if (!origin || 
            allowedOrigins.includes(origin) || 
            origin.includes('vercel.app') ||
            origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now (more permissive)
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200,
    maxAge: 86400
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
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
        timestamp: new Date().toISOString(),
        mongodb: process.env.MONGO_URI || process.env.MONGODB_URI ? 'Configured' : 'Not Configured ⚠️'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        status: err.status || 500,
        ...(process.env.NODE_ENV === 'development' && { error: err.stack })
    });
});

// Vercel serverless export
module.exports = (req, res) => app(req, res);

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
