import api from '../../../shared/services/api';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Admin Service (Categories, Dashboard Stats, etc.)
 */

export const getCategories = async () => {
    const { data } = await api.get(API_ENDPOINTS.CATEGORIES.BASE);
    return data;
};

export const createCategory = async (categoryData) => {
    const { data } = await api.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
    return data;
};

export const updateCategory = async (id, categoryData) => {
    const { data } = await api.put(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`, categoryData);
    return data;
};

export const deleteCategory = async (id) => {
    const { data } = await api.delete(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`);
    return data;
};

export const getDashboardStats = async () => {
    const { data } = await api.get('/admin/stats');
    return data;
};
