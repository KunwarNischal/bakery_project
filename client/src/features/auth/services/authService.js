import api from '../../../shared/services/api';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Authentication Service
 * Handles user and admin login, registration, and verification.
 */

export const registerCustomer = async (userData) => {
    const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER_CUSTOMER, userData);
    return data;
};

export const loginCustomer = async (email, password) => {
    const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN_CUSTOMER, { email, password });
    return data;
};

export const loginAdmin = async (email, password) => {
    const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN_ADMIN, { email, password });
    return data;
};

export const verifyToken = async () => {
    const { data } = await api.get(API_ENDPOINTS.AUTH.VERIFY);
    return data;
};

// In an actual production setup, logging out might hit an API endpoint to invalidate the refresh token
export const logoutUser = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        // Logout API may fail but we still continue with client logout
    }
};
