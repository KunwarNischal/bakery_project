import { useFetch } from '../../../shared/hooks/useFetch';
import { getProducts, getProductById } from '@/features/products/services/productService';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Custom hook to abstract product-related data fetching
 */
export const useProducts = (params = {}) => {
    // Leveraging our new robust useFetch with caching
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.PRODUCTS.BASE}?${queryParams}`;
    
    const { data: products, loading, error, refetch } = useFetch(url);

    return {
        products: products || [],
        loading,
        error,
        refetch
    };
};

export const useProductDetail = (productId) => {
    const url = productId ? API_ENDPOINTS.PRODUCTS.DETAIL(productId) : null;
    const { data: product, loading, error, refetch } = useFetch(url);

    return {
        product,
        loading,
        error,
        refetch
    };
};
