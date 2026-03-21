import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Log API configuration for debugging
console.log('🔌 API Configuration:', {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    environment: import.meta.env.MODE,
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
    (config) => {
        let token = null;
        
        // Determine which token to use based on the request URL
        const url = config.url || '';
        const isAdminRoute = url.includes('/admin') || url.includes('/products') || url.includes('/categories') || (url.includes('/orders') && !url.includes('/myorders'));
        
        if (isAdminRoute) {
            // Admin routes: prioritize admin token
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const adminData = JSON.parse(userInfo);
                    if (adminData.token && adminData.isAdmin) {
                        token = adminData.token;
                    }
                } catch (e) {
                    console.error('Failed to parse userInfo:', e);
                }
            }
        } else {
            // Customer routes: prioritize customer token
            const customerInfo = localStorage.getItem('customerInfo');
            if (customerInfo) {
                try {
                    const customerData = JSON.parse(customerInfo);
                    if (customerData.token && !customerData.isAdmin) {
                        token = customerData.token;
                    }
                } catch (e) {
                    console.error('Failed to parse customerInfo:', e);
                }
            }
        }
        
        // Fallback: if preferred token not found, try the other type
        if (!token) {
            if (isAdminRoute) {
                // Try customer token as fallback
                const customerInfo = localStorage.getItem('customerInfo');
                if (customerInfo) {
                    try {
                        const customerData = JSON.parse(customerInfo);
                        if (customerData.token) {
                            token = customerData.token;
                        }
                    } catch (e) {}
                }
            } else {
                // Try admin token as fallback
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    try {
                        const adminData = JSON.parse(userInfo);
                        if (adminData.token) {
                            token = adminData.token;
                        }
                    } catch (e) {}
                }
            }
        }

        // Add token to request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error.message);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ API Response Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
        });
        return Promise.reject(error);
    }
);

// Helper function to get the image URL
export const getImageUrl = (imagePath) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const backendURL = baseURL.replace('/api', ''); // Remove /api to get base URL
    
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a bakery image path with /assets/bakery/
    if (imagePath.includes('/assets/bakery/')) {
        return `${backendURL}${imagePath}`;
    }
    // If it's just a filename, assume it's in the bakery folder
    if (!imagePath.includes('/')) {
        return `${backendURL}/assets/bakery/${imagePath}`;
    }
    // If it starts with /assets/, serve from backend
    if (imagePath.startsWith('/assets/')) {
        return `${backendURL}${imagePath}`;
    }
    // If it starts with /uploads/, serve from backend uploads
    if (imagePath.startsWith('/uploads/')) {
        return `${backendURL}${imagePath}`;
    }
    // Default: assume it's a bakery asset
    return `${backendURL}/assets/bakery/${imagePath}`;
};

export default api;
