import { useFetch } from '../../../shared/hooks/useFetch';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Custom hook to abstract category-related data fetching
 */
export const useCategories = () => {
    // Fetch categories from the standard API endpoint
    const { data: categories, loading, error, refetch } = useFetch(API_ENDPOINTS.CATEGORIES.BASE);

    return {
        categories: categories || [],
        loading,
        error,
        refetch
    };
};
