import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { STORAGE_KEYS } from '@/config/constants';

// Create Context
export const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Manages both customer and admin authentication states centrally.
 */
export const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize state from local storage on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                // Check stored customer data
                const storedUserInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
                if (storedUserInfo) {
                    setCustomer(JSON.parse(storedUserInfo));
                }

                // Check stored admin data
                const storedAdminInfo = localStorage.getItem(STORAGE_KEYS.ADMIN_INFO);
                if (storedAdminInfo) {
                    setAdmin(JSON.parse(storedAdminInfo));
                }
            } catch (error) {
                console.error("Failed to parse stored auth data:", error);
                // Clear potentially corrupted data
                localStorage.removeItem(STORAGE_KEYS.USER_INFO);
                localStorage.removeItem(STORAGE_KEYS.ADMIN_INFO);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
        
        // Listen for cross-tab auth changes
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEYS.USER_INFO) {
                setCustomer(e.newValue ? JSON.parse(e.newValue) : null);
            } else if (e.key === STORAGE_KEYS.ADMIN_INFO) {
                setAdmin(e.newValue ? JSON.parse(e.newValue) : null);
            } else if (e.key === STORAGE_KEYS.AUTH_TOKEN && !e.newValue) {
                // If token is cleared from another tab, logout locally
                setCustomer(null);
                setAdmin(null);
            }
        };

        // Custom event listener for same-tab sync
        const handleLocalAuthChange = () => {
             initializeAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authchange', handleLocalAuthChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authchange', handleLocalAuthChange);
        };
    }, []);

    /**
     * Handle login for either user or admin
     * @param {Object} userData - The user data from the backend
     * @param {string} token - JWT token
     * @param {string} role - 'customer' or 'admin'
     */
    const login = useCallback((userData, token, role = 'customer') => {
        // Save the token regardless of role
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

        if (role === 'admin') {
            setAdmin(userData);
            localStorage.setItem(STORAGE_KEYS.ADMIN_INFO, JSON.stringify(userData));
        } else {
            setCustomer(userData);
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
        }

        // Dispatch custom event to sync other components potentially not wrapped in context
        window.dispatchEvent(new Event('authchange'));
    }, []);

    /**
     * Handle logout
     * @param {string} role - 'customer', 'admin', or 'all'
     */
    const logout = useCallback((role = 'all') => {
        if (role === 'all' || role === 'customer') {
            setCustomer(null);
            localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        }
        
        if (role === 'all' || role === 'admin') {
            setAdmin(null);
            localStorage.removeItem(STORAGE_KEYS.ADMIN_INFO);
        }

        // If logging out of all, or logging out of the only active session, remove token
        if (role === 'all' || (!admin && role === 'customer') || (!customer && role === 'admin')) {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN); // If implementing refresh tokens
        }

        window.dispatchEvent(new Event('authchange'));
    }, [customer, admin]);

    /**
     * Optional: Async verify function to check token validity on the server
     * Can be invoked by protected routes on mount to ensure session is still valid globally
     */
    const verify = useCallback(async (verifyApiCall) => {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            if (!token) throw new Error("No token found");
            
            // Assume verifyApiCall makes the HTTP request with the token and throws if invalid
            const response = await verifyApiCall();
            return response.data;
        } catch (error) {
            // If verification fails, forcefully log everything out
            logout('all');
            throw error;
        }
    }, [logout]);

    const contextValue = {
        customer,
        admin,
        isAuthenticated: !!customer,
        isAdminAuthenticated: !!admin,
        login,
        logout,
        verify,
    };

    if (loading) {
        // Return null or a subtle loading indicator during the initial localStorage read
        return null;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
