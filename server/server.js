const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

// Import routes with error handling
let authRoutes, productRoutes, orderRoutes, categoryRoutes;

try {
    authRoutes = require('./routes/authRoutes');
    productRoutes = require('./routes/productRoutes');
    orderRoutes = require('./routes/orderRoutes');
    categoryRoutes = require('./routes/categoryRoutes');
    console.log('✅ All routes loaded successfully');
} catch (err) {
    console.error('❌ Error loading routes:', err.message);
    authRoutes = (req, res) => res.json({ error: 'Routes not loaded' });
    productRoutes = (req, res) => res.json({ error: 'Routes not loaded' });
    orderRoutes = (req, res) => res.json({ error: 'Routes not loaded' });
    categoryRoutes = (req, res) => res.json({ error: 'Routes not loaded' });
}

const app = express();

// Connect Database (but don't crash if it fails)
console.log('🔍 Attempting database connection...');
console.log('📍 MONGO_URI:', process.env.MONGO_URI ? 'Set' : '❌ NOT SET');
connectDB().catch(err => {
    console.error('⚠️ Database connection failed:', err.message);
});

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
    try {
        res.json({ 
            status: 'Hatemalo Bakery API Running ✅',
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString(),
            mongodb: process.env.MONGO_URI ? '✅ Configured' : '❌ NOT CONFIGURED - Add MONGO_URI to Vercel env',
            version: '1.0.0'
        });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// API status endpoint for debugging
app.get('/api/status', (req, res) => {
    res.json({
        status: 'Active',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: {
            nodeEnv: process.env.NODE_ENV,
            mongoUri: process.env.MONGO_URI ? 'Set' : 'NOT SET',
            jwtSecret: process.env.JWT_SECRET ? 'Set' : 'NOT SET'
        }
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
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    };
    
    console.error('🔴 ERROR:', errorDetails);
    
    // Send appropriate response
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        status: statusCode,
        path: req.path,
        ...(process.env.NODE_ENV === 'development' && { error: err.stack })
    });
});

// Vercel serverless export (handler for Vercel Functions)
module.exports = app;

// Start server only if not in Vercel (Vercel handles this automatically)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`\n✅ Hatemalo Bakery Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🗄️  Database: ${process.env.MONGO_URI ? 'MongoDB URI Set' : '⚠️  MongoDB URI NOT SET'}\n`);
    });
}

// For Vercel serverless function
if (process.env.VERCEL) {
    console.log('🚀 Running on Vercel serverless platform');
}
