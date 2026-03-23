/**
 * useFetch Hook - Custom hook for fetching data from API
 *
 * This hook simplifies API data fetching with automatic loading and error state management.
 *
 * Features:
 * - Automatically fetches data from API when component mounts
 * - Manages loading, error, and data states
 * - Refetch function to manually refresh data
 * - setData function to manually update state
 *
 * Usage:
 * const { data, loading, error, refetch } = useFetch('/products');
 *
 * @param {string} url - The API endpoint to fetch from (e.g., '/products', '/orders')
 * @returns {Object} Object with data, loading, error, refetch function, and setData function
 */

import { useState, useEffect } from 'react';
import api from '../services/api';

export const useFetch = (url) => {
  // Store fetched data from API
  const [data, setData] = useState(null);
  // Track loading state while API request is in progress
  const [loading, setLoading] = useState(true);
  // Store error message if API request fails
  const [error, setError] = useState(null);

  /**
   * Fetch data from the API
   * Handles loading state and error catching
   */
  const fetchData = async () => {
    try {
      // Set loading to true before request
      setLoading(true);
      // Make API request using configured axios instance
      const response = await api.get(url);
      // Store returned data in state
      setData(response.data);
      // Clear any previous errors
      setError(null);
    } catch (err) {
      // Store error message for display
      setError(err.message || 'Failed to fetch data');
    } finally {
      // Always set loading to false when request completes
      setLoading(false);
    }
  };

  /**
   * Fetch data whenever the URL changes
   * This ensures fresh data when navigating to different pages
   */
  useEffect(() => {
    fetchData();
  }, [url]);

  // Return data, loading status, error, ability to refetch, and ability to manually set data
  return { data, setData, loading, error, refetch: fetchData };
};




