import axios from 'axios';
import { environment } from '@/config/environment';
import { STORAGE_KEYS } from '@/config/constants';

/**
 * Base Axios Instance
 * Configures base URL and default headers.
 * Implements token attachment and refresh token logic (Phase 7).
 */
const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    // Simplify to single auth token (AuthContext manages admin/customer routing logic)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s and Refresh Tokens
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
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Use raw axios to bypass interceptors during refresh
      const response = await axios.post(`${environment.apiUrl}/auth/refresh`, {
        refreshToken
      });

      const { token } = response.data;
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      
      // Update queue
      processQueue(null, token);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // Logout completely if refresh fails
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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
