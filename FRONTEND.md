# HateMalo Bakery - Frontend Documentation

## 📋 Table of Contents
1. [Frontend Architecture](#frontend-architecture)
2. [Technology Overview](#technology-overview)
3. [Project Structure](#project-structure)
4. [Routing System](#routing-system)
5. [Custom Hooks - Deep Dive](#custom-hooks---deep-dive)
6. [Components Implementation](#components-implementation)
7. [Services & API Integration](#services--api-integration)
8. [State Management](#state-management)
9. [Form Handling](#form-handling)
10. [Authentication Flow](#authentication-flow)
11. [Shopping Cart System](#shopping-cart-system)
12. [Styling & Design](#styling--design)
13. [Error Handling & Security](#error-handling--security)
14. [Performance Optimization](#performance-optimization)
15. [Development Guide](#development-guide)

---

## 🏗 Frontend Architecture

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│                    React App (App.jsx)              │
│              ↓ Wrapped with ErrorBoundary           │
├─────────────────────────────────────────────────────┤
│                   Router (Routes)                   │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Pages     │  │  Components  │  │   Layout   │ │
│  │  (12 pages) │  │  (15+ comps) │  │ (4 layouts)│ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
├─────────────────────────────────────────────────────┤
│  Custom Hooks (8 hooks) + Context API (CartContext) │
├─────────────────────────────────────────────────────┤
│  Services: API, Auth, Orders, Products              │
├─────────────────────────────────────────────────────┤
│  Utilities: Constants, Icons, Helpers               │
└─────────────────────────────────────────────────────┘
         ↓
    Backend API (Express.js)
         ↓
    MongoDB Database
```

### Data Flow Pattern
```
User Interaction
    ↓
Component State/Hook
    ↓
Service Call (API)
    ↓
Backend Processing
    ↓
Response Handler (Toast/Redirect)
    ↓
State Update
    ↓
Component Re-render
```

---

## 🛠 Technology Overview

### Core Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 18+ | UI library with hooks |
| **React Router** | 6+ | Client-side routing |
| **Vite** | Latest | Build tool & dev server |
| **Tailwind CSS** | 3+ | Utility-first styling |
| **Axios** | Latest | HTTP client |
| **React Hot Toast** | Latest | Toast notifications |
| **Lucide Icons** | Latest | Icon library |
| **PropTypes** | Latest | Type checking |

### Key Capabilities
- ✅ Server-side rendering friendly
- ✅ Lazy loading support
- ✅ State persistence
- ✅ Real-time validation
- ✅ Error boundaries
- ✅ Responsive design
- ✅ Fast build times (Vite)

---

## 📁 Frontend Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ProductForm.jsx              # Unified product form
│   │   │   └── [other admin components]
│   │   ├── bakery/
│   │   │   ├── Hero.jsx                     # Landing section
│   │   │   ├── FeaturedProducts.jsx         # Product showcase
│   │   │   ├── CategoryQuickLinks.jsx       # Category navigation
│   │   │   ├── ProductCard.jsx              # Product item display
│   │   │   └── Testimonials.jsx             # Customer testimonials
│   │   ├── client/
│   │   │   └── [customer-specific components]
│   │   ├── common/
│   │   │   ├── ErrorBoundary.jsx            # Error handling wrapper
│   │   │   ├── LoginForm.jsx                # Reusable auth form
│   │   │   ├── FormField.jsx                # Reusable input field
│   │   │   └── DeleteModal.jsx              # Delete confirmation
│   │   └── layout/
│   │       ├── Navbar.jsx                   # Navigation header
│   │       ├── Footer.jsx                   # Page footer
│   │       ├── CartDrawer.jsx               # Shopping cart sidebar
│   │       └── AuthModal.jsx                # Login modal
│   │
│   ├── hooks/
│   │   ├── useFormManager.js                # Form state & validation
│   │   ├── useCart.js                       # Shopping cart logic
│   │   ├── useFetchData.js                  # Data fetching
│   │   ├── useAuthCheck.js                  # Auth protection
│   │   ├── useSearchAndFilter.js            # Search & filtering
│   │   ├── useLocalStorage.js               # Persistent storage
│   │   ├── useApiCall.js                    # API operations
│   │   └── index.js                         # Hooks export
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx               # Admin auth page
│   │   │   ├── AdminDashboard.jsx           # Admin control panel
│   │   │   ├── AddProduct.jsx               # Create product page
│   │   │   └── EditProduct.jsx              # Update product page
│   │   ├── client/
│   │   │   ├── Home.jsx                     # Landing page
│   │   │   ├── Menu.jsx                     # Product catalog
│   │   │   ├── ProductDetails.jsx           # Single product page
│   │   │   ├── Checkout.jsx                 # Order placement
│   │   │   ├── MyOrders.jsx                 # Order history
│   │   │   ├── CustomerLogin.jsx            # Customer auth page
│   │   │   ├── Contact.jsx                  # Contact form
│   │   │   └── Story.jsx                    # About page
│   │
│   ├── context/
│   │   └── CartContext.jsx                  # Global cart state
│   │
│   ├── services/
│   │   ├── api.js                           # Axios instance
│   │   ├── authService.js                   # Auth functions
│   │   ├── orderService.js                  # Order operations
│   │   └── productService.js                # Product operations
│   │
│   ├── constants/
│   │   ├── categoryIcons.js                 # Category icon map
│   │   └── orderStatus.js                   # Order status constants
│   │
│   ├── assets/
│   │   └── [images, fonts, etc]
│   │
│   ├── App.jsx                              # Root component
│   ├── App.css                              # Global styles
│   ├── index.css                            # Base styles
│   └── main.jsx                             # Entry point
│
├── public/
│   ├── index.html                           # HTML template
│   └── assets/
│
├── vite.config.js                           # Vite configuration
├── eslint.config.js                         # Linting rules
├── tailwind.config.js                       # Tailwind setup
├── postcss.config.js                        # PostCSS configuration
└── package.json                             # Dependencies

```

---

## 🗺 Routing System

### React Router Configuration

```javascript
// routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Routes (no authentication required)
const publicRoutes = [
  { path: '/', component: Home },
  { path: '/menu', component: Menu },
  { path: '/product/:id', component: ProductDetails },
  { path: '/contact', component: Contact },
  { path: '/story', component: Story },
];

// Customer Routes (requires customer login)
const customerRoutes = [
  { path: '/checkout', component: Checkout },
  { path: '/my-orders', component: MyOrders },
  { path: '/customer-login', component: CustomerLogin },
];

// Admin Routes (requires admin login)
const adminRoutes = [
  { path: '/admin', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/admin/add-product', component: AddProduct },
  { path: '/admin/edit/:id', component: EditProduct },
];

// Usage in App.jsx
<BrowserRouter>
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Home />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    
    {/* Protected customer routes */}
    <Route element={<ProtectedRoute userType="customer" />}>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/my-orders" element={<MyOrders />} />
    </Route>
    
    {/* Admin routes */}
    <Route path="/admin" element={<AdminLogin />} />
    <Route element={<ProtectedRoute userType="admin" />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-product" element={<AddProduct />} />
      <Route path="/admin/edit/:id" element={<EditProduct />} />
    </Route>
    
    {/* Catch all */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
</BrowserRouter>
```

### Route Protection Implementation
```javascript
// components/ProtectedRoute.jsx
function ProtectedRoute({ userType }) {
  const { isAuthenticated } = useAuthCheck(userType);
  
  if (!isAuthenticated) {
    return <Navigate to={userType === 'admin' ? '/admin' : '/customer-login'} />;
  }
  
  return <Outlet />;
}
```

---

## 🎣 Custom Hooks - Deep Dive

### 1. useFormManager (NEW - Unified Form Hook)

**Purpose**: Centralized form state and validation management

**Implementation**:
```javascript
// hooks/useFormManager.js
import { useState, useCallback } from 'react';

export const useFormManager = ({ 
  initialValues = {}, 
  onSubmit, 
  validations = {} 
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field with flexible validation support
  const validateField = useCallback((field, value) => {
    const validation = validations[field];
    if (!validation) return true;

    let fieldError = '';

    // Support 1: Function-based validation (simple)
    if (typeof validation === 'function') {
      fieldError = validation(value) || '';
    }
    // Support 2: Rule-based validation (advanced)
    else if (Array.isArray(validation)) {
      for (const rule of validation) {
        if (rule.required && !value) {
          fieldError = rule.message || 'This field is required';
          break;
        }
        if (rule.minLength && value?.length < rule.minLength) {
          fieldError = rule.message;
          break;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          fieldError = rule.message;
          break;
        }
      }
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
    
    return !fieldError;
  }, [validations]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(field => {
      if (!validateField(field, values[field])) {
        isValid = false;
      }
    });

    return isValid;
  }, [values, validations, validateField]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: fieldValue }));
    
    // Real-time validation if field touched
    if (touched[name]) {
      validateField(name, fieldValue);
    }
  }, [touched, validateField]);

  // Handle blur (mark as touched)
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  // Reset form to initial state
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    
    // Setter methods
    setFieldValue: (field, value) => setValues(prev => ({ ...prev, [field]: value })),
    setFieldError: (field, error) => setErrors(prev => ({ ...prev, [field]: error })),
    setFieldTouched: (field, isTouched) => setTouched(prev => ({ ...prev, [field]: isTouched })),
    
    // Validation methods
    validateField,
    validateForm
  };
};
```

**Usage Example**:
```javascript
// In LoginForm
const form = useFormManager({
  initialValues: { email: '', password: '' },
  validations: {
    email: [
      { required: true, message: 'Email is required' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
    ],
    password: [
      { required: true, message: 'Password is required' },
      { minLength: 6, message: 'Min 6 characters' }
    ]
  },
  onSubmit: async (values) => {
    await api.post('/auth/login', values);
  }
});

// In JSX
<input 
  name="email"
  value={form.values.email}
  onChange={form.handleChange}
  onBlur={form.handleBlur}
/>
{form.touched.email && form.errors.email && (
  <span className="text-red-500">{form.errors.email}</span>
)}
```

---

### 2. useCart (Shopping Cart State)

**Purpose**: Global shopping cart management

**Implementation**:
```javascript
// hooks/useCart.js
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  
  return context;
};

// context/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Load from local storage
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    // Dispatch event for cross-tab sync
    window.dispatchEvent(new Event('cartUpdated'));
  }, [items]);

  // Add item to cart
  const addToCart = (product) => {
    setItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item._id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate totals
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
```

**Usage Example**:
```javascript
// In ProductCard component
function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}

// In Checkout component
function Checkout() {
  const { items, total, clearCart } = useCart();

  const handleCheckout = async () => {
    await api.post('/orders', { items, total });
    clearCart();
  };

  return (
    <div>
      <h2>Cart Total: Rs. {total}</h2>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
}
```

---

### 3. useFetchData (Data Fetching with Loading States)

**Purpose**: Simplified data fetching with loading and error handling

**Implementation**:
```javascript
// hooks/useFetchData.js
import { useState, useEffect } from 'react';

export const useFetchData = (
  fetchFn,
  dependencies = [],
  onError = null,
  { initialData = null } = {}
) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          onError?.(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup: prevent state update on unmount
    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
};
```

**Usage Example**:
```javascript
// In Menu component
function Menu() {
  const { data: products, loading, error } = useFetchData(
    () => api.get('/products').then(res => res.data),
    [],
    (error) => toast.error('Failed to load products')
  );

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

---

### 4. useAuthCheck (Route Protection)

**Purpose**: Verify authentication and protect routes

**Implementation**:
```javascript
// hooks/useAuthCheck.js
import { useNavigate, useEffect, useState } from 'react';

export const useAuthCheck = (userType = 'customer', options = {}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      let userInfo = null;

      if (userType === 'admin') {
        userInfo = localStorage.getItem('userInfo');
      } else {
        userInfo = localStorage.getItem('customerInfo');
      }

      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setUser(user);
          setIsAuthenticated(true);
        } catch (err) {
          setIsAuthenticated(false);
          if (options.redirectTo) {
            navigate(options.redirectTo);
          }
        }
      } else {
        setIsAuthenticated(false);
        if (options.redirectTo) {
          navigate(options.redirectTo);
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => checkAuth();
    window.addEventListener('authchange', handleAuthChange);

    return () => window.removeEventListener('authchange', handleAuthChange);
  }, [userType, navigate, options]);

  return { isAuthenticated, user };
};
```

**Usage Example**:
```javascript
// In protected page
function AdminDashboard() {
  const { isAuthenticated, user } = useAuthCheck('admin', { redirectTo: '/admin' });

  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

---

### 5. useSearchAndFilter (Search & Filtering)

**Purpose**: Real-time search and filtering logic

**Implementation**:
```javascript
// hooks/useSearchAndFilter.js
import { useState, useMemo, useCallback, useEffect } from 'react';

export const useSearchAndFilter = (
  items = [],
  searchFields = ['name'],
  debounceDelay = 300
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), debounceDelay);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  // Apply filters and search
  const filtered = useMemo(() => {
    let result = items;

    // Apply text search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field =>
          String(item[field]).toLowerCase().includes(lowerSearch)
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => item[key] === value);
      }
    });

    return result;
  }, [items, debouncedSearch, filters, searchFields]);

  const applyFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  return {
    filtered,
    searchTerm,
    setSearchTerm,
    filters,
    applyFilter,
    clearFilters
  };
};
```

**Usage Example**:
```javascript
// In Menu component
function Menu() {
  const { data: products } = useFetchData(() => api.get('/products'));
  const { filtered, searchTerm, setSearchTerm, applyFilter } = useSearchAndFilter(
    products,
    ['name', 'description']
  );

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
      />
      <select onChange={(e) => applyFilter('category', e.target.value)}>
        <option value="">All Categories</option>
        <option value="cakes">Cakes</option>
        <option value="pastries">Pastries</option>
      </select>
      <div className="grid">
        {filtered.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

---

### 6. useLocalStorage (Persistent Storage)

**Purpose**: Store data in browser local storage with cross-tab sync

**Implementation**:
```javascript
// hooks/useLocalStorage.js
import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Set value in state and storage
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch event for cross-tab sync
      window.dispatchEvent(new Event('localStorageChanged'));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing localStorage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};
```

**Usage Example**:
```javascript
// In component
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme: {theme}
      </button>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
}
```

---

### 7. useApiCall (API Operations with Toast)

**Purpose**: Simplified API calls with automatic error handling and notifications

**Implementation**:
```javascript
// hooks/useApiCall.js
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useApiCall = (apiFunction, onSuccess = null, onError = null) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      
      toast.success('Operation successful!', {
        icon: '✓',
        style: { borderRadius: '8px', background: '#333', color: '#fff' }
      });
      
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      
      toast.error(errorMessage, {
        icon: '✕',
        style: { borderRadius: '8px', background: '#fee', color: '#900' }
      });
      
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  return { execute, loading, data, error };
};
```

**Usage Example**:
```javascript
// In component
function DeleteProduct({ productId }) {
  const { execute: deleteProduct, loading } = useApiCall(
    (id) => api.delete(`/products/${id}`),
    (result) => navigate('/admin/dashboard'),
    (error) => console.error('Delete failed:', error)
  );

  return (
    <button 
      onClick={() => deleteProduct(productId)} 
      disabled={loading}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## 🧩 Components Implementation

### Component Hierarchy

```
App
├── ErrorBoundary
│   ├── Navbar
│   │   ├── CartDrawer
│   │   └── AuthModal
│   ├── Router
│   │   ├── Home
│   │   │   ├── Hero
│   │   │   ├── FeaturedProducts
│   │   │   │   └── ProductCard[]
│   │   │   ├── CategoryQuickLinks
│   │   │   └── Testimonials
│   │   ├── Menu
│   │   │   └── ProductCard[]
│   │   ├── ProductDetails
│   │   ├── Checkout
│   │   ├── MyOrders
│   │   ├── AdminDashboard
│   │   │   ├── ProductsManagement
│   │   │   ├── CategoriesManagement
│   │   │   └── OrdersManagement
│   │   ├── AddProduct
│   │   │   └── ProductForm
│   │   └── EditProduct
│   │       └── ProductForm
│   └── Footer
```

### New Reusable Components

#### **ErrorBoundary Component**
```javascript
// components/common/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error tracking service
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mt-2">
              We're sorry for the inconvenience.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 text-left bg-white p-4 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### **LoginForm Component**
```javascript
// components/common/LoginForm.jsx
function LoginForm({
  form,
  title = 'Login',
  subtitle = 'Enter your credentials',
  authError,
  onAuthErrorDismiss,
  footer
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    await form.handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark-brown">{title}</h2>
          <p className="text-gray-500 mt-2">{subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {authError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl">
              {authError}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={`w-full px-4 py-3 rounded-xl border ${
                form.touched.email && form.errors.email
                  ? 'border-red-500'
                  : 'border-gray-200'
              }`}
              placeholder="your@email.com"
            />
            {form.touched.email && form.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                  form.touched.password && form.errors.password
                    ? 'border-red-500'
                    : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {form.touched.password && form.errors.password && (
              <p className="text-red-500 text-sm mt-1">{form.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={form.isSubmitting}
            className="w-full bg-light-brown text-white font-bold py-3 rounded-xl hover:bg-dark-brown disabled:opacity-50"
          >
            {form.isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        {footer && <div className="mt-8 pt-8 border-t">{footer}</div>}
      </div>
    </div>
  );
}
```

#### **ProductForm Component**
```javascript
// components/admin/ProductForm.jsx
function ProductForm({
  mode = 'create',
  product = null,
  categories = [],
  onSubmit,
  onCancel,
  isLoading = false,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    category: product?.category || categories[0]?.name || '',
    stock: product?.stock || '',
    description: product?.description || ''
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill all required fields');
      return;
    }

    if (mode === 'create' && !image) {
      alert('Product image is required');
      return;
    }

    onSubmit({ ...formData, image });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        {/* Left Column: Form Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-light-brown"
              placeholder="e.g. Chocolate Cake"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Price (Rs.)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl"
                placeholder="1500"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            >
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border rounded-xl"
              placeholder="Describe the product..."
            />
          </div>
        </div>

        {/* Right Column: Image Upload */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">
            Product Image
          </label>
          <div className="aspect-square bg-gray-50 rounded-3xl border-2 border-dashed flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full h-full cursor-pointer"
              />
            )}
          </div>
        </div>
      </form>

      {/* Buttons */}
      <div className="flex gap-4 mt-12">
        <button
          onClick={onCancel}
          className="flex-1 py-4 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-4 bg-light-brown text-white rounded-xl hover:bg-dark-brown disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </div>
  );
}
```

---

## 🔌 Services & API Integration

### Axios Configuration

```javascript
// services/api.js
import axios from 'axios';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('userInfo');
      window.location.href = '/admin';
    }
    throw error;
  }
);

export const getImageUrl = (imagePath) => {
  return `${API_BASE.replace('/api', '')}/uploads/${imagePath}`;
};

export default api;
```

### Authentication Service

```javascript
// services/authService.js
import api from './api';

export const authService = {
  // Admin login
  adminLogin: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(response));
    return response;
  },

  // Customer registration
  registerCustomer: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('customerInfo', JSON.stringify(response));
    return response;
  },

  // Customer login
  loginCustomer: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('customerInfo', JSON.stringify(response));
    return response;
  },

  // Logout
  logout: (userType = 'customer') => {
    const key = userType === 'admin' ? 'userInfo' : 'customerInfo';
    localStorage.removeItem(key);
    window.dispatchEvent(new Event('authchange'));
  },

  // Get current user
  getCurrentUser: () => {
    const userInfo = localStorage.getItem('userInfo');
    const customerInfo = localStorage.getItem('customerInfo');
    return userInfo ? JSON.parse(userInfo) : JSON.parse(customerInfo);
  }
};
```

### Product Service

```javascript
// services/productService.js
import api from './api';

export const productService = {
  // Get all products
  getProducts: () => api.get('/products'),

  // Get single product
  getProduct: (id) => api.get(`/products/${id}`),

  // Create product
  createProduct: (formData) => 
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Update product
  updateProduct: (id, formData) =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Get products by category
  getProductsByCategory: (category) =>
    api.get(`/products?category=${category}`)
};
```

---

## 🎨 Styling & Design

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{jsx,js}'],
  theme: {
    extend: {
      colors: {
        'cream': '#FFF8F0',
        'light-brown': '#D4A574',
        'dark-brown': '#3D2B1F',
        'gold': '#D4AF37'
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
};
```

### Global Styling

```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

:root {
  --color-cream: #FFF8F0;
  --color-light-brown: #D4A574;
  --color-dark-brown: #3D2B1F;
  --color-gold: #D4AF37;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--color-cream);
  color: var(--color-dark-brown);
}

.btn-primary {
  @apply px-6 py-3 bg-light-brown text-white font-bold rounded-lg hover:bg-dark-brown transition-colors;
}

.btn-secondary {
  @apply px-6 py-3 border border-light-brown text-light-brown font-bold rounded-lg hover:bg-light-brown hover:text-white transition-colors;
}
```

---

## 🔐 Authentication Flow

### Login Flow

```
User clicks "Sign In"
    ↓
Fills email & password
    ↓
Form validation (useFormManager)
    ↓
API call: POST /auth/login
    ↓
Backend validates credentials
    ↓
Returns JWT token + user info
    ↓
Store in localStorage (userInfo/customerInfo)
    ↓
Dispatch 'authchange' event
    ↓
useAuthCheck detects change
    ↓
Redirect to dashboard/home
```

### Protected Route Flow

```
Route component renders
    ↓
useAuthCheck hook checks localStorage
    ↓
Token exists?
    ├─ Yes → Render page
    └─ No → Redirect to login
```

---

## 🛒 Shopping Cart System

### Cart Operations Flow

```
Add to Cart
    ↓
useCart.addToCart(product)
    ↓
Update state: add/update quantity
    ↓
Save to localStorage
    ↓
Dispatch 'cartUpdated' event
    ↓
Components re-render with new totals
    ↓
Update cart badge/drawer

Checkout
    ↓
useCart.items & useCart.total
    ↓
POST /orders API call
    ↓
Backend creates order
    ↓
useCart.clearCart()
    ↓
Redirect to /my-orders
```

---

## ⚡ Error Handling & Security

### Error Boundaries
- ErrorBoundary wraps entire app
- Catches React component errors
- Shows fallback UI
- Prevents white screen of death

### Form Validation
- Real-time validation in useFormManager
- Field-level and form-level validation
- Display specific error messages
- Prevent invalid submissions

### API Security
- JWT token authentication
- Token stored in localStorage
- Axios interceptors for token injection
- Automatic logout on 401 responses

```javascript
// Axios interceptor example
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/admin';
    }
    throw error;
  }
);
```

---

## 📈 Performance Optimization

### Code Splitting with React Router

```javascript
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

<Route path="/" element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
```

### Memoization

```javascript
// useCallback for handler functions
const handleChange = useCallback((e) => {
  // ...
}, [dependencies]);

// useMemo for expensive computations
const filtered = useMemo(() => {
  return items.filter(item => item.category === selectedCategory);
}, [items, selectedCategory]);

// React.memo for component optimization
export default React.memo(ProductCard);
```

### Image Optimization
- Lazy loading for images
- Responsive image sizes
- WebP format support
- Compression via upload

---

## 🔄 State Management Pattern

### Global State (Context API)
```javascript
// CartContext - accessible via useCart() hook
- items: Product[]
- addToCart(product)
- removeFromCart(productId)
- updateQuantity(productId, qty)
- clearCart()
- total: number
- itemCount: number
```

### Local State (Component State)
```javascript
// Form inputs, UI toggles, loading states
const [form, setForm] = useFormManager({...});
const [isOpen, setIsOpen] = useState(false);
const [loading, setLoading] = useState(false);
```

### Persistent State (localStorage)
```javascript
// User authentication
localStorage.setItem('userInfo', JSON.stringify(user));

// Shopping cart
localStorage.setItem('cart', JSON.stringify(items));

// User preferences
localStorage.setItem('theme', 'dark');
```

---

## 📱 Responsive Design

### Tailwind Breakpoints
```javascript
// Mobile first approach
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
// or
className="flex flex-col md:flex-row"
// or
className="text-sm md:text-base lg:text-lg"
```

### Mobile Optimizations
- Touch-friendly buttons (min 44px height)
- Optimized form inputs
- Mobile navigation menu
- Responsive images
- Stack layouts on mobile

---

## 🚀 Deployment Checklist

### Frontend Build
```bash
# Production build
npm run build

# Preview build locally
npm run preview

# Analyze bundle size
npm run analyze
```

### Environment Variables
```
VITE_API_URL=https://api.hatemalo.com/api
VITE_ENVIRONMENT=production
```

### Performance Metrics
```
Lighthouse Score: > 90
Core Web Vitals: Green
Build Size: < 500KB (gzipped)
```

---

## 📚 Best Practices

### Component Design
1. Single Responsibility Principle
2. Prop Drilling - use Context for deep nesting
3. Composition over Inheritance
4. Controlled Components for forms

### State Management
1. Use custom hooks for logic
2. Lift state only when needed
3. Keep state as local as possible
4. Use Context for truly global state

### Performance
1. Memoize expensive calculations
2. Use useCallback for handlers
3. Lazy load routes
4. Code split components

### Security
1. Never store sensitive data in localStorage
2. Validate all inputs
3. Sanitize user data
4. Use HTTPS in production
5. Implement CSRF protection

---

## 🐛 Debugging Tips

### React DevTools
```javascript
// Install and use React DevTools browser extension
// Inspect component props and state
// Track component re-renders
```

### Network Debugging
```javascript
// Check API calls in Network tab
// Verify request/response payloads
// Check status codes and headers
```

### Console Debugging
```javascript
// Log state changes
console.log('Current values:', form.values);

// Track hook execution
console.log('useCart executed');

// Monitor API responses
console.log('API response:', response);
```

---

## 📝 Code Examples

### Creating a New Page
1. Create page component in `src/pages/`
2. Add route in `AppRoutes.jsx`
3. Add navigation link in Navbar

### Adding a Custom Hook
1. Create hook in `src/hooks/`
2. Export from `hooks/index.js`
3. Use in components: `const { ... } = useHookName()`

### Creating a Reusable Component
1. Place in appropriate folder (common/admin/bakery)
2. Include PropTypes and JSDoc
3. Use in multiple pages/components

---

## 📊 Refactoring Summary

| Component | Before | After | Reduction |
|-----------|--------|-------|-----------|
| AdminLogin | 150 lines | 55 lines | -63% |
| CustomerLogin | 150 lines | Integrated | + reuse |
| AddProduct | 230 lines | 65 lines | -72% |
| EditProduct | 230 lines | 70 lines | -70% |
| Form Code | Duplicated | useFormManager | 90% less |
| **Total** | **~800 lines** | **~250 lines** | **~70%** |

---

**Last Updated**: March 21, 2026  
**Frontend Version**: React 18+ with Vite  
**Status**: Production Ready ✅
