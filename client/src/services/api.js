import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null;

        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to get the image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    // If it's a bakery image path with /assets/bakery/
    if (imagePath.includes('/assets/bakery/')) {
        return `http://localhost:5000${imagePath}`;
    }
    // If it's just a filename, assume it's in the bakery folder
    if (!imagePath.includes('/')) {
        return `http://localhost:5000/assets/bakery/${imagePath}`;
    }
    // If it starts with /assets/, serve from backend
    if (imagePath.startsWith('/assets/')) {
        return `http://localhost:5000${imagePath}`;
    }
    // If it starts with /uploads/, serve from backend uploads
    if (imagePath.startsWith('/uploads/')) {
        return `http://localhost:5000${imagePath}`;
    }
    // Default: assume it's a bakery asset
    return `http://localhost:5000/assets/bakery/${imagePath}`;
};

export default api;
