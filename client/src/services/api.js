import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        let token = null;

        const url = config.url || '';
        const isAdminRoute = url.includes('/admin') || url.includes('/products') || url.includes('/categories') || (url.includes('/orders') && !url.includes('/myorders'));

        if (isAdminRoute) {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const adminData = JSON.parse(userInfo);
                    if (adminData.token && adminData.isAdmin) {
                        token = adminData.token;
                    }
                } catch (e) {
                }
            }
        } else {
            const customerInfo = localStorage.getItem('customerInfo');
            if (customerInfo) {
                try {
                    const customerData = JSON.parse(customerInfo);
                    if (customerData.token && !customerData.isAdmin) {
                        token = customerData.token;
                    }
                } catch (e) {
                }
            }
        }

        if (!token) {
            if (isAdminRoute) {
                const customerInfo = localStorage.getItem('customerInfo');
                if (customerInfo) {
                    try { token = JSON.parse(customerInfo).token; } catch (e) {}
                }
            } else {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    try { token = JSON.parse(userInfo).token; } catch (e) {}
                }
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3ede8'/%3E%3Cg transform='translate(100%2C100)'%3E%3Crect x='-30' y='-22' width='60' height='44' rx='5' fill='none' stroke='%23c8a882' stroke-width='4'/%3E%3Ccircle cx='0' cy='-2' r='12' fill='none' stroke='%23c8a882' stroke-width='4'/%3E%3Ccircle cx='18' cy='-16' r='4' fill='%23c8a882'/%3E%3C/g%3E%3Ctext x='100' y='145' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%23a0845c'%3ENo Image%3C/text%3E%3C/svg%3E`;

export const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;

    const baseUrl = 'http://localhost:5000';

    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    if (cleanPath.startsWith('/uploads/')) return `${baseUrl}${cleanPath}`;
    if (cleanPath.startsWith('/assets/')) return `${baseUrl}${cleanPath}`;

    return `${baseUrl}/assets/bakery${cleanPath}`;
};

export const registerCustomer = async (name, email, password) => {
    try {
        const { data } = await api.post('/auth/register', { name, email, password });
        if (data) localStorage.setItem('customerInfo', JSON.stringify(data));
        return data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

export const loginCustomer = async (email, password) => {
    try {
        const { data } = await api.post('/auth/login', { email, password });
        if (data) localStorage.setItem('customerInfo', JSON.stringify(data));
        return data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};

export const verifyCustomer = async (token) => {
    try {
        const { data } = await api.post('/auth/verify', { token });
        if (data) localStorage.setItem('customerInfo', JSON.stringify(data));
        return data;
    } catch (error) {
        localStorage.removeItem('customerInfo');
        return null;
    }
};

export const logoutCustomer = () => {
    localStorage.removeItem('customerInfo');
};

export const getCustomerInfo = () => {
    const info = localStorage.getItem('customerInfo');
    return info ? JSON.parse(info) : null;
};

export const getProducts = async () => {
    try {
        const { data } = await api.get('/products');
        return data.map(p => ({
            ...p,
            id: p._id || p.id,
            image: !p.image?.startsWith('http')
                ? `http://localhost:5000${p.image?.startsWith('/') ? p.image : `/${p.image}`}`
                : p.image,
        }));
    } catch (error) {
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const { data } = await api.get(`/products/${id}`);
        return {
            ...data,
            id: data._id || data.id,
            image: !data.image?.startsWith('http')
                ? `http://localhost:5000${data.image?.startsWith('/') ? data.image : `/${data.image}`}`
                : data.image,
        };
    } catch (error) {
        return null;
    }
};

export const getCategories = async () => {
    try {
        const { data } = await api.get('/categories');
        return data;
    } catch (error) {
        return [];
    }
};

export const updateOrderStatus = async (orderId, status) => {
    const { data } = await api.put(`/orders/${orderId}/status`, { status });
    return data;
};

export default api;

