import api from './api';

// Login user
export const loginCustomer = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('customerInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};

// Register customer
export const registerCustomer = async (name, email, password) => {
    try {
        const response = await api.post('/auth/register', { name, email, password });
        if (response.data) {
            localStorage.setItem('customerInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

// Verify customer token (check if user still exists in database)
export const verifyCustomer = async (token) => {
    try {
        const response = await api.post('/auth/verify', { token });
        if (response.data) {
            localStorage.setItem('customerInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        // Clear localStorage if user not found or token invalid
        logoutCustomer();
        return null;
    }
};

// Logout customer
export const logoutCustomer = () => {
    localStorage.removeItem('customerInfo');
};

// Get current customer info
export const getCustomerInfo = () => {
    const info = localStorage.getItem('customerInfo');
    return info ? JSON.parse(info) : null;
};
