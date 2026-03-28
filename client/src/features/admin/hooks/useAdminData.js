import { useFetch } from '../../../shared/hooks/useFetch';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Custom hook to manage admin dashboard statistics and list queries
 */
export const useAdminData = () => {
    const { data: stats, loading: statsLoading, error: statsError } = useFetch('/admin/stats');
    const { data: orders, loading: ordersLoading, refetch: refetchOrders } = useFetch(API_ENDPOINTS.ORDERS.BASE);
    const { data: categories, loading: catLoading } = useFetch(API_ENDPOINTS.CATEGORIES.BASE);

    return {
        stats,
        orders: orders || [],
        categories: categories || [],
        loading: statsLoading || ordersLoading || catLoading,
        error: statsError,
        refetchOrders
    };
};
