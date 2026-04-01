# Frontend Documentation - Hatemalo Bakery Project

## 1. Project Overview

**Project**: Full-stack e-commerce platform for online bakery  
**Frontend Stack**: React 19.2.4, Vite, Tailwind CSS v4.2.2, React Router v7.13.1, Axios  
**State Management**: React Context API (AuthContext, CartContext, ToastContext)  
**Storage**: localStorage (persistent), sessionStorage (per-tab)  
**Key Features**: Dual auth (customer/admin), shopping cart, order management, responsive design

---

## 2. Directory Structure

```
client/src/
├── app/                    # App entry, routing
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx          # Lazy-loaded routes
├── assets/                 # Static data
├── config/                 # Environment, constants
├── features/               # Feature modules
│   ├── admin/              # Dashboard + product/order/category management
│   ├── auth/               # Login, register, auth logic
│   ├── cart/               # Cart state + drawer component
│   ├── home/               # Hero, featured products, testimonials
│   ├── info/               # Contact, about pages
│   ├── orders/             # Checkout, order history
│   └── products/           # Product list, detail pages
├── shared/                 # Reusable components, hooks, services
│   ├── components/         # Navbar, Footer, Toast, ProtectedRoute, etc.
│   ├── hooks/              # useAuth, useCart, useToast, useFetch
│   ├── services/           # api.js (Axios + interceptors)
│   └── utils/              # Formatters, image utilities
└── styles/                 # Global CSS, Tailwind
```

---

## 3. Core Components

| Component | Path | Purpose |
|-----------|------|---------|
| App | app/App.jsx | Root with providers (Auth, Cart, Router, Layout) |
| Navbar | shared/components/Navbar.jsx | Header, nav links, cart button, user profile |
| Footer | shared/components/Footer.jsx | Footer content |
| Layout | shared/components/Layout.jsx | Conditional render Navbar/Footer, Toast container |
| ErrorBoundary | shared/components/ErrorBoundary.jsx | Global error handler |
| ProtectedRoute | shared/components/ProtectedRoute.jsx | Auth + role-based route guard |
| Toast | shared/components/Toast.jsx | Notification with auto-dismiss |
| CartDrawer | features/cart/components/CartDrawer.jsx | Sliding cart panel with items |
| ProductCard | features/products/components/ProductCard.jsx | Product display card |
| Hero | features/home/components/Hero.jsx | Hero banner |
| CategoryQuickLinks | features/home/components/CategoryQuickLinks.jsx | Category filter buttons |
| FeaturedProducts | features/home/components/FeaturedProducts.jsx | Featured items grid |
| Testimonials | features/home/components/Testimonials.jsx | Customer reviews |
| AdminLayout | features/admin/components/AdminLayout.jsx | Admin dashboard layout with sidebar |
| AdminSidebar | features/admin/components/AdminSidebar.jsx | Admin navigation |
| CategoryModal | features/admin/components/CategoryModal.jsx | Add/edit category dialog |
| DeleteModal | features/admin/components/DeleteModal.jsx | Delete confirmation |

---

## 4. Custom Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| useAuth | Access auth context (customer/admin, login/logout) | `{ customer, admin, isAuthenticated, isAdminAuthenticated, login(), logout() }` |
| useCart | Access cart state (items, add/remove/update, subtotal) | `{ cart, addToCart(), removeFromCart(), updateCartQty(), clearCart(), subtotal }` |
| useToast | Show notifications | `{ addToast(message, type) }` |
| useFetch | Fetch with caching, cancellation, SWR | `{ data, loading, error, refetch(), setData() }` |
| useProducts | Wrapper around useFetch('/products') | `{ products, loading, error, refetch() }` |
| useCategories | Wrapper around useFetch('/categories') | `{ categories, loading, error, refetch() }` |
| useAdminData | Fetch all admin dashboard data | `{ products, orders, categories, loading, error, refetch() }` |

**useFetch Features**:
- In-memory query caching (prevents duplicate requests)
- AbortController for cancellation on unmount
- Stale-While-Revalidate (SWR) pattern
- Force refresh via `refetch(true)`

**Admin Token Validation**:
```javascript
// Admin pages use skipCache: true for token validation on every request
const { data } = useFetch('/products', { skipCache: true });
// Ensures 401 error caught immediately if token expires
```

---

## 5. State Management

### Context API Configuration

**AuthContext** (`features/auth/context/`):
- Manages: customer login, admin login, logout
- Stores: user objects, tokens (CUSTOMER_TOKEN, ADMIN_TOKEN), active role
- Storage: localStorage (tokens, user info), sessionStorage (ACTIVE_ROLE per-tab)
- Multi-tab support: Different roles in different tabs via sessionStorage isolation

**CartContext** (`features/cart/context/`):
- Manages: cart items, quantities, add/remove/clear operations
- Stores: cart array in localStorage (bakery_cart key)
- Operations: addToCart(), removeFromCart(), updateCartQty(), clearCart()
- Computed: subtotal (sum of price × quantity)

**ToastContext** (`shared/context/`):
- Manages: toast notifications with auto-dismiss
- Operations: addToast(message, type) where type = success/error/info/warning

**Architecture Note**: Context creation (createContext) in `*ContextValue.js` files, provider components in `*Context.jsx` files (React Fast Refresh compliance)

### Storage Keys

| Key | Type | Purpose |
|-----|------|---------|
| CUSTOMER_TOKEN | localStorage | JWT for customer API calls |
| ADMIN_TOKEN | localStorage | JWT for admin API calls |
| USER_INFO | localStorage | Serialized customer user object |
| ADMIN_INFO | localStorage | Serialized admin user object |
| bakery_cart | localStorage | Cart items array (JSON) |
| ACTIVE_ROLE | sessionStorage | Current user role in this tab ('customer'/'admin') |

---

## 6. API Integration & Interceptors

### Axios Configuration

```javascript
// shared/services/api.js
const API = axios.create({
  baseURL: `${VITE_API_URL}/api`,
  withCredentials: true  // Include cookies for refresh token
});
```

### Request Interceptor - Route-Based Token Selection

**Logic**: Determines admin vs customer token based on endpoint:
- POST /orders → customer (creating order)
- GET /orders → admin (viewing orders)
- /admin/* → admin
- /categories with POST/PUT/DELETE → admin, GET → customer
- Default → customer

```javascript
// Stores sessionStorage.ACTIVE_ROLE if missing (fallback)
const role = sessionStorage.ACTIVE_ROLE || detectFromTokens();
const token = localStorage.getItem(isAdminRoute ? 'admin_token' : 'customer_token');
headers.Authorization = `Bearer ${token}`;
```

### Response Interceptor - 401 Token Refresh

**Flow**:
1. Detect 401 status
2. If already refreshing, queue request (prevent duplicate refreshes)
3. POST /auth/refresh to get new token
4. Store new token in appropriate localStorage key
5. Retry original request with new token
6. Process queued requests

**Queue Mechanism**: Prevents multiple simultaneous token refresh attempts

### Service Layer

| Service | Exports |
|---------|---------|
| authService | loginAdmin(), loginCustomer(), registerCustomer(), logoutUser() |
| productService | getProducts(), getProductById(), addProduct(), updateProduct(), deleteProduct() |
| categoryService | getCategories(), addCategory(), updateCategory(), deleteCategory() |
| orderService | createOrder(), getMyOrders(), getOrders(), updateOrder() |
| adminService | getDashboardStats(), getAllProducts(), getAllOrders(), getAllCategories() |

### API Endpoints Reference

```
POST   /auth/login -> login customer
POST   /auth/admin/login -> login admin
POST   /auth/register -> register new customer
POST   /auth/refresh -> refresh expired token
POST   /auth/logout -> logout user

GET    /products -> list products
GET    /products/:id -> product details
POST   /admin/products -> create (admin)
PUT    /admin/products/:id -> update (admin)
DELETE /admin/products/:id -> delete (admin)

GET    /categories -> list categories
POST   /admin/categories -> create (admin)
PUT    /admin/categories/:id -> update (admin)
DELETE /admin/categories/:id -> delete (admin)

POST   /orders -> create order (customer)
GET    /orders -> list all (admin)
GET    /orders/my-orders -> customer's orders
GET    /orders/:id -> order details
PUT    /orders/:id -> update status (admin)
```

---

## 7. Authentication Flow

### Login (Customer)
1. Navigate to /auth/customer-login
2. Enter email + password
3. `authService.loginCustomer()` → POST /auth/login
4. Backend returns token + user data
5. `AuthContext.login()` stores:
   - Token in CUSTOMER_TOKEN
   - User in USER_INFO
   - Role 'customer' in ACTIVE_ROLE (sessionStorage)
6. ProtectedRoute allows access

### Login (Admin)
1. Navigate to /auth/admin-login
2. Enter email + password
3. `authService.loginAdmin()` → POST /auth/admin/login
4. Stores in ADMIN_TOKEN, ADMIN_INFO, ACTIVE_ROLE='admin'
5. Redirects to /admin/dashboard

### Registration (Customer)
1. Navigate to /auth/register
2. Enter name, email, password
3. `authService.registerCustomer()` → POST /auth/register
4. Auto-login after successful registration
5. Redirects to home

### Token Refresh
- Any API call getting 401 triggers refresh
- Interceptor calls /auth/refresh
- New token stored, original request retried
- Queued requests processed after refresh

### Logout
- `AuthContext.logout()` clears tokens and user state
- Removes from localStorage and sessionStorage
- Redirects to login page

---

## 8. Form Validation

### Custom Validation (No External Libraries)

**Checkout.jsx Phone Validation** (Nepali format):
```javascript
// Regex: ^(\+977)?[9][6-9]\d{8}$
// Validates: 9841234567, 9744567890, +9779841234567
// Rejects: 9041234567 (invalid operator), 1234567890 (not starting with 9)
```

**Validation Fields**:
- Name: min 2 characters
- Email: valid format (@, domain)
- Phone: 10 digits starting with 9, operator code 6-9
- City: required
- All: real-time validation on blur + form submission

---

## 9. Responsive Design

**Tailwind CSS v4.2.2** provides utility-first styling:
- Mobile-first breakpoints (sm, md, lg, xl, 2xl)
- Flexbox layouts for responsive grids
- Mobile hamburger menu in Navbar
- Responsive typography scaling

**Mobile Features**:
- Touch-friendly buttons and spacing
- Hamburger menu for navigation
- Stack layouts on small screens
- Full-width forms and inputs

---

## 10. Advanced Features

### Multi-Tab Support
- sessionStorage stores ACTIVE_ROLE per tab
- Admin/customer can be logged in different tabs
- Request interceptor uses sessionStorage to select correct token
- Prevents token cross-contamination

### Query Caching
- useFetch implements in-memory Map cache keyed by URL
- `skipCache: true` bypasses for force refresh
- Admin pages use skipCache for token validation every request
- Reduces API calls, improves perceived performance

### Request Cancellation
- useFetch uses AbortController
- Cancels pending requests on component unmount
- Prevents memory leaks and stale state updates

### Error Boundary
- Wraps entire App
- Catches unhandled errors
- Shows fallback UI with retry button
- Prevents app crash from component errors

### Protected Routes
- ProtectedRoute wrapper checks isAuthenticated
- requireAdmin prop enforces admin-only access
- Redirects to appropriate login page if not authorized
- Admin routes hidden from customers

---

## 11. Environment & Configuration

```javascript
// config/constants.js
export const API_ENDPOINTS = { /* routes */ };
export const ROUTES = { /* paths */ };
export const STORAGE_KEYS = { /* keys */ };

// config/environment.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const ENABLE_GUEST_CHECKOUT = true;
```

**.env.example**:
```
VITE_API_URL=http://localhost:5000
```

---

## 12. Key Patterns & Best Practices

### Context + Hook Pattern
- Context provides state (AuthContext, CartContext)
- Custom hooks expose context safely (useAuth, useCart)
- Prevents direct context usage, enables refactoring

### Feature-Based Folder Organization
- Related components, hooks, services grouped together
- Easy to understand feature scope
- Clear dependency boundaries

### Service Layer
- API calls centralized in service files
- Components use services, not direct Axios calls
- Consistent error handling across app

### Component Separation
- Pages handle routing + main layout
- Components handle reusable pieces
- Hooks handle logic extraction
- Utils handle helpers (formatters, etc.)

### Lazy Loading Routes
- Routes defined in routes.jsx with React.lazy()
- Suspense provides fallback Loader
- Reduces initial bundle size

### Error Handling
- API Interceptor catches 401, 403, 500 errors
- Components show toast notifications
- ErrorBoundary catches component render errors

### Form Handling
- Controlled components with useState
- Real-time validation on blur
- Form-wide validation on submit
- Error messages display with field state

---

## 13. Testing & Development

**React Fast Refresh**: File changes hot-reload without losing state

**Browser DevTools**:
- React Developer Tools extension for component inspection
- Network tab for API debugging
- Storage tab for localStorage/sessionStorage inspection
- Console for error logging

**Common Debugging**:
1. Check browser console for errors
2. Verify token in localStorage (DevTools → Application)
3. Check API response in Network tab
4. Verify component state in React DevTools
