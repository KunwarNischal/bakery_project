import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { STORAGE_KEYS } from '@/config/constants';
import { AuthContext } from './authContextValue';

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
                // Initialize active role for this specific tab if not set
                if (!sessionStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE)) {
                    const isAdminRoute = window.location.pathname.startsWith('/admin');
                    const hasAdminToken = !!localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
                    const hasCustomerToken = !!localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);

                    if (isAdminRoute && hasAdminToken) {
                        sessionStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'admin');
                    } else if (hasCustomerToken) {
                        sessionStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'customer');
                    } else if (hasAdminToken) {
                        sessionStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'admin');
                    }
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
            } else if (e.key === STORAGE_KEYS.CUSTOMER_TOKEN && !e.newValue) {
                // If customer token is cleared, logout customer
                setCustomer(null);
            } else if (e.key === STORAGE_KEYS.ADMIN_TOKEN && !e.newValue) {
                // If admin token is cleared, logout admin
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
     * @param {string} token - JWT token (accessToken for new system, token for backward compatibility)
     * @param {string} role - 'customer' or 'admin'
     */
    const login = useCallback((userData, token, role = 'customer') => {
        // Use accessToken if available (new system), otherwise use token (backward compatibility)
        const accessToken = userData.accessToken || token || userData.token;
        
        if (!accessToken) {
            console.error('No access token provided to login function');
            return;
        }

        // Save the token with role-specific key
        if (role === 'admin') {
            localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, accessToken);
            setAdmin(userData);
            localStorage.setItem(STORAGE_KEYS.ADMIN_INFO, JSON.stringify(userData));
            sessionStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'admin');  // Track that admin is active for this tab
        } else {
            localStorage.setItem(STORAGE_KEYS.CUSTOMER_TOKEN, accessToken);
            setCustomer(userData);
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
            sessionStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'customer');  // Track that customer is active for this tab
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
            localStorage.removeItem(STORAGE_KEYS.CUSTOMER_TOKEN);
        }
        
        if (role === 'all' || role === 'admin') {
            setAdmin(null);
            localStorage.removeItem(STORAGE_KEYS.ADMIN_INFO);
            localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        }

        // If logging out all roles, clear active role
        if (role === 'all') {
            sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
        }

        window.dispatchEvent(new Event('authchange'));
    }, []);

    /**
     * Optional: Async verify function to check token validity on the server
     * Can be invoked by protected routes on mount to ensure session is still valid globally
     */
    const verify = useCallback(async (verifyApiCall) => {
        try {
            // Check for either customer or admin token
            const customerToken = localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);
            const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
            const token = adminToken || customerToken;
            
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
