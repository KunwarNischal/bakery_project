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
    // Use sessionStorage.ACTIVE_ROLE (per-tab) to determine which token to use
    // sessionStorage is per-tab: admin tab uses admin token, customer tab uses customer token
    const activeRole = sessionStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
    let token = null;

    if (activeRole === 'admin') {
      // Active role is admin - use admin token
      token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    } else if (activeRole === 'customer') {
      // Active role is customer - use customer token
      token = localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);
    } else {
      // ACTIVE_ROLE not set yet (timing issue) - auto-detect from tokens
      // Defensive fallback: prefer customer token if available, then admin
      const customerToken = localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);
      const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      
      if (customerToken) {
        token = customerToken;
        sessionStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'customer');
      } else if (adminToken) {
        token = adminToken;
        sessionStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'admin');
      }
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
      
      // Update the token based on the current active role in this tab
      // ACTIVE_ROLE tracks which role is active in THIS browser tab (sessionStorage)
      const activeRole = sessionStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      
      if (activeRole === 'admin') {
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
      sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
      
      // Dispatch an event so AuthContext/ProtectedRoute can redirect to login
      window.dispatchEvent(new Event('authchange'));
      
      // Show a user-friendly error message
      const errorMessage = refreshError.response?.status === 401 
        ? 'Your session has expired. Please login again.'
        : 'Unable to refresh session. Please login again.';
      
      // Dispatch auth error event with message
      window.dispatchEvent(new CustomEvent('autherror', { detail: { message: errorMessage } }));
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
