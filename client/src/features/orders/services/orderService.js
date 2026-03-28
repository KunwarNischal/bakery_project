import api from '../../../shared/services/api';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Orders Service
 * Handles processing new orders, fetching user orders, and admin order management.
 */

export const createOrder = async (orderData) => {
    const { data } = await api.post(API_ENDPOINTS.ORDERS.BASE, orderData);
    return data;
};

export const getMyOrders = async () => {
    const { data } = await api.get(API_ENDPOINTS.ORDERS.MY_ORDERS);
    return data;
};

export const getAllOrders = async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.ORDERS.BASE, { params });
    return data;
};

export const getOrderById = async (id) => {
    const { data } = await api.get(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
    return data;
};

export const updateOrderStatus = async (id, status) => {
    const { data } = await api.put(API_ENDPOINTS.ORDERS.STATUS(id), { status });
    return data;
};

export const deleteOrder = async (id) => {
    const { data } = await api.delete(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
    return data;
};
