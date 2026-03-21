/**
 * Hook: useFetchData
 * Encapsulates data fetching with loading/error states
 * 
 * @description Handles async data fetching with automatic loading and error states
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} deps - Dependency array for useEffect
 * @param {Function} onError - Optional callback when fetch fails
 * @param {Object} options - Configuration options
 * 
 * @returns {Object} { data, loading, error, refetch }
 * 
 * @example
 * const { data: products, loading, error } = useFetchData(
 *   () => productService.getAll(),
 *   [],
 *   (error) => console.error(error),
 *   { initialData: [] }
 * );
 */

import { useState, useEffect, useCallback } from 'react';

export const useFetchData = (
  fetchFn,
  deps = [],
  onError = null,
  options = {}
) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const errorMsg = err.message || options.errorMessage || 'Failed to fetch data';
      setError(errorMsg);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onError, options.errorMessage]);

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
};
