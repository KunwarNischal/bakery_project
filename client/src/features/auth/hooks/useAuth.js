import { useContext } from 'react';
import { AuthContext } from '@/features/auth/context/AuthContext';

/**
 * Custom hook to consume the AuthContext safely
 * 
 * @returns {Object} {
 *   customer,
 *   admin,
 *   isAuthenticated,
 *   isAdminAuthenticated,
 *   login,
 *   logout,
 *   verify
 * }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined || context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default useAuth;
