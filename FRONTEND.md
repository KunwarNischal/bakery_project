# Frontend Documentation - Hatemalo Bakery Project

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Key Features](#key-features)
5. [Components Guide](#components-guide)
6. [Pages Documentation](#pages-documentation)
7. [State Management](#state-management)
8. [Custom Hooks](#custom-hooks)
9. [API Integration](#api-integration)
10. [Styling & Design](#styling--design)
11. [Authentication Flow](#authentication-flow)
12. [Installation & Setup](#installation--setup)

---

## Project Overview

**Hatemalo Bakery** is a full-stack e-commerce web application for an online bakery. The frontend is built with React and provides a user interface for:
- **Customers**: Browse products, add to cart, place orders, view order history
- **Admin**: Manage products, categories, and orders

### Key Characteristics
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Cart updates in real-time with localStorage persistence
- **Authentication**: Separate login systems for customers and admins
- **Modern UI**: Toast notifications, modals, drawers for better UX
- **Search & Filter**: Advanced product filtering by category, price, and search term

---

## Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18+ | Frontend UI library |
| **React Router** | 6+ | Client-side routing |
| **Axios** | Latest | HTTP client for API calls |
| **React Hot Toast** | Latest | Toast notifications |
| **Lucide React** | Latest | Icon library |
| **Tailwind CSS** | Latest | Utility-first CSS framework |
| **JavaScript (ES6+)** | Latest | Core language |

### Development Tools
- **Vite** - Fast build tool and dev server
- **npm/yarn** - Package manager
- **Git** - Version control

---

## Project Structure

```
client/
├── public/                          # Static assets
│   ├── index.html                   # Main HTML file
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── data.js                  # Initial product & category data
│   │   ├── bakery/                  # Product images
│   │   │   ├── Banana-Bread-Small.jpg
│   │   │   ├── black_forest_cake.jpg
│   │   │   ├── chocolate_cake.jpg
│   │   │   ├── croissant.jpg
│   │   │   └── ... (100+ product images)
│   │
│   ├── components/
│   │   ├── client/                  # Customer-facing components
│   │   │   ├── Hero.jsx             # Landing page hero section
│   │   │   ├── ProductCard.jsx      # Individual product display card
│   │   │   ├── FeaturedProducts.jsx # Featured products grid
│   │   │   ├── CategoryQuickLinks.jsx # Category navigation buttons
│   │   │   └── Testimonials.jsx     # Customer reviews section
│   │   │
│   │   ├── common/                  # Shared components
│   │   │   ├── Navbar.jsx           # Navigation header
│   │   │   ├── Footer.jsx           # Footer section
│   │   │   ├── CartDrawer.jsx       # Shopping cart sidebar
│   │   │   └── DeleteModal.jsx      # Confirmation dialog
│   │   │
│   │   └── admin/                   # Admin panel components
│   │       ├── AdminLayout.jsx      # Admin dashboard wrapper
│   │       ├── AdminSidebar.jsx     # Admin navigation menu
│   │       └── CategoryModal.jsx    # Add/edit category modal
│   │
│   ├── context/
│   │   └── CartContext.jsx          # Global cart state management
│   │
│   ├── hooks/
│   │   ├── useCart.js               # Access cart context
│   │   └── useFetch.js              # API data fetching
│   │
│   ├── pages/
│   │   ├── client/                  # Customer pages
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Menu.jsx             # Product listing page
│   │   │   ├── ProductDetails.jsx   # Individual product page
│   │   │   ├── Contact.jsx          # Contact page with maps
│   │   │   ├── Story.jsx            # About us page
│   │   │   ├── Checkout.jsx         # Order placement
│   │   │   ├── MyOrders.jsx         # Order history
│   │   │   ├── CustomerLogin.jsx    # Customer login
│   │   │   └── CustomerRegister.jsx # Customer registration
│   │   │
│   │   └── admin/                   # Admin pages
│   │       ├── AdminLogin.jsx       # Admin login
│   │       ├── Dashboard.jsx        # Admin overview
│   │       ├── ProductsManagement.jsx # Manage products
│   │       ├── AddProduct.jsx       # Create new product
│   │       ├── EditProduct.jsx      # Edit product
│   │       ├── OrdersManagement.jsx # Manage orders
│   │       └── CategoriesManagement.jsx # Manage categories
│   │
│   ├── services/
│   │   └── api.js                   # Axios configuration & API endpoints
│   │
│   ├── styles/
│   │   ├── index.css                # Global styles
│   │   └── App.css                  # App-level styles (animations)
│   │
│   ├── App.jsx                      # Root app component
│   ├── routes.jsx                   # Route definitions
│   ├── main.jsx                     # React entry point
│   └── index.html                   # HTML template
│
├── .env.example                     # Environment variables template
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
└── tailwind.config.js               # Tailwind CSS configuration
```

---

## Key Features

### 1. **Customer Features**
- ✅ Browse products with search and filtering
- ✅ Filter by category and price range (₨0-3000)
- ✅ View detailed product information
- ✅ Add products to shopping cart with quantity
- ✅ Real-time cart updates and persistence
- ✅ View cart summary with subtotal and delivery fees
- ✅ Checkout with delivery method selection (free/paid delivery)
- ✅ User registration and login
- ✅ View order history with status tracking
- ✅ Order search and status filtering
- ✅ Toast notifications for user feedback
- ✅ Responsive mobile-friendly design

### 2. **Admin Features**
- ✅ Secure admin login (separate from customer)
- ✅ Dashboard with overview statistics
- ✅ Manage products (add/edit/delete)
- ✅ Manage categories (add/edit/delete)
- ✅ Manage orders (view/update status)
- ✅ Product image upload capability
- ✅ Bulk action capability
- ✅ Real-time data updates with refetch

### 3. **Technical Features**
- ✅ Persistent shopping cart (localStorage)
- ✅ Authentication token management
- ✅ Error handling and validation
- ✅ Loading states
- ✅ Auto-dismissing toast notifications
- ✅ Search and filter functionality
- ✅ Pagination support
- ✅ Responsive grid layouts

---

## Components Guide

### Client Components

#### **Hero.jsx**
- **Purpose**: Landing page hero section
- **Features**:
  - Large hero banner with Call-to-Action (CTA) buttons
  - "Explore Menu" button for browsing products
  - "Our Story" button for about page
  - Responsive design for mobile/tablet/desktop

#### **ProductCard.jsx**
- **Purpose**: Display individual product in grid
- **Features**:
  - Product image, name, price display
  - Quick "Add to Cart" button
  - Hover effects and animations
  - Toast notification on add to cart
  - Placeholder for missing images

#### **FeaturedProducts.jsx**
- **Purpose**: Showcase featured products
- **Features**:
  - Displays 6 featured products in grid
  - Uses ProductCard component
  - Responsive column layout (1-3 columns)
  - Scrollable on mobile

#### **CategoryQuickLinks.jsx**
- **Purpose**: Quick navigation by category
- **Features**:
  - Clickable category pills/buttons
  - Filters products by category
  - Shows category count
  - Responsive horizontal scroll on mobile

#### **Testimonials.jsx**
- **Purpose**: Display customer reviews
- **Features**:
  - Customer review cards
  - Star ratings
  - Responsive layout
  - Multiple testimonials carousel

### Common Components

#### **Navbar.jsx**
- **Purpose**: Top navigation bar
- **Features**:
  - Logo/brand name
  - Search functionality (if available)
  - Cart icon with item count
  - User profile menu (login/logout/orders)
  - Sticky at top with scroll handling
  - Mobile responsive hamburger menu
  - Event listeners: Escape key, outside clicks, scroll lock

#### **Footer.jsx**
- **Purpose**: Bottom page footer
- **Features**:
  - Bakery information
  - Quick links
  - Contact information
  - Social media links
  - Copyright notice

#### **CartDrawer.jsx**
- **Purpose**: Shopping cart sidebar
- **Features**:
  - Displays all cart items with images
  - Quantity adjustment (increment/decrement)
  - Remove item button
  - Subtotal calculation
  - Delivery fee display
  - Total amount display
  - Proceed to checkout button
  - Empty cart message
  - Scrollable items area

#### **DeleteModal.jsx**
- **Purpose**: Confirmation dialog (admin)
- **Features**:
  - Reusable modal for confirmations
  - Custom title and message
  - Confirm/Cancel buttons
  - Overlay backdrop

### Admin Components

#### **AdminLayout.jsx**
- **Purpose**: Admin dashboard wrapper
- **Features**:
  - Contains admin sidebar and main content area
  - Fetches products, orders, categories data
  - Provides data to child components
  - Header with admin info
  - Main content area for routes
  - Refetch functions for data updates

#### **AdminSidebar.jsx**
- **Purpose**: Admin navigation menu
- **Features**:
  - Navigation links to admin pages
  - Dashboard link
  - Products management
  - Categories management
  - Orders management
  - Logout functionality
  - Active route styling

#### **CategoryModal.jsx**
- **Purpose**: Add/edit category modal
- **Features**:
  - Category name input
  - Category image upload
  - Form validation
  - Submit/Cancel buttons
  - Edit mode for existing categories

---

## Pages Documentation

### Customer Pages

#### **Home.jsx** (Landing Page)
- **Route**: `/`
- **Features**:
  - Hero section with CTAs
  - Featured products carousel
  - Category quick links
  - Customer testimonials
  - Call-to-action sections
- **Data**: Uses initial data, fetches from API

#### **Menu.jsx** (Product Listing)
- **Route**: `/menu`
- **Features**:
  - Product grid with filtering
  - Search by product name
  - Filter by category (dropdown)
  - Price range filter (₨0-3000 slider)
  - Pagination with "Show More"
  - Product count display
  - No results message
- **State Management**:
  - `searchTerm` - Search input
  - `selectedCategory` - Category filter
  - `priceRange` - Price filter
  - `showAllProducts` - Pagination toggle

#### **ProductDetails.jsx** (Product Page)
- **Route**: `/product/:id`
- **Features**:
  - Full product image and details
  - Product description
  - Price display
  - Add quantity selector
  - Add to cart button
  - Related products (computed with useMemo)
  - Breadcrumb navigation
  - Comments section (if available)
- **Related Products**: Calculated based on same category, excluding current product

#### **Checkout.jsx** (Order Placement)
- **Route**: `/checkout`
- **Features**:
  - Order summary (items, prices)
  - Delivery address form
  - Customer details form
  - Delivery method selection (free/paid)
  - Delivery fee calculation (free over ₨5000, ₨50 otherwise)
  - Order total display
  - Place order button
  - Confirmation message on success
  - Error handling
- **Delivery Fee Logic**:
  - Free delivery over ₨5000
  - ₨50 delivery fee otherwise
- **Form Fields**:
  - Name, Email, Phone
  - Address, City, Zip Code, Country

#### **MyOrders.jsx** (Order History)
- **Route**: `/myorders` (Protected)
- **Features**:
  - List all customer orders
  - Search by order ID
  - Filter by order status
  - Sort by date (newest first)
  - Show first 2 orders, "Show More" button
  - Order details in expanded view
  - Order items display (first 2 items with "+X more" indicator)
  - Status indicators with icons
  - Subtotal and delivery fee breakdown
  - Total amount display
- **Order Status Icons**:
  - Pending: Clock icon
  - Preparing: Package icon
  - Shipped: Truck icon
  - Delivered: CheckCircle icon
  - Cancelled: ShoppingBag icon
- **Protection**: Redirects to login if not authenticated

#### **Contact.jsx** (Contact Page)
- **Route**: `/contact`
- **Features**:
  - Bakery location address
  - Phone number
  - Embedded Google Maps
  - Responsive layout
- **Content**:
  - Location: Hatemalo Bakery Road, Chure, Dhanusha, Nepal
  - Phone: +977 9812198432

#### **Story.jsx** (About Page)
- **Route**: `/story`
- **Features**:
  - Bakery history and mission
  - About section
  - Bakery statistics
  - Team information (if available)
  - Responsive layout

#### **CustomerLogin.jsx** (Customer Login)
- **Route**: `/login`
- **Features**:
  - Email/password login form
  - Form validation
  - Show/hide password toggle
  - Link to registration
  - Error handling
  - Loading state
  - Stores authentication token in localStorage
  - Redirects to home on success

#### **CustomerRegister.jsx** (Customer Registration)
- **Route**: `/register`
- **Features**:
  - Name, email, password fields
  - Password confirmation
  - Form validation
  - Email validation
  - Password strength indication (optional)
  - Link to login
  - Error handling
  - Loading state
  - Auto-login after registration

### Admin Pages

#### **AdminLogin.jsx** (Admin Login)
- **Route**: `/admin/login`
- **Features**:
  - Separate admin authentication
  - Email/password form
  - Validates `isAdmin` flag from backend
  - Stores admin token
  - Redirects to admin dashboard
  - Error messages

#### **Dashboard.jsx** (Admin Overview)
- **Route**: `/admin/dashboard`
- **Features**:
  - Overview statistics
  - Total products count
  - Total orders count
  - Total categories count
  - Recent orders list
  - Quick action buttons
  - Charts/graphs (if available)
- **Protection**: Admin-only, redirects if not authenticated

#### **ProductsManagement.jsx** (Products Admin)
- **Route**: `/admin/products`
- **Features**:
  - List all products in table
  - Search by product name
  - Filter by category
  - Product ID, name, category, price, stock
  - Edit button for each product
  - Delete button with confirmation
  - Add new product button
  - Pagination
  - Bulk actions (optional)

#### **AddProduct.jsx** (Create Product)
- **Route**: `/admin/add-product`
- **Features**:
  - Form for new product
  - Name, description fields
  - Category selection (dropdown from API)
  - Price input
  - Stock/quantity input
  - Image upload
  - Rating/review fields (optional)
  - Submit and cancel buttons
  - Form validation
  - Success message on creation
  - Redirect to products list

#### **EditProduct.jsx** (Edit Product)
- **Route**: `/admin/edit-product/:id`
- **Features**:
  - Pre-filled form with product data
  - Same fields as AddProduct
  - Update button instead of create
  - Delete button
  - Cancel button
  - Form validation
  - Loading state while fetching product
  - Error handling

#### **OrdersManagement.jsx** (Orders Admin)
- **Route**: `/admin/orders`
- **Features**:
  - List all orders
  - Order ID, customer name, amount, status
  - Status dropdown to update status
  - View order details button
  - Order date display
  - Filter by status
  - Search by order ID
  - Real-time status updates
  - Delivery information

#### **CategoriesManagement.jsx** (Categories Admin)
- **Route**: `/admin/categories`
- **Features**:
  - List all categories
  - Category name, image
  - Edit button
  - Delete button with confirmation
  - Add new category button
  - Modal for add/edit
  - Confirmation on delete
  - Success messages

---

## State Management

### Global State (Context API)

#### **CartContext.jsx**
- **Purpose**: Manage shopping cart globally
- **State Variables**:
  ```javascript
  const [cart, setCart] = useState([])      // Array of cart items
  const [toasts, setToasts] = useState([])  // Active notifications
  ```
- **Cart Item Structure**:
  ```javascript
  {
    _id: "product_id",
    name: "Product Name",
    price: 250,
    quantity: 2,
    image: "image_url"
  }
  ```
- **Functions Provided**:
  - `addToCart(product, qty)` - Add product to cart
  - `removeFromCart(id)` - Remove product from cart
  - `updateCartQty(id, delta)` - Update quantity (+/- delta)
  - `clearCart()` - Empty entire cart
  - `subtotal` - Calculated total (price × quantity)
  - `addToast(message, type)` - Show notification
  - `toasts` - Array of active notifications
- **Persistence**:
  - Cart saved to localStorage
  - Loaded from localStorage on app start
  - Auto-updated when cart changes
- **Toast Auto-Dismiss**:
  - Toast disappears after 3 seconds
  - Toast ID for tracking

### Local State (Component Level)

#### Common Patterns
```javascript
// Search/Filter state
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState('all')
const [selectedStatus, setSelectedStatus] = useState('all')

// Form state
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: ''
})
const [errors, setErrors] = useState({})
const [touched, setTouched] = useState({})

// UI state
const [isCartOpen, setIsCartOpen] = useState(false)
const [showAllOrders, setShowAllOrders] = useState(false)
const [loading, setLoading] = useState(false)
```

---

## Custom Hooks

### **useCart.js**
- **Purpose**: Easy access to CartContext
- **Usage**:
  ```javascript
  const { cart, addToCart, removeFromCart, updateCartQty,
          clearCart, subtotal, addToast, toasts } = useCart();
  ```
- **Returns**: Entire CartContext value
- **Used In**: 6 components (ProductCard, CartDrawer, Navbar, Checkout, ProductDetails, App)

### **useFetch.js**
- **Purpose**: Simplify API data fetching
- **Parameters**:
  - `url` (string): API endpoint (e.g., '/products', '/orders')
- **Returns**:
  ```javascript
  {
    data: null,                    // Fetched data
    loading: true,                 // Loading state
    error: null,                   // Error message
    refetch: () => {},            // Manual refetch function
    setData: (newData) => {}      // Manual data update
  }
  ```
- **Features**:
  - Auto-fetches when URL changes
  - Handles loading and error states
  - Provides refetch capability
  - Provides setData for manual updates
  - Axios-based API calls
- **Used In**: 5 components (App, AdminLayout, AddProduct, EditProduct, MyOrders)

---

## API Integration

### **API Configuration (services/api.js)**

#### Base Setup
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### Request Interceptor
- Attaches authentication token to requests
- Token retrieved from localStorage
- Applied to all API requests

#### Response Interceptor
- Handles error responses
- Logs errors
- Token validation

### API Endpoints Used

#### Products
- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

#### Categories
- `GET /categories` - Fetch all categories
- `POST /categories` - Create category (admin)
- `PUT /categories/:id` - Update category (admin)
- `DELETE /categories/:id` - Delete category (admin)

#### Orders
- `GET /orders` - Fetch all orders (admin)
- `GET /orders/myorders` - Fetch customer's orders
- `POST /orders` - Create/place new order
- `PUT /orders/:id` - Update order status (admin)

#### Authentication
- `POST /auth/register` - Customer registration
- `POST /auth/login` - Customer login
- `POST /auth/login` - Admin login
- Customer token format: `Bearer {token}`

### Helper Functions in api.js

```javascript
// Get customer info from localStorage
const getCustomerInfo = () => {
  const data = localStorage.getItem('customerInfo');
  return data ? JSON.parse(data) : null;
};

// Get image URL (handles missing images)
const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  if (imagePath.startsWith('http')) return imagePath;
  return `${baseURL}/uploads/${imagePath}`;
};

// Verify customer token validity
const verifyCustomer = async (token) => {
  // Validates token with backend
};

// Constants
const PLACEHOLDER_IMAGE = '/placeholder.png';
```

---

## Styling & Design

### Tailwind CSS Configuration
- **Colors**:
  - Primary: Dark brown (#3d2b1f)
  - Secondary: Light brown/cream
  - Background: Light cream/white
- **Typography**:
  - Font family: Custom bakery-themed fonts
  - Heading size: Responsive (2xl-5xl)
  - Body text: 14-16px
- **Spacing**: 4px grid system
- **Responsive Breakpoints**: sm, md, lg, xl, 2xl

### Global Styles (styles/index.css)
- CSS Variables for colors
- Default font family setup
- Global animations
- Utility classes

### Animations (App.jsx)
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

---

## Authentication Flow

### Customer Authentication

1. **Registration Flow**:
   ```
   User fills registration form
   ↓
   Form validation
   ↓
   POST /auth/register
   ↓
   Backend creates user & returns token
   ↓
   Save token & user info to localStorage
   ↓
   Auto-login & redirect to home
   ```

2. **Login Flow**:
   ```
   User enters email & password
   ↓
   POST /auth/login
   ↓
   Backend validates & returns token
   ↓
   Save to localStorage
   ↓
   Redirect to home or previous page
   ```

3. **Logout Flow**:
   ```
   User clicks logout
   ↓
   Clear localStorage
   ↓
   Redirect to home
   ↓
   Cart cleared (optional)
   ```

4. **Session Persistence**:
   ```
   App loads
   ↓
   Check localStorage for token
   ↓
   Verify token with backend
   ↓
   Load user profile if valid
   ↓
   Redirect to login if expired
   ```

### Admin Authentication

1. Similar flow to customer
2. Validates `isAdmin` flag from backend
3. Stores admin token separately
4. Has separate login route `/admin/login`
5. Dashboard accessible only with admin token

### Protected Routes
- `/myorders` - Requires customer login
- `/checkout` - Requires customer login
- `/admin/*` - Requires admin login
- Other routes - Public access

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/hatemalo-bakery.git
cd hatemalo-bakery
```

### Step 2: Install Dependencies
```bash
cd client
npm install
```

### Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add:
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 5: Build for Production
```bash
npm run build
```

Output files in `dist/` folder

### Step 6: Preview Production Build
```bash
npm run preview
```

---

## Development Guidelines

### File Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard.jsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useFetch.js`)
- **Utilities**: camelCase (e.g., `formatPrice.js`)
- **Styles**: camelCase (e.g., `global.css`)

### Component Structure
```javascript
/**
 * Component description
 *
 * Features/purpose
 */

import React, { useState, useEffect } from 'react';
// Import dependencies

// Component definition
const ComponentName = (props) => {
  // State management
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // Setup logic
  }, [dependencies]);

  // Event handlers
  const handleClick = () => {};

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Best Practices
1. ✅ Always destructure props
2. ✅ Keep components focused and single-responsibility
3. ✅ Use custom hooks to share logic
4. ✅ Add proper error boundaries
5. ✅ Use loading states for async operations
6. ✅ Validate user input
7. ✅ Add accessibility attributes (aria-labels, alt text)
8. ✅ Optimize re-renders with useMemo/useCallback
9. ✅ Handle edge cases (empty states, errors)
10. ✅ Use environment variables for configuration

---

## Performance Optimization

### Current Optimizations
1. **Lazy Loading Routes**: Routes loaded with React.lazy and Suspense
2. **useMemo**: Used in ProductDetails for related products calculation
3. **LocalStorage Caching**: Cart persists without re-fetching
4. **Image Optimization**: Fallback images for missing product images
5. **Debounced Search**: Search doesn't fire on every keystroke

### Future Optimization Opportunities
1. Image lazy loading (Intersection Observer)
2. Code splitting for large components
3. API response caching
4. Pagination for long lists
5. Virtual scrolling for large product lists

---

## Troubleshooting

### Common Issues

**Issue**: Cart items not persisting
- **Solution**: Check localStorage is enabled, verify CartContext is wrapping app

**Issue**: Images not loading
- **Solution**: Check image path in data.js, verify image files in public folder

**Issue**: API calls failing
- **Solution**: Verify backend is running, check API_URL in .env, check CORS settings

**Issue**: Authentication not working
- **Solution**: Check token is saved in localStorage, verify backend token validation

---

## Future Enhancements

- [ ] Payment gateway integration (Stripe, Khalti)
- [ ] Email notifications for orders
- [ ] Order tracking with real-time updates
- [ ] Product reviews and ratings
- [ ] Wishlisting
- [ ] Referral system
- [ ] Loyalty points
- [ ] Multiple language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Image optimization and compression
- [ ] Advanced analytics
