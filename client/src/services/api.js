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
 * 1. CREATE AXIOS INSTANCE
 * ============================================================================
 *
 * Axios is a library that makes HTTP requests (like fetching data from API)
 * This creates a configured instance with base settings that all requests will use
 */
const api = axios.create({
  // baseURL: This is the starting URL for all API calls
  // So api.get('/products') becomes http://localhost:5000/api/products
  baseURL: 'http://localhost:5000/api',

  // headers: Default headers sent with every request
  headers: {
    'Content-Type': 'application/json', // Tell server we're sending JSON data
  },
});

/**
 * ============================================================================
 * 2. REQUEST INTERCEPTOR - Auto-attach authentication token
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
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    // Return the updated config so the request can proceed
    return config;
  },

  // Error case: Something went wrong before the request could be prepared
  (error) => Promise.reject(error)
);

/**
 * Helper function: Check if a route is for admin operations
 * Admin routes need admin authentication
 */
function isAdminAPIRoute(url) {
  // These routes require admin authentication
  const adminRoutes = [
    '/admin',        // Admin pages
    '/products',     // Create, edit, delete products (admin only)
    '/categories',   // Create, edit, delete categories (admin only)
    '/orders',       // View all orders (admin only) - but NOT /orders/myorders (customer)
  ];

  // Check if URL contains any admin route
  const containsAdminRoute = adminRoutes.some(route => url.includes(route));

  // Special case: /orders/myorders is customer route, not admin
  const isMyOrdersRoute = url.includes('/orders/myorders');

  return containsAdminRoute && !isMyOrdersRoute;
}

/**
 * Helper function: Get the authentication token for the current route type
 */
function getAuthTokenForRoute(isAdminRoute) {
  if (isAdminRoute) {
    // This is an admin route - try to get admin token first
    const adminToken = getAdminToken();
    if (adminToken) return adminToken;

    // If no admin token, fallback to customer token (shouldn't happen)
    return getCustomerToken();
  } else {
    // This is a customer route - try to get customer token first
    const customerToken = getCustomerToken();
    if (customerToken) return customerToken;

    // If no customer token, fallback to admin token (for multi-role users)
    return getAdminToken();
  }
}

/**
 * Helper function: Get admin authentication token from localStorage
 * localStorage is browser's local storage - data persists even after refresh
 */
function getAdminToken() {
  try {
    // Get admin info from localStorage (stored as JSON string)
    const adminInfoJSON = localStorage.getItem('userInfo');

    // If not found, return null
    if (!adminInfoJSON) return null;

    // Parse the JSON string back to an object
    const adminData = JSON.parse(adminInfoJSON);

    // Return token only if user is admin
    if (adminData.token && adminData.isAdmin) {
      return adminData.token;
    }

    return null;
  } catch (error) {
    // If parsing fails, return null (corrupted data or invalid format)
    return null;
  }
}

/**
 * Helper function: Get customer authentication token from localStorage
 */
function getCustomerToken() {
  try {
    // Get customer info from localStorage (stored as JSON string)
    const customerInfoJSON = localStorage.getItem('customerInfo');

    // If not found, return null
    if (!customerInfoJSON) return null;

    // Parse the JSON string back to an object
    const customerData = JSON.parse(customerInfoJSON);

    // Return token only if user is NOT admin (is customer)
    if (customerData.token && !customerData.isAdmin) {
      return customerData.token;
    }

    return null;
  } catch (error) {
    // If parsing fails, return null (corrupted data or invalid format)
    return null;
  }
}


/**
 * ============================================================================
 * 3. IMAGE URL HANDLING
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
 * @returns {string} - Complete working URL to the image
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

  // Backend server address
  const baseUrl = 'http://localhost:5000';

  // Ensure path starts with / for proper URL format
  // "/uploads/image.jpg" stays as "/uploads/image.jpg"
  // "uploads/image.jpg" becomes "/uploads/image.jpg"
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // Build the full URL based on where the image is stored on the server
  if (cleanPath.startsWith('/uploads/')) {
    // Images uploaded via the admin panel
    return `${baseUrl}${cleanPath}`;
  }

  if (cleanPath.startsWith('/assets/')) {
    // Static assets folder
    return `${baseUrl}${cleanPath}`;
  }

  // Default: assume it's in the bakery assets folder
  return `${baseUrl}/assets/bakery${cleanPath}`;
};

/**
 * ============================================================================
 * 4. AUTHENTICATION FUNCTIONS
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
  try {
    // Send registration data to backend
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
    });

    // If successful, save customer info to browser storage
    // Why? So user stays logged in even after page refresh
    if (data) {
      localStorage.setItem('customerInfo', JSON.stringify(data));
    }

    // Return the customer data (token, name, email, isAdmin flag)
    return data;
  } catch (error) {
    // If registration fails, throw error message for component to handle
    const errorMessage = error.response?.data?.message || 'Registration failed';
    throw errorMessage;
  }
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
  try {
    // Send login credentials to backend
    const { data } = await api.post('/auth/login', {
      email,
      password,
    });

    // If successful, save customer info to browser storage
    if (data) {
      localStorage.setItem('customerInfo', JSON.stringify(data));
    }

    // Return the customer data
    return data;
  } catch (error) {
    // If login fails, throw error message
    const errorMessage = error.response?.data?.message || 'Login failed';
    throw errorMessage;
  }
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
    const { data } = await api.post('/auth/verify', { token });

    // If valid, update customer info in storage
    if (data) {
      localStorage.setItem('customerInfo', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    // If token is invalid or expired, remove it from storage
    // This effectively logs the user out
    localStorage.removeItem('customerInfo');
    return null;
  }
};

/**
 * logoutCustomer: Log out the current customer
 *
 * What it does:
 * 1. Deletes customer info from browser storage
 * 2. Clears the authentication token
 * 3. User is no longer logged in
 *
 * Why simple? Logout only needs to clear local storage.
 * The backend doesn't need to do anything.
 *
 * Example usage:
 * logoutCustomer(); // User is now logged out
 */
export const logoutCustomer = () => {
  // Remove all customer data from browser storage
  localStorage.removeItem('customerInfo');

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
  try {
    // Get customer info from browser storage (stored as JSON string)
    const customerInfoJSON = localStorage.getItem('customerInfo');

    // If no info found, return null (user not logged in)
    if (!customerInfoJSON) {
      return null;
    }

    // Parse JSON string back to JavaScript object and return
    return JSON.parse(customerInfoJSON);
  } catch (error) {
    // If parsing fails (corrupted data), return null
    return null;
  }
};

/**
 * ============================================================================
 * 5. PRODUCT FUNCTIONS
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
    const { data } = await api.get('/products');

    // Process each product to fix image URLs
    return data.map((product) => {
      // Check if image is already a full URL
      const isFullUrl = product.image?.startsWith('http');

      let processedImageUrl = product.image; // Default to existing value

      // If not a full URL, build one
      if (!isFullUrl && product.image) {
        const imageFileName = product.image.startsWith('/') ? product.image : `/${product.image}`;
        processedImageUrl = `http://localhost:5000${imageFileName}`;
      }

      // Return product with corrected image URL and standardized id field
      return {
        ...product, // Keep all existing fields
        id: product._id || product.id, // Ensure 'id' field exists (sometimes it's '_id')
        image: processedImageUrl, // Replace image with full URL
      };
    });
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
    const { data } = await api.get(`/products/${productId}`);

    // Check if image needs URL processing
    const isFullUrl = data.image?.startsWith('http');

    let processedImageUrl = data.image; // Default to existing value

    // If not a full URL, build one
    if (!isFullUrl && data.image) {
      const imageFileName = data.image.startsWith('/') ? data.image : `/${data.image}`;
      processedImageUrl = `http://localhost:5000${imageFileName}`;
    }

    // Return product with corrected image URL and standardized id field
    return {
      ...data, // Keep all existing fields
      id: data._id || data.id, // Ensure 'id' field exists
      image: processedImageUrl, // Replace image with full URL
    };
  } catch (error) {
    // If request fails or product not found, log error and return null
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
};

/**
 * ============================================================================
 * 6. CATEGORY FUNCTIONS
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
    const { data } = await api.get('/categories');

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
 * 7. ORDER FUNCTIONS
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
    const { data } = await api.put(`/orders/${orderId}/status`, { status });

    // Return the updated order data from backend
    return data;
  } catch (error) {
    // If update fails, throw error for component to handle
    const errorMessage = error.response?.data?.message || 'Failed to update order status';
    throw errorMessage;
  }
};

/**
 * ============================================================================
 * 8. EXPORT MAIN API INSTANCE
 * ============================================================================
 *
 * Export the main axios instance so components can use it for other API calls
 * if needed. Most components should use the exported functions above instead.
 */
export default api;

