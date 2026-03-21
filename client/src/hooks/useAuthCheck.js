/**
 * Hook: useAuthCheck
 * Protected route authentication check
 * 
 * @description Verifies user authentication and handles redirects
 * @param {string} type - 'admin' or 'customer'
 * @param {Object} options - Configuration
 * @param {Function} options.verify - Custom verification function
 * @param {string} options.redirectTo - Path to redirect if not authenticated
 * @param {Function} options.onVerified - Success callback
 * 
 * @returns {Object} { isAuthenticated, authInfo }
 * 
 * @example
 * const { isAuthenticated } = useAuthCheck('customer', {
 *   redirectTo: '/login',
 *   onVerified: (info) => console.log('Verified:', info)
 * });
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = (
  type = 'customer',
  options = {}
) => {
  const navigate = useNavigate();
  const { verify, redirectTo = '/login', onVerified } = options;

  useEffect(() => {
    const checkAuth = async () => {
      const storageName = type === 'admin' ? 'userInfo' : 'customerInfo';
      const authInfo = JSON.parse(localStorage.getItem(storageName) || 'null');

      if (!authInfo) {
        navigate(redirectTo);
        return;
      }

      if (verify && authInfo.token) {
        try {
          const verified = await verify(authInfo);
          if (verified) {
            onVerified?.(authInfo);
          } else {
            navigate(redirectTo);
          }
        } catch (err) {
          navigate(redirectTo);
        }
      } else {
        onVerified?.(authInfo);
      }
    };

    checkAuth();
  }, [type, verify, redirectTo, navigate, onVerified]);

  const authInfo = JSON.parse(
    localStorage.getItem(type === 'admin' ? 'userInfo' : 'customerInfo') || 'null'
  );

  return {
    isAuthenticated: !!authInfo,
    authInfo
  };
};
