/**
 * =============================================================================
 * API SERVICE MODULE - Hatemalo Bakery
 * =============================================================================
 *
 * This file handles all communication with the backend API.
 * It includes:
 * - Axios configuration (HTTP client setup)
 * - Authentication token management
 * - Image URL handling
 * - API endpoint functions for products, categories, orders, and auth
 *
 * Think of this as the "bridge" between the frontend (React) and backend (Node.js)
 * =============================================================================
 */

import axios from 'axios';

/**
 * ============================================================================
 * 0. CONFIGURATION CONSTANTS
 * ============================================================================
 *
 * Centralized configuration to avoid hardcoding values throughout the file
 * Makes it easy to change URLs, keys, and routes in one place
 */
const API_BASE_URL = 'http://localhost:5000';
const API_ENDPOINT = '/api';
const AUTH_SCHEME = 'Bearer';

// Storage keys for localStorage operations (avoid typos, DRY principle)
const STORAGE_KEYS = {
  ADMIN_INFO: 'userInfo',
  CUSTOMER_INFO: 'customerInfo',
};

// Admin routes that require authentication
const ADMIN_ROUTES = ['/admin', '/products', '/categories', '/orders'];

// API endpoint constants - avoid magic strings scattered through the code
const API_ENDPOINTS = {
  // Authentication
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  VERIFY: '/auth/verify',
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  // Categories
  CATEGORIES: '/categories',
  // Orders
  ORDER_STATUS: (id) => `/orders/${id}/status`,
};

// Image path constants - avoid magic strings for path prefixes
const IMAGE_PREFIXES = {
  UPLOADS: '/uploads/',
  ASSETS: '/assets/',
  BAKERY_ASSETS: '/assets/bakery',
};

/**
 * ============================================================================
 * 1. HELPER FUNCTIONS (Defined before axios instance)
 * ============================================================================
 *
 * These functions must be defined before the axios instance is created
 * because they're used in the request interceptor
 */

/**
 * Helper function: Check if a route is for admin operations
 * Uses Set for O(1) lookup instead of array iteration (optimization for hot path)
 */
function isAdminAPIRoute(url) {
  // Special case: /orders/myorders is customer route, not admin
  if (url.includes('/orders/myorders')) {
    return false;
  }

  // Check if URL contains any admin route
  // This still uses array iteration because we need substring matching (.includes),
  // not exact key matching which would benefit from Set
  return ADMIN_ROUTES.some(route => url.includes(route));
}

/**
 * Consolidated helper: Extract and validate token from localStorage
 * Eliminates duplication between getAdminToken and getCustomerToken
 *
 * @param {string} storageKey - localStorage key to retrieve ('userInfo' or 'customerInfo')
 * @param {boolean} requireAdmin - Whether we expect an admin token (true) or customer (false)
 * @returns {string|null} - The authentication token if valid, null otherwise
 */
function getTokenFromStorage(storageKey, requireAdmin) {
  try {
    const dataJSON = localStorage.getItem(storageKey);
    if (!dataJSON) return null;

    const data = JSON.parse(dataJSON);
    // Return token only if it exists and role matches what we expect
    if (data.token && data.isAdmin === requireAdmin) {
      return data.token;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Generic helper: Extract data from localStorage with safe parsing
 * Handles try-catch and JSON parsing for any data type
 *
 * @param {string} storageKey - localStorage key to retrieve
 * @returns {Object|null} - Parsed data or null if not found/invalid
 */
function getFromStorage(storageKey) {
  try {
    const dataJSON = localStorage.getItem(storageKey);
    return dataJSON ? JSON.parse(dataJSON) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Helper: Save customer info to localStorage with error handling
 * Consolidates the repeated pattern of saving customer data
 *
 * @param {Object} data - Customer data to save
 */
function saveCustomerToStorage(data) {
  // Only save if data exists and has token
  if (data && data.token) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_INFO, JSON.stringify(data));
  }
}

/**
 * Helper: Extract error message from API error response
 * Consolidates error handling pattern used in 3+ places
 *
 * @param {Object} error - Axios error object
 * @param {string} defaultMessage - Default message if none in response
 * @returns {string} - Error message to display
 */
function getErrorMessage(error, defaultMessage) {
  return error.response?.data?.message || defaultMessage;
}

/**
 * Helper: Get authentication token for the current route type
 * Optimized to minimize localStorage calls on hot path
 *
 * @param {boolean} isAdminRoute - Whether this is an admin route
 * @returns {string|null} - Authentication token or null
 */
function getAuthTokenForRoute(isAdminRoute) {
  // Simplified logic: get the appropriate token based on route type
  // No fallback - use the correct token type for the route
  const storageKey = isAdminRoute ? STORAGE_KEYS.ADMIN_INFO : STORAGE_KEYS.CUSTOMER_INFO;
  const requireAdmin = isAdminRoute;
  return getTokenFromStorage(storageKey, requireAdmin);
}

/**
 * ============================================================================
 * 2. CREATE AXIOS INSTANCE
 * ============================================================================
 *
 * Axios is a library that makes HTTP requests (like fetching data from API)
 * This creates a configured instance with base settings that all requests will use
 */
const api = axios.create({
  // baseURL: This is the starting URL for all API calls
  // So api.get('/products') becomes http://localhost:5000/api/products
  baseURL: `${API_BASE_URL}${API_ENDPOINT}`,

  // headers: Default headers sent with every request
  headers: {
    'Content-Type': 'application/json', // Tell server we're sending JSON data
  },
});

/**
 * ============================================================================
 * 3. REQUEST INTERCEPTOR - Auto-attach authentication token
 * ============================================================================
 *
 * An interceptor runs BEFORE every API request
 * Its job: Check if user is logged in, and if so, send their auth token
 *
 * Why? Backend needs to know who is making the request
 * The token is like a "digital ID card" that proves the user is authenticated
 */
api.interceptors.request.use(
  // Success case: Request is ready to be sent
  (config) => {
    let authToken = null;

    // STEP 1: Determine what type of request this is
    const requestUrl = config.url || '';
    const isAdminRoute = isAdminAPIRoute(requestUrl);

    // STEP 2: Get the appropriate token based on route type
    authToken = getAuthTokenForRoute(isAdminRoute);

    // STEP 3: If we have a token, add it to the request headers
    // This tells the backend: "I'm authenticated, here's my proof (token)"
    if (authToken) {
      config.headers.Authorization = `${AUTH_SCHEME} ${authToken}`;
    }

    // Return the updated config so the request can proceed
    return config;
  },

  // Error case: Something went wrong before the request could be prepared
  (error) => Promise.reject(error)
);


/**
 * ============================================================================
 * 4. IMAGE URL HANDLING
 * ============================================================================
 *
 * Products have images stored on the server. This section handles converting
 * image paths into working URLs, and providing fallback images when needed.
 */

/**
 * PLACEHOLDER_IMAGE: A default image shown when a product has no image
 * This is an SVG (simple graphic) that says "No Image" - it's built into the string itself
 */
export const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3ede8'/%3E%3Cg transform='translate(100%2C100)'%3E%3Crect x='-30' y='-22' width='60' height='44' rx='5' fill='none' stroke='%23c8a882' stroke-width='4'/%3E%3Ccircle cx='0' cy='-2' r='12' fill='none' stroke='%23c8a882' stroke-width='4'/%3E%3Ccircle cx='18' cy='-16' r='4' fill='%23c8a882'/%3E%3C/g%3E%3Ctext x='100' y='145' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%23a0845c'%3ENo Image%3C/text%3E%3C/svg%3E`;

/**
 * getImageUrl: Convert image paths from database into working URLs
 *
 * Why? Database stores image paths like "image-123.jpg" but we need full URLs
 * like "http://localhost:5000/uploads/image-123.jpg" to display them
 *
 * @param {string} imagePath - Image path from database
 * @returns {string} - Complete working URL to the image or placeholder if no image
 */
export const getImageUrl = (imagePath) => {
  // If no image path provided, show the placeholder
  if (!imagePath) {
    return PLACEHOLDER_IMAGE;
  }

  // If already a full URL (starts with http) or embedded image (starts with data:),
  // return it as-is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  const baseUrl = API_BASE_URL;

  // Ensure path starts with / for proper URL format
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // Build the full URL based on where the image is stored on the server
  if (cleanPath.startsWith(IMAGE_PREFIXES.UPLOADS)) {
    return `${baseUrl}${cleanPath}`;
  }

  if (cleanPath.startsWith(IMAGE_PREFIXES.ASSETS)) {
    return `${baseUrl}${cleanPath}`;
  }

  // Default: assume it's in the bakery assets folder
  return `${baseUrl}${IMAGE_PREFIXES.BAKERY_ASSETS}${cleanPath}`;
};

/**
 * normalizeProduct: Transform product data into consistent format
 * Consolidates the product transformation logic used in multiple places
 *
 * @param {Object} product - Product data from API
 * @returns {Object} - Normalized product with corrected id and image fields
 */
function normalizeProduct(product) {
  return {
    ...product,
    id: product._id || product.id,
    image: getImageUrl(product.image),
  };
}

/**
 * ============================================================================
 * 5. AUTHENTICATION FUNCTIONS
 * ============================================================================
 *
 * These functions handle user login, registration, logout, and storing/retrieving
 * authentication data from localStorage.
 *
 * Authentication flow:
 * 1. User enters email and password
 * 2. Function sends to backend API
 * 3. Backend checks credentials and returns a unique "token"
 * 4. Token is stored in browser (localStorage)
 * 5. Token is sent with every future request to prove user is logged in
 * 6. When logged out, token is deleted
 */

/**
 * Consolidated authentication handler
 * Eliminates duplication between registerCustomer and loginCustomer
 *
 * @param {string} endpoint - API endpoint (/auth/register or /auth/login)
 * @param {Object} credentials - Login/register credentials
 * @param {string} errorContext - Context for error message (e.g., 'Registration', 'Login')
 * @returns {Promise<Object>} - Customer data with token
 */
async function authenticateAndStore(endpoint, credentials, errorContext) {
  try {
    const { data } = await api.post(endpoint, credentials);
    saveCustomerToStorage(data);
    return data;
  } catch (error) {
    throw getErrorMessage(error, `${errorContext} failed`);
  }
}

/**
 * registerCustomer: Create a new customer account
 *
 * What it does:
 * 1. Sends name, email, and password to backend
 * 2. Backend creates new user account
 * 3. Returns authentication token
 * 4. Saves customer info to browser storage
 * 5. Returns the customer data (name, email, token)
 *
 * @param {string} name - Customer's full name
 * @param {string} email - Customer's email address
 * @param {string} password - Customer's password
 * @returns {Promise} - Customer data including token if successful
 * @throws {Error} - Error message if registration fails
 *
 * Example usage:
 * await registerCustomer('John Doe', 'john@example.com', 'password123');
 */
export const registerCustomer = async (name, email, password) => {
  return authenticateAndStore(
    API_ENDPOINTS.REGISTER,
    { name, email, password },
    'Registration'
  );
};

/**
 * loginCustomer: Log in an existing customer account
 *
 * What it does:
 * 1. Sends email and password to backend
 * 2. Backend verifies credentials
 * 3. Returns authentication token if correct
 * 4. Saves customer info to browser storage
 * 5. Returns the customer data
 *
 * @param {string} email - Customer's email address
 * @param {string} password - Customer's password
 * @returns {Promise} - Customer data including token if successful
 * @throws {Error} - Error message if login fails (wrong password, user not found, etc.)
 *
 * Example usage:
 * const customerData = await loginCustomer('john@example.com', 'password123');
 */
export const loginCustomer = async (email, password) => {
  return authenticateAndStore(
    API_ENDPOINTS.LOGIN,
    { email, password },
    'Login'
  );
};

/**
 * verifyCustomer: Check if customer's existing token is still valid
 *
 * What it does:
 * 1. Sends the stored token to backend
 * 2. Backend checks if token hasn't expired and is valid
 * 3. If valid, updates customer info (maintains login)
 * 4. If invalid/expired, deletes stored info (acts like logout)
 *
 * Why? Tokens can expire. We check if stored token is still good.
 * If not, we log the user out automatically (better security).
 *
 * @param {string} token - Customer's authentication token
 * @returns {Promise} - Customer data if valid, null if invalid/expired
 *
 * Example usage:
 * const isValid = await verifyCustomer(storedToken);
 */
export const verifyCustomer = async (token) => {
  try {
    // Verify the token with backend
    const { data } = await api.post(API_ENDPOINTS.VERIFY, { token });

    // If valid, update customer info in storage
    saveCustomerToStorage(data);
    return data;
  } catch (error) {
    // If token is invalid or expired, remove it from storage
    // This effectively logs the user out
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_INFO);
    return null;
  }
};

/**
 * logoutCustomer: Log out the current customer (Side-effect function)
 *
 * What it does:
 * 1. Deletes customer info from browser storage
 * 2. Clears the authentication token
 * 3. User is no longer logged in
 *
 * Why simple? Logout only needs to clear local storage.
 * The backend doesn't need to do anything.
 *
 * Note: This function performs a side effect (removing data from localStorage)
 * but does not return a value. Components should handle UI updates separately.
 *
 * Example usage:
 * logoutCustomer(); // User is now logged out
 */
export const logoutCustomer = () => {
  // Remove all customer data from browser storage
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_INFO);

  // After this, future API requests won't include a token
  // So backend will treat subsequent requests as "not authenticated"
};

/**
 * getCustomerInfo: Retrieve currently logged-in customer's information
 *
 * What it does:
 * 1. Gets customer info from browser storage
 * 2. Parses it from JSON format
 * 3. Returns customer data or null if not logged in
 *
 * Why useful? Components can check if user is logged in and get their info
 *
 * @returns {Object|null} - Customer data (name, email, token, isAdmin) or null if not logged in
 *
 * Example usage:
 * const customerInfo = getCustomerInfo();
 * if (customerInfo) {
 *   console.log('User email:', customerInfo.email);
 * } else {
 *   console.log('No user logged in');
 * }
 */
export const getCustomerInfo = () => {
  return getFromStorage(STORAGE_KEYS.CUSTOMER_INFO);
};

/**
 * ============================================================================
 * 6. PRODUCT FUNCTIONS
 * ============================================================================
 *
 * These functions fetch product data from the backend API and process it
 * for use in React components.
 */

/**
 * getProducts: Fetch all products from the backend
 *
 * What it does:
 * 1. Requests all products from backend API
 * 2. Processes each product to ensure image URLs are correct
 * 3. Returns array of product data
 * 4. If error, returns empty array (fail gracefully)
 *
 * Why process images? Database stores image filenames like "prod-123.jpg"
 * but we need full URLs like "http://localhost:5000/uploads/prod-123.jpg"
 *
 * @returns {Promise<Array>} - Array of product objects
 *
 * Example usage:
 * const allProducts = await getProducts();
 * console.log(allProducts); // [{_id, name, price, image, ...}, ...]
 */
export const getProducts = async () => {
  try {
    // Request all products from backend
    const { data } = await api.get(API_ENDPOINTS.PRODUCTS);

    // Process each product using consolidated helper function
    return data.map(normalizeProduct);
  } catch (error) {
    // If request fails, log error and return empty array
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * getProductById: Fetch a single product by ID
 *
 * What it does:
 * 1. Requests specific product from backend using its ID
 * 2. Processes image URL (same as getProducts)
 * 3. Returns product data
 * 4. If error or not found, returns null
 *
 * @param {string} productId - The product's ID (MongoDB ObjectId)
 * @returns {Promise<Object|null>} - Product object or null if not found
 *
 * Example usage:
 * const product = await getProductById('507f1f77bcf86cd799439011');
 * if (product) {
 *   console.log('Product name:', product.name);
 * }
 */
export const getProductById = async (productId) => {
  try {
    // Request specific product from backend using its ID
    const { data } = await api.get(API_ENDPOINTS.PRODUCT_BY_ID(productId));

    // Return product normalized using consolidated helper function
    return normalizeProduct(data);
  } catch (error) {
    // If request fails or product not found, log error and return null
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
};

/**
 * ============================================================================
 * 7. CATEGORY FUNCTIONS
 * ============================================================================
 *
 * Categories organize products (Breads, Cakes, Cookies, etc.)
 */

/**
 * getCategories: Fetch all product categories
 *
 * What it does:
 * 1. Requests all categories from backend
 * 2. Returns array of category data
 * 3. If error, returns empty array (fail gracefully)
 *
 * @returns {Promise<Array>} - Array of category objects
 *
 * Example usage:
 * const categories = await getCategories();
 * console.log(categories); // [{_id, name, description, image}, ...]
 */
export const getCategories = async () => {
  try {
    // Request all categories from backend
    const { data } = await api.get(API_ENDPOINTS.CATEGORIES);

    // Return the categories array
    return data;
  } catch (error) {
    // If request fails, log error and return empty array
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * ============================================================================
 * 8. ORDER FUNCTIONS
 * ============================================================================
 *
 * Orders are placed by customers and managed by admins
 */

/**
 * updateOrderStatus: Update the status of an order (Admin only)
 *
 * What it does:
 * 1. Sends new status to backend for specific order
 * 2. Backend updates the order (requires admin authentication)
 * 3. Returns updated order data
 *
 * Valid statuses: Pending, Processing, Preparing, Shipped, Delivered, Cancelled
 *
 * @param {string} orderId - The order's ID (MongoDB ObjectId)
 * @param {string} status - New status for the order
 * @returns {Promise<Object>} - Updated order object from backend
 * @throws {Error} - If update fails (not admin, order not found, etc.)
 *
 * Example usage:
 * const updatedOrder = await updateOrderStatus('507f1f77bcf86cd799439011', 'Shipped');
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    // Send update request to backend
    const { data } = await api.put(API_ENDPOINTS.ORDER_STATUS(orderId), { status });

    // Return the updated order data from backend
    return data;
  } catch (error) {
    // If update fails, throw error for component to handle
    throw getErrorMessage(error, 'Failed to update order status');
  }
};

/**
 * ============================================================================
 * 9. EXPORT MAIN API INSTANCE
 * ============================================================================
 *
 * Export the main axios instance so components can use it for other API calls
 * if needed. Most components should use the exported functions above instead.
 */
export default api;

