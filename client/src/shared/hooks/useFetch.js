import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/shared/services/api';

// Global cache to persist data across component unmounts
const queryCache = new Map();

/**
 * Advanced useFetch Hook with Caching and AbortController
 * 
 * Features:
 * - In-memory Map caching based on URL
 * - Request cancellation (AbortController) to prevent memory leaks
 * - Stale-while-revalidate support
 * - Force refresh capabilities
 * 
 * @param {string} url - API endpoint
 * @param {Object} options - { skipCache: boolean, swr: boolean }
 */
export const useFetch = (url, options = {}) => {
  const { skipCache = false, swr = false } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track if component is mounted to prevent state updates on unmounted components
  const isMounted = useRef(true);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // If we have cached data and aren't forcing a refresh, use it
    const shouldReadCache = !skipCache && !forceRefresh;
    if (shouldReadCache && queryCache.has(url)) {
      setData(queryCache.get(url));
      
      // If SWR is enabled, we still show cached data but fetch new data silently
      if (!swr) {
        setLoading(false);
        return;
      }
    } else {
      setLoading(true);
    }

    const abortController = new AbortController();

    try {
      const response = await api.get(url, {
        signal: abortController.signal
      });
      
      if (isMounted.current) {
        setData(response.data);
        setError(null);
        // Save to cache
        if (!skipCache) {
          queryCache.set(url, response.data);
        }
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return;
      }
      if (isMounted.current) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }

    return () => {
      abortController.abort();
    };
  }, [url, skipCache, swr]);

  useEffect(() => {
    isMounted.current = true;
    
    if (url) {
      const cleanup = fetchData();
      return () => {
        isMounted.current = false;
        if (cleanup && typeof cleanup.then === 'function') {
           cleanup.then(abort => typeof abort === 'function' && abort());
        }
      };
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [url, fetchData]);

  const refetch = useCallback(() => {
    // Clear cache for this specific URL before refetching
    if (url) {
      queryCache.delete(url);
    }
    return fetchData(true);
  }, [url, fetchData]);

  return { data, setData, loading, error, refetch };
};

export default useFetch;
