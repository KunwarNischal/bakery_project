import axios from 'axios';
import { environment } from '@/config/environment';
import { STORAGE_KEYS } from '@/config/constants';

/**
 * Base Axios Instance
 * Configures base URL and default headers.
 * Implements token attachment and automatic refresh token logic.
 */
const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Enable cookie auto-send for refresh token
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    // Determine which token to use based on the ENDPOINT being called, not a global setting
    // This ensures each tab uses the correct token regardless of what other tabs are doing
    const url = config.url || '';
    const method = (config.method || 'GET').toUpperCase();  // Normalize to uppercase
    let token = null;

    // Admin endpoints:
    // - /admin/* (all admin routes)
    // - GET /products, PUT /products, DELETE /products (product management)
    // - /categories/* (category management)
    // - GET /orders (get all orders - admin view), PUT /orders/:id/status, DELETE /orders/:id
    
    // Customer endpoints:
    // - POST /orders (place new order) - explicitly a customer endpoint
    // - /orders/my-orders (customer's own orders)
    
    // Determine if this is an admin route
    let isAdminRoute = false;
    
    if (url.includes('/admin')) {
      isAdminRoute = true;
    } else if (url.includes('/categories')) {
      isAdminRoute = true;
    } else if (url.includes('/my-orders')) {
      isAdminRoute = false;
    } else if (url.includes('/products')) {
      // GET /products (list) = customer, but PUT/DELETE = admin
      // POST /products = admin, GET /products/:id = customer
      isAdminRoute = method !== 'GET' || url.match(/\/products\/\d+$/) === null;
    } else if (url.includes('/orders')) {
      // POST /orders (create order) = customer
      // GET /orders (list all) = admin
      // PUT /orders/:id/status, DELETE /orders/:id = admin
      isAdminRoute = method !== 'POST';
    }

    if (isAdminRoute) {
      // Admin endpoint - use admin token
      token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    } else {
      // Customer endpoint - use customer token
      token = localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s and Refresh Access Tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and request hasn't been retried yet
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Ignore refresh token request itself failing to prevent loops
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh endpoint with credentials to send refresh token cookie
      // No need to pass refreshToken in body - it's sent automatically in cookie
      const response = await axios.post(
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data;
      
      if (!accessToken) {
        throw new Error('No access token in refresh response');
      }
      
      // Update the token based on the endpoint being called (not global ACTIVE_ROLE)
      // Determine which token to update based on the original request URL and method
      const url = originalRequest.url || '';
      const method = originalRequest.method || 'GET';
      
      // Use same logic as request interceptor to determine if admin or customer
      let isAdminRoute = false;
      
      if (url.includes('/admin')) {
        isAdminRoute = true;
      } else if (url.includes('/categories')) {
        isAdminRoute = true;
      } else if (url.includes('/my-orders')) {
        isAdminRoute = false;
      } else if (url.includes('/products')) {
        isAdminRoute = method !== 'GET' || url.match(/\/products\/\d+$/) === null;
      } else if (url.includes('/orders')) {
        isAdminRoute = method !== 'POST';
      }
      
      if (isAdminRoute) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, accessToken);
      } else {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_TOKEN, accessToken);
      }
      
      // Update queue
      processQueue(null, accessToken);

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // Logout completely if refresh fails - clear all auth data
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_INFO);
      
      // Dispatch an event so AuthContext/ProtectedRoute can redirect to login
      window.dispatchEvent(new Event('authchange'));
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
