import api from '../../../shared/services/api';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Cart Service
 * Handles server-side cart synchronization if you decide to store 
 * cart data in the DB instead of just localStorage.
 */
export const syncCartWithServer = async (cartItems) => {
    try {
        const { data } = await api.post('/cart/sync', { items: cartItems });
        return data;
    } catch (error) {
        throw error;
    }
};

export const checkoutCart = async (checkoutData) => {
    const { data } = await api.post(API_ENDPOINTS.ORDERS.BASE, checkoutData);
    return data;
};
