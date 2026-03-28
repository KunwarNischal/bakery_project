const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate short-lived Access Token (15 minutes)
const generateAccessToken = (id, isAdmin = false) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1m',  // Short expiration for security
    });
};

// Generate long-lived Refresh Token (7 days)
const generateRefreshToken = (id, isAdmin = false) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
        expiresIn: '7d',  // Long expiration for convenience
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const loginCustomerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.matchPassword(password))) {
            // Prevent admin accounts from logging in as customers
            if (user.isAdmin) {
                return res.status(403).json({ message: 'Admin accounts cannot login from customer portal. Please use admin login.' });
            }
            
            // Generate Access Token (short-lived, for API requests)
            const accessToken = generateAccessToken(user._id, user.isAdmin);
            
            // Generate Refresh Token (long-lived, for getting new access tokens)
            const refreshToken = generateRefreshToken(user._id, user.isAdmin);
            
            // Set Refresh Token as httpOnly cookie (secure against XSS)
            // Use separate cookie for customer to avoid overwriting admin refresh token
            res.cookie('refreshTokenCustomer', refreshToken, {
                httpOnly: true,           // Cannot be accessed by JavaScript (XSS safe)
                secure: process.env.NODE_ENV === 'production',  // Only HTTPS in production
                sameSite: 'strict',       // CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                path: '/',
            });
            
            // Send Access Token in response (to be stored in memory or localStorage)
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                accessToken: accessToken,  // For API requests
                // refreshToken not sent - it's in the httpOnly cookie
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginAdminUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.matchPassword(password))) {
            // Only allow admin accounts to login as admin
            if (!user.isAdmin) {
                return res.status(403).json({ message: 'Only admin accounts can login from admin portal.' });
            }
            
            // Generate Access Token
            const accessToken = generateAccessToken(user._id, user.isAdmin);
            
            // Generate Refresh Token
            const refreshToken = generateRefreshToken(user._id, user.isAdmin);
            
            //Set Refresh Token as httpOnly cookie
            // Use separate cookie for admin to avoid overwriting customer refresh token
            res.cookie('refreshTokenAdmin', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            });
            
            // Send Access Token in response
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                accessToken: accessToken,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
        });

        if (user) {
            // Generate tokens after registration
            const accessToken = generateAccessToken(user._id, user.isAdmin);
            const refreshToken = generateRefreshToken(user._id, user.isAdmin);
            
            // Set Refresh Token as httpOnly cookie
            // New registrations are always customers, so use refreshTokenCustomer
            res.cookie('refreshTokenCustomer', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            });
            
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                accessToken: accessToken,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            accessToken: generateAccessToken(user._id, user.isAdmin),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout Handler - Clears the refresh token cookies
const logoutUser = async (req, res) => {
    try {
        // Clear both admin and customer refresh token cookies
        res.clearCookie('refreshTokenAdmin', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        res.clearCookie('refreshTokenCustomer', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Refresh Token Handler - Issues new Access Token using Refresh Token from cookie
const refreshAccessToken = async (req, res) => {
    try {
        // Check for either admin or customer refresh token
        // Admin tab has refreshTokenAdmin, Customer tab has refreshTokenCustomer
        const refreshToken = req.cookies.refreshTokenAdmin || req.cookies.refreshTokenCustomer;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        // Verify the refresh token
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // Find user and verify they still exist
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Generate new Access Token
        const newAccessToken = generateAccessToken(user._id, user.isAdmin);

        res.status(200).json({
            accessToken: newAccessToken,
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        res.status(401).json({ message: 'Failed to refresh token' });
    }
};

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};



const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin === true) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = {
    loginCustomerUser,
    loginAdminUser,
    registerUser,
    verifyUser,
    logoutUser,
    refreshAccessToken,
    protect,
    admin
};
