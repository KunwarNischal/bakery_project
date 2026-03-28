/**
 * Application environment configuration
 * Centralizes all environment variables with sensible defaults
 */

const envOptions = {
    development: 'development',
    production: 'production',
    test: 'test'
};

const currentEnv = import.meta.env.MODE || envOptions.development;

export const environment = {
    // Current Environment
    env: currentEnv,
    isDev: currentEnv === envOptions.development,
    isProd: currentEnv === envOptions.production,

    // API Configuration
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    
    // Feature Flags (Easy to toggle features on/off)
    features: {
        enableReviewSystem: import.meta.env.VITE_ENABLE_REVIEWS === 'true',
        enableGuestCheckout: import.meta.env.VITE_ENABLE_GUEST_CHECKOUT !== 'false', // Default true
    },

    // Business Logic Thresholds
    delivery: {
        freeDeliveryThreshold: Number(import.meta.env.VITE_FREE_DELIVERY_THRESHOLD) || 5000,
        standardFee: Number(import.meta.env.VITE_STANDARD_DELIVERY_FEE) || 300,
    },

    // UI Dependencies
    pagination: {
        defaultLimit: Number(import.meta.env.VITE_PAGINATION_LIMIT) || 12,
        adminLimit: Number(import.meta.env.VITE_ADMIN_PAGINATION_LIMIT) || 20,
    }
};

export default environment;
