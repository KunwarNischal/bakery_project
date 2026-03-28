import api from '../../../shared/services/api';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Products Service
 * Handles fetching, creating, updating, and deleting products.
 */

export const getProducts = async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return data;
};

export const getProductById = async (id) => {
    const { data } = await api.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return data;
};

export const createProduct = async (productData) => {
    // Handling form data mapping if image uploads exist
    const { data } = await api.post(API_ENDPOINTS.PRODUCTS.BASE, productData, {
        headers: productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return data;
};

export const updateProduct = async (id, productData) => {
    const { data } = await api.put(API_ENDPOINTS.PRODUCTS.DETAIL(id), productData, {
        headers: productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return data;
};

export const deleteProduct = async (id) => {
    const { data } = await api.delete(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return data;
};
