/**
 * Hook: useApiCall
 * API call wrapper with loading, error, and toast notifications
 * 
 * @description Wraps async API calls with loading/error states and optional notifications
 * @param {Function} apiFunc - API function to call
 * @param {Object} options - Configuration
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {boolean} options.showToast - Show toast notifications
 * @param {string} options.successMessage - Success message
 * @param {string} options.errorMessage - Error message
 * 
 * @returns {Object} { execute, loading, error, reset }
 * 
 * @example
 * const { execute, loading } = useApiCall(deleteProduct, {
 *   onSuccess: () => refetchProducts(),
 *   showToast: true,
 *   successMessage: 'Product deleted!'
 * });
 * 
 * const handleDelete = () => execute(productId);
 */

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useApiCall = (
  apiFunc,
  options = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    onSuccess,
    onError,
    showToast = false,
    successMessage = 'Success!',
    errorMessage = 'An error occurred'
  } = options;

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunc(...args);
        if (showToast) {
          toast.success(successMessage);
        }
        onSuccess?.(result);
        return result;
      } catch (err) {
        const msg = err.response?.data?.message || errorMessage;
        setError(msg);
        if (showToast) {
          toast.error(msg);
        }
        onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, onSuccess, onError, showToast, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { execute, loading, error, reset };
};
