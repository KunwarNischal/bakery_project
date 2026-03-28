/**
 * Global application constants
 * Centralizes all magic strings, enumerations, and fixed configurations
 */

export const ROUTES = {
    // Client Routes
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: (id) => `/products/${id}`,
    CART: '/cart',
    CHECKOUT: '/checkout',
    MY_ORDERS: '/my-orders',
    LOGIN: '/login',
    REGISTER: '/register',
    
    // Admin Routes
    ADMIN: '/admin',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_CATEGORIES: '/admin/categories',
    ADMIN_ORDERS: '/admin/orders',
};

export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN_CUSTOMER: '/auth/login',
        REGISTER_CUSTOMER: '/auth/register',
        LOGIN_ADMIN: '/auth/admin-login',
        VERIFY: '/auth/verify',
    },
    // Products
    PRODUCTS: {
        BASE: '/products',
        DETAIL: (id) => `/products/${id}`,
    },
    // Categories
    CATEGORIES: {
        BASE: '/categories',
    },
    // Orders
    ORDERS: {
        BASE: '/orders',
        MY_ORDERS: '/orders/my-orders',
        STATUS: (id) => `/orders/${id}/status`,
    }
};

export const STORAGE_KEYS = {
    CUSTOMER_TOKEN: 'customer_token',
    ADMIN_TOKEN: 'admin_token',
    USER_INFO: 'user_info',
    ADMIN_INFO: 'admin_info',
    CART_ITEMS: 'cart_items',
    THEME: 'theme_preference',
    ACTIVE_ROLE: 'active_role',  // sessionStorage only - tracks which role is active in this tab
};

// Object containing both the display value and the UI styling
export const ORDER_STATUS = {
    PENDING: { value: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
    PROCESSING: { value: 'Processing', color: 'text-blue-600 bg-blue-100' },
    SHIPPED: { value: 'Shipped', color: 'text-indigo-600 bg-indigo-100' },
    DELIVERED: { value: 'Delivered', color: 'text-green-600 bg-green-100' },
    CANCELLED: { value: 'Cancelled', color: 'text-red-600 bg-red-100' },
};

export const DELIVERY_METHODS = {
    STANDARD: 'Hatemalo Bakery Delivery (All Over Nepal)',
    PICKUP: 'Store Pickup',
};

export const PAYMENT_METHODS = {
    ESEWA: 'eSewa',
    KHALTI: 'Khalti',
    CASH_ON_DELIVERY: 'Cash on Delivery',
};

export const VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 8,
    // Validates 10-digit Nepali phone numbers starting with 9
    PHONE_REGEX: /^[9][0-9]{9}$/, 
    NAME_MIN_LENGTH: 2,
};
