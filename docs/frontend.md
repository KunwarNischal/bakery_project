# Hatemalo Bakery — Frontend (React.js) Technical Documentation
### For TU Internship Report | Comprehensive Frontend Analysis

---

## ═══ SECTION 1: PROJECT OVERVIEW ═══

### 1. Full Project Name
**Hatemalo Bakery** — Full-Stack MERN E-Commerce Bakery Website

### 2. Core Purpose
An online bakery e-commerce platform that allows customers to browse, select, and order bakery products online with delivery options across Nepal, while providing administrators with a complete management dashboard to handle products, categories, and orders.

### 3. Target Users
| User Type | Description |
|-----------|-------------|
| **Guest** | Unauthenticated visitor — can browse home page, menu, product details, story, and contact pages |
| **Customer (Client)** | Registered & logged-in user — can add items to cart, place orders, view order history, manage profile |
| **Admin** | Bakery administrator — can manage products (CRUD), categories (CRUD), orders (status updates, delete), view business analytics dashboard |

### 4. Problem Solved
Hatemalo Bakery addresses the challenge faced by traditional bakeries in Nepal that rely solely on walk-in customers. The website:
- **Digitizes the product catalog** — 70+ bakery items across 10 categories with images, prices, and descriptions
- **Enables online ordering** — customers can order from anywhere in Nepal with delivery (₨300 flat rate, free over ₨5000)
- **Streamlines order management** — admin dashboard tracks order status pipeline (Pending → Preparing → Processing → Shipped → Delivered)
- **Provides business analytics** — real-time insights into inventory health, total revenue, active orders, and category breakdown

### 5. Major Frontend Modules/Features
1. **Home/Landing Page** — Hero banner, category quick links, featured products, testimonials
2. **Product Menu** — Filterable product grid with search, category filter, price range slider
3. **Product Details** — Individual product view with description, ingredients, add-to-cart, share, related products
4. **Shopping Cart** — Slide-in drawer with quantity controls, subtotal, checkout button
5. **Checkout** — Billing form, delivery method selection, order summary, order placement
6. **Customer Authentication** — Login, Registration with form validation
7. **My Orders** — Order history with search, status filter, pagination
8. **Admin Authentication** — Separate admin login portal
9. **Admin Dashboard** — Business analytics with metrics cards, inventory health, order flow, menu breakdown
10. **Admin Products Management** — CRUD products with image upload, search, stock filter, pagination
11. **Admin Orders Management** — View/search orders, update status via dropdown, delete orders, expandable details
12. **Admin Categories Management** — CRUD categories with modal forms, product count per category
13. **Our Story** — About page with bakery history, mission, key statistics
14. **Contact** — Location info with embedded Google Maps

---

## ═══ SECTION 2: FRONTEND TECHNOLOGY STACK ═══

### 1. React.js Version
**React 19.2.4** (latest major version) with React DOM 19.2.4

### 2. All npm Packages/Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.4 | Core UI library for building component-based interfaces |
| `react-dom` | ^19.2.4 | DOM rendering for React components |
| `react-router-dom` | ^7.13.1 | Client-side routing and navigation (SPA) |
| `axios` | ^1.13.6 | HTTP client for REST API communication with backend |
| `react-hot-toast` | ^2.6.0 | Toast notification system for success/error feedback |
| `lucide-react` | ^0.577.0 | Modern SVG icon library (Menu, X, LogOut, UserCircle, Package, Search, etc.) |
| `prop-types` | ^15.8.1 | Runtime type-checking for React component props |
| `tailwindcss` | ^4.2.2 | Utility-first CSS framework for styling |
| `@tailwindcss/vite` | ^4.2.2 | Tailwind CSS integration plugin for Vite |
| `vite` | ^8.0.1 | Next-generation frontend build tool and dev server |
| `@vitejs/plugin-react` | ^6.0.1 | React integration for Vite (JSX, Fast Refresh) |
| `postcss` | ^8.5.8 | CSS transformation tool (used by Tailwind) |
| `autoprefixer` | ^10.4.27 | Adds vendor prefixes to CSS for cross-browser compatibility |
| `eslint` | ^9.39.4 | JavaScript linter for code quality |
| `@eslint/js` | ^9.39.4 | ESLint JavaScript configuration |
| `eslint-plugin-react-hooks` | ^7.0.1 | Enforces React Hooks rules |
| `eslint-plugin-react-refresh` | ^0.5.2 | Validates React Refresh compatibility |
| `globals` | ^17.4.0 | Global variable definitions for ESLint |
| `@types/react` | ^19.2.14 | TypeScript type definitions for React |
| `@types/react-dom` | ^19.2.3 | TypeScript type definitions for React DOM |

### 3. CSS Framework / Styling Approach
- **Tailwind CSS v4.2.2** — Utility-first CSS framework via the `@tailwindcss/vite` plugin
- **Custom theme tokens** defined in `src/styles/index.css` using Tailwind's `@theme` directive:
  ```css
  @theme {
    --color-primary: #1A1A1A;
    --color-secondary: #A0816C;
    --color-accent: #F2E9D4;
    --color-background: #F9F7F2;
    --color-cream: #fcf9f2;
    --color-light-brown: #d4a373;
    --color-pastel-pink: #ffb5a7;
    --color-dark-brown: #4a3b32;
    --font-display: "Playfair Display", serif;
    --font-body: Lato, sans-serif;
  }
  ```
- **Google Fonts**: Playfair Display (headings) and Lato (body text), loaded via `index.html`
- **Component-level utility classes** via `@layer components` for reusable `.btn-primary` and `.btn-secondary`
- **Inline CSS** for keyframe animations (fade-in-up, slide-in-right, float) in `App.jsx`

### 4. State Management Solution
- **React Context API** — Used via `CartContext.jsx` for global shopping cart state
- **React `useState` hook** — Used extensively for local component state (forms, filters, modals, UI toggles)
- **React `useEffect` hook** — Used for data fetching, localStorage sync, auth verification, side effects
- **No Redux/Zustand** — The project uses Context API + hooks pattern for simplicity

### 5. Routing — All Routes Defined

Routing is handled by **react-router-dom v7.13.1** with `BrowserRouter`. All routes use **lazy loading** via `React.lazy()` and `Suspense` for code-splitting.

| Route Path | Component | Access Level | Description |
|-----------|-----------|-------------|-------------|
| `/` | `Home` | Public | Landing page |
| `/menu` | `Menu` | Public | Product listing with filters |
| `/product/:id` | `ProductDetails` | Public | Individual product page |
| `/contact` | `Contact` | Public | Contact information & map |
| `/story` | `Story` | Public | About Us / bakery story |
| `/login` | `CustomerLogin` | Public | Customer login form |
| `/register` | `CustomerRegister` | Public | Customer registration form |
| `/checkout` | `Checkout` | Customer | Order checkout page (protected via runtime check) |
| `/my-orders` | `MyOrders` | Customer | Customer order history (protected via runtime check) |
| `/admin` | `AdminLogin` | Public | Admin login portal |
| `/admin/dashboard` | `Dashboard` | Admin | Business analytics (nested in `AdminLayout`) |
| `/admin/products` | `ProductsManagement` | Admin | Product list management (nested in `AdminLayout`) |
| `/admin/products/add` | `AddProduct` | Admin | Add new product form (nested in `AdminLayout`) |
| `/admin/products/edit/:id` | `EditProduct` | Admin | Edit existing product (nested in `AdminLayout`) |
| `/admin/orders` | `OrdersManagement` | Admin | Order management table (nested in `AdminLayout`) |
| `/admin/categories` | `CategoriesManagement` | Admin | Category management (nested in `AdminLayout`) |

### 6. Frontend–Backend Communication
- **Axios** is used as the HTTP client via a configured instance in `src/services/api.js`
- **Base URL**: `http://localhost:5000/api` (configured as `API_BASE_URL + API_ENDPOINT`)
- **Request Interceptor**: Automatically attaches JWT Bearer token to every request based on route type:
  - Admin routes (`/admin`, `/products`, `/categories`, `/orders`) → uses `userInfo` from localStorage
  - Customer routes → uses `customerInfo` from localStorage
- **Content-Type**: Defaults to `application/json`; switches to `multipart/form-data` for image uploads

### 7. Authentication on the Frontend
- **JWT Token Storage**: Stored in `localStorage` under two keys:
  - `customerInfo` — Customer data `{ name, email, token, isAdmin: false }`
  - `userInfo` — Admin data `{ _id, name, email, isAdmin: true, token }`
- **Token Verification**: On page load (Navbar mount), `verifyCustomer()` sends stored token to `/auth/verify` endpoint to check validity; if expired, user is logged out automatically
- **Protected Routes**: Implemented via **runtime checks** in individual page components (`Checkout`, `MyOrders`) — if no customer info in localStorage, `useEffect` redirects to `/login`
- **Admin Protection**: `AdminLayout` checks for `userInfo` in localStorage on mount; if absent, redirects to `/admin` login
- **Cross-tab Auth Sync**: Uses `window.addEventListener('authchange', ...)` custom event + `storage` event to sync auth state across components and browser tabs

---

## ═══ SECTION 3: FOLDER STRUCTURE & ARCHITECTURE ═══

### 1. Complete Frontend Folder Structure

```
client/
├── public/
│   ├── logo.png                    # Bakery logo
│   ├── hatemalo-banner.jpg         # Hero banner image
│   └── categories-cover.png        # Admin categories cover image
├── src/
│   ├── App.jsx                     # Root component - Router, CartProvider, Layout
│   ├── main.jsx                    # Entry point - ReactDOM render with StrictMode
│   ├── routes.jsx                  # All route definitions with lazy loading
│   ├── assets/
│   │   └── data.js                 # Static data: CATEGORIES, INITIAL_PRODUCTS, formatPrice, ORDER_STATUSES, getStatusColor, CATEGORY_ICONS
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx     # Admin page wrapper - data fetching, state, modals, sidebar
│   │   │   ├── AdminSidebar.jsx    # Admin navigation sidebar (responsive)
│   │   │   └── CategoryModal.jsx   # Add/Edit category modal form
│   │   ├── client/
│   │   │   ├── Hero.jsx            # Landing page hero banner
│   │   │   ├── ProductCard.jsx     # Reusable product display card
│   │   │   ├── FeaturedProducts.jsx# Featured products grid section
│   │   │   ├── CategoryQuickLinks.jsx # Category navigation buttons
│   │   │   └── Testimonials.jsx    # Customer reviews section
│   │   └── common/
│   │       ├── Navbar.jsx          # Main navigation bar (auth-aware, responsive)
│   │       ├── Footer.jsx          # Site footer with branding
│   │       ├── CartDrawer.jsx      # Slide-in shopping cart panel
│   │       └── DeleteModal.jsx     # Reusable delete confirmation dialog
│   ├── context/
│   │   └── CartContext.jsx         # Cart global state (Context API + localStorage)
│   ├── hooks/
│   │   ├── useCart.js              # Custom hook to access CartContext
│   │   └── useFetch.js            # Custom hook for API data fetching with loading/error states
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx      # Admin login page
│   │   │   ├── Dashboard.jsx       # Admin analytics dashboard
│   │   │   ├── ProductsManagement.jsx # Product list with CRUD
│   │   │   ├── AddProduct.jsx      # Add new product form
│   │   │   ├── EditProduct.jsx     # Edit existing product form
│   │   │   ├── OrdersManagement.jsx# Orders table with status management
│   │   │   └── CategoriesManagement.jsx # Categories table with CRUD
│   │   └── client/
│   │       ├── Home.jsx            # Landing page composition
│   │       ├── Menu.jsx            # Product listing with filters
│   │       ├── ProductDetails.jsx  # Single product detail view
│   │       ├── Checkout.jsx        # Order checkout with billing form
│   │       ├── MyOrders.jsx        # Customer order history
│   │       ├── CustomerLogin.jsx   # Customer login form
│   │       ├── CustomerRegister.jsx# Customer registration form
│   │       ├── Contact.jsx         # Contact info with Google Maps
│   │       └── Story.jsx           # About Us / bakery story page
│   ├── services/
│   │   └── api.js                  # Axios instance, auth helpers, API functions, image URL helpers
│   └── styles/
│       └── index.css               # Tailwind imports, custom theme tokens, component classes
├── index.html                      # HTML entry point with Google Fonts
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite + React + Tailwind plugin config
└── eslint.config.js                # ESLint configuration
```

### 2. Purpose of Each Major Folder

| Folder | Purpose |
|--------|---------|
| `src/components/common/` | Shared UI components used across the entire application (Navbar, Footer, CartDrawer, DeleteModal) |
| `src/components/client/` | Components specific to the customer-facing storefront (Hero, ProductCard, FeaturedProducts, CategoryQuickLinks, Testimonials) |
| `src/components/admin/` | Components specific to the admin dashboard (AdminLayout, AdminSidebar, CategoryModal) |
| `src/pages/client/` | Full page components for customer-facing routes (Home, Menu, ProductDetails, Checkout, MyOrders, Login, Register, Contact, Story) |
| `src/pages/admin/` | Full page components for admin routes (AdminLogin, Dashboard, ProductsManagement, AddProduct, EditProduct, OrdersManagement, CategoriesManagement) |
| `src/context/` | React Context providers for global state management (CartContext) |
| `src/hooks/` | Custom React hooks for reusable logic (useCart, useFetch) |
| `src/services/` | API communication layer — Axios instance, interceptors, endpoint functions, auth helpers |
| `src/assets/` | Static data files — fallback product data, category icons, order statuses, utility functions |
| `src/styles/` | Global CSS with Tailwind configuration, theme tokens, and reusable component classes |

### 3. Component Architecture Pattern
The project uses a **Page-Based Architecture** with **Domain-Based Component Organization**:
- **Pages** are route-level components (one per route) that serve as the "smart" containers
- **Components** are organized into three domains: `common/` (shared), `client/` (storefront), `admin/` (dashboard)
- Admin child pages receive data and functions via React Router's `useOutletContext()` from the parent `AdminLayout`

### 4. Reusable vs Page-Specific Components

**Reusable Components** (used in multiple places):
- `ProductCard` — used in `Menu.jsx` and `FeaturedProducts.jsx`
- `DeleteModal` — used in `AdminLayout.jsx` for product, category, and order deletion
- `Navbar`, `Footer`, `CartDrawer` — used globally via `Layout` in `App.jsx`

**Page-Specific Components** (used in one place):
- `Hero`, `CategoryQuickLinks`, `FeaturedProducts`, `Testimonials` — composed into `Home.jsx`
- `AdminSidebar`, `CategoryModal` — used exclusively in `AdminLayout.jsx`

---

## ═══ SECTION 4: FEATURE-BY-FEATURE FRONTEND BREAKDOWN ═══

### 1. Home / Landing Page
- **What the user sees**: Full-height hero banner with "The Art of Perfect Baking" heading, "Explore Menu" and "Our Story" CTA buttons, a bakery banner image, animated floating decorative elements, scroll indicator. Below: category quick-link buttons (10 categories with emoji icons), 6 featured products in a responsive grid, and customer testimonials with 5-star ratings.
- **Components**: `Home.jsx` → `Hero.jsx`, `CategoryQuickLinks.jsx`, `FeaturedProducts.jsx` (which uses `ProductCard.jsx`), `Testimonials.jsx`
- **API Endpoints**: Products and categories pre-fetched in `App.jsx` via `useFetch('/products')` and `useFetch('/categories')`, passed as props
- **Special UI/UX**: `animate-fade-in-up` page entrance animation, floating blur circles in hero, hover scale effects on banner image, bouncing scroll indicator

### 2. Product Listing Page (Menu)
- **What the user sees**: Page title "Our Menu", sticky sidebar with category filter buttons, search input, price range slider (₨0–₨3000), product count display, responsive product grid (1/2/3 columns). Empty state shows emoji and "No treats match your filters."
- **Components**: `Menu.jsx` → `ProductCard.jsx`
- **API Endpoints**: Products and categories passed as props from `App.jsx`
- **Special UI/UX**: Sticky sidebar on desktop; horizontal scrollable category buttons on mobile; real-time filtering by search text, category, and price range; active category highlighted with dark background

### 3. Product Detail Page
- **What the user sees**: Back button, large product image (or emoji fallback), product name, category badge, price, description (with fallback text), ingredients, shelf life, "Add to Cart" button, "Share" button (uses Web Share API or fallback alert), 4 related products at bottom
- **Components**: `ProductDetails.jsx` (standalone)
- **API Endpoints**: `GET /products/:id` via `getProductById()` in `api.js`; falls back to local `INITIAL_PRODUCTS` data if server fails
- **Special UI/UX**: `animate-fade-in-up` entrance, `animate-float` on emoji icon, hover scale on related product cards, smooth scroll to top on product change, `useMemo` for efficient related product calculation

### 4. Client Registration & Login Pages
- **Login** (`CustomerLogin.jsx`):
  - **Fields**: Email, Password (with show/hide toggle)
  - **Validation**: Email format regex, required fields; on-blur validation with `touched` tracking
  - **API**: `POST /auth/login` via `loginCustomer()`
  - **On Success**: Saves to `customerInfo` in localStorage, dispatches `authchange` event, shows "Welcome back!" toast, redirects to `/my-orders`
  - **Link**: "Don't have an account? → Create one now" → `/register`

- **Register** (`CustomerRegister.jsx`):
  - **Fields**: Full Name, Email, Password, Confirm Password (both with show/hide toggles)
  - **Validation**: Name ≥ 2 chars, email regex, password ≥ 6 chars, password match; cross-field validation (changing password re-validates confirm)
  - **API**: `POST /auth/register` via `registerCustomer()`
  - **On Success**: Saves to `customerInfo`, dispatches `authchange` event, shows "Account created!" toast, redirects to `/login`

### 5. Admin Login Page
- **What the user sees**: Bakery logo + "HateMalo Bakery" header, Lock icon, "Admin Portal" title, email/password form with show/hide toggle
- **Components**: `AdminLogin.jsx`
- **API Endpoint**: `POST /auth/login`
- **Special Logic**: After successful login, checks `data.isAdmin === true`. If true, stores in `userInfo` localStorage and redirects to `/admin/dashboard`. If false, shows "Not authorized as an admin" error.

### 6. Admin Dashboard
- **What the user sees**: "Business Analytics" heading, 3 metric cards (Total Products, Active Orders, Total Categories), Inventory Health panel (Low Stock, Out of Stock, Healthy Stock counts with "View" buttons), Order Flow panel (Total Orders, Total Revenue from delivered orders), Menu Breakdown (top 6 categories with product counts)
- **Components**: `Dashboard.jsx` (child of `AdminLayout`)
- **Data Source**: Received via `useOutletContext()` from `AdminLayout` — `products`, `orders`, `categories`
- **API Endpoints**: Data pre-fetched by `AdminLayout` via `useFetch('/products')`, `useFetch('/orders')`, `useFetch('/categories')`
- **Special UI/UX**: Color-coded metric cards with hover effects (icon background transitions), "View" buttons navigate to products page with stock filter pre-applied

### 7. Admin — Product Management (Add/Edit/Delete)
- **Products List** (`ProductsManagement.jsx`):
  - Table with columns: Product (image + name + description), Category, Price, Stock Status, Actions (Edit, Delete)
  - Search by name, stock filter (all/low/out/healthy), "Add New Product" button
  - Pagination: Shows 10 items, "Show All" toggle

- **Add Product** (`AddProduct.jsx`):
  - **Fields**: Product Name, Price (Rs.), Stock, Category (dropdown), Description, Image (file upload with preview)
  - **API**: `POST /products` with `multipart/form-data`
  - After creation: calls `refetchProducts()` and redirects to `/admin/products`

- **Edit Product** (`EditProduct.jsx`):
  - Pre-fills form with existing product data fetched via `useFetch('/products/:id')`
  - Same fields as Add, plus image replacement with hover overlay
  - **API**: `PUT /products/:id` with `multipart/form-data`
  - Shows loading spinner (`Loader2`) while fetching product data

- **Delete Product**: Triggered from Products table → `DeleteModal` confirmation → `DELETE /products/:id`

### 8. Admin — Order Management
- **Orders List** (`OrdersManagement.jsx`):
  - Table columns: Order ID, Customer, Phone, Email, Address, Items (with images, max 2 shown), Date, Total, Payment, Status (dropdown), Notes (expandable), Action (delete)
  - **Status Dropdown** (`OrderStatusDropdown`): Color-coded select (green=Delivered, red=Cancelled, orange=others) — calls `PUT /orders/:id/status` via `updateOrderStatus()`
  - Search by Order ID or customer name
  - Expandable order notes section
  - Pagination: Shows 10 orders, "Show All" toggle
  - **Delete Order**: Via `DeleteModal` → `DELETE /orders/:id`

### 9. Client — Shopping Cart
- **What the user sees**: Slide-in drawer panel from the right, header shows "Your Cart" with item count, list of cart items with image/icon, name, price, quantity (+/- buttons), hover-to-reveal "Remove" button, subtotal at bottom, "Checkout Now" button (disabled when cart empty), empty cart message with shopping cart emoji
- **Components**: `CartDrawer.jsx`
- **Data Flow**: All cart operations managed by `CartContext.jsx` (global state) → `useCart()` hook
- **API Endpoints**: None — cart is entirely client-side with `localStorage` persistence
- **Special UI/UX**: `animate-slide-in-right` entrance, backdrop blur overlay, item count badge on navbar cart icon

### 10. Client — Order Placement / Checkout
- **What the user sees**: Two-column layout — Left: "Billing & Delivery" form, Right: "Your order" summary (sticky on scroll)
- **Form Fields**: Full Name*, Country (read-only: Nepal), Street address (optional), Town/City*, Phone*, Email*, Order notes (optional)
- **Delivery Options**: Local Pickup (₨0) or Hatemalo Delivery (₨300, free over ₨5000)
- **Payment**: Cash on Delivery (only option)
- **Order Summary**: Product list with quantities and subtotals, subtotal, delivery fee, total
- **Components**: `Checkout.jsx`
- **API Endpoint**: `POST /orders` with `orderItems`, `customerDetails`, `deliveryMethod`, `paymentMethod`, `deliveryFee`, `totalAmount`
- **Special Logic**: Pre-fills name and email from `customerInfo`; auto-selects delivery when `subtotal >= 5000`; on-blur field validation with `touched` tracking; on success clears cart and redirects to `/my-orders`; handles 401 errors by redirecting to login

### 11. Client — Order History / Tracking
- **What the user sees**: Welcome message with customer name, search input for Order ID, status filter dropdown (`All`, `Pending`, `Preparing`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), order cards with: Order ID, Name, Phone, Date, Amount, Status (color-coded badge with icon), item list (max 2 shown + "+N more"), subtotal/delivery/total breakdown
- **Components**: `MyOrders.jsx`
- **API Endpoint**: `GET /orders/myorders` via `useFetch('/orders/myorders')`
- **Special UI/UX**: Pagination (shows 2 orders by default, "Show More"/"Show Less" toggle), loading spinner, empty state with "Browse Menu" button, color-coded status badges using `getStatusColor()` from `data.js`

### 12. Other Pages
- **Our Story** (`Story.jsx`): "Since 2081 B.S." tagline, "Baking with Heart & Soul" heading, two paragraphs about bakery mission, statistics grid (1+ Years of Heritage, 100% Artisanal Process, 5k+ Happy Customers), chef emoji with float animation
- **Contact** (`Contact.jsx`): Two-column layout with location address (Hatemalo Bakery Road, Chure, Dhanusha, Nepal), phone number (+977 9812198432), embedded Google Maps iframe showing Janakpur Nepal area

---

## ═══ SECTION 5: COMPONENTS DOCUMENTATION ═══

### 1. All Reusable Components

| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `components/common/Navbar.jsx` | Main navigation bar with logo, nav links, auth UI, cart button, mobile menu |
| `Footer` | `components/common/Footer.jsx` | Site footer with bakery name, tagline, and copyright year |
| `CartDrawer` | `components/common/CartDrawer.jsx` | Slide-in side panel displaying shopping cart with quantity controls |
| `DeleteModal` | `components/common/DeleteModal.jsx` | Confirmation dialog for delete operations with trash icon |
| `ProductCard` | `components/client/ProductCard.jsx` | Product display card showing image, name, category, price, and add-to-cart button |
| `Hero` | `components/client/Hero.jsx` | Landing page hero section with heading, CTA buttons, and banner image |
| `FeaturedProducts` | `components/client/FeaturedProducts.jsx` | Grid section displaying up to 6 featured products |
| `CategoryQuickLinks` | `components/client/CategoryQuickLinks.jsx` | Grid of category buttons for quick navigation to filtered menu |
| `Testimonials` | `components/client/Testimonials.jsx` | Customer review section with 3 testimonials and star ratings |
| `AdminLayout` | `components/admin/AdminLayout.jsx` | Admin wrapper — fetches data, manages state, renders sidebar + child routes |
| `AdminSidebar` | `components/admin/AdminSidebar.jsx` | Admin navigation sidebar with links and logout |
| `CategoryModal` | `components/admin/CategoryModal.jsx` | Modal form for creating/editing categories |
| `ToastContainer` | Defined in `App.jsx` | Custom toast notification display (uses `CartContext` toasts) |
| `Layout` | Defined in `App.jsx` | Page wrapper — conditionally renders Navbar/Footer for non-admin routes |

### 2. Components That Handle Forms

| Component | Form Fields |
|-----------|-------------|
| `CustomerLogin.jsx` | email, password |
| `CustomerRegister.jsx` | name, email, password, confirmPassword |
| `AdminLogin.jsx` | email, password |
| `Checkout.jsx` | firstName, country, street, city, phone, email, notes, deliveryMethod, paymentMethod |
| `AddProduct.jsx` | name, price, categoryId, stock, description, image (file) |
| `EditProduct.jsx` | name, price, categoryId, stock, description, image (file) |
| `CategoryModal.jsx` | newCategory (category name) |
| `Menu.jsx` | search (text), priceRange (range slider), selectedCat (category filter) |

### 3. Components That Use Props Heavily

**Example 1: `ProductCard`**
```jsx
const ProductCard = ({ product, categoryName }) => { ... }
// Props: product (object with id, name, price, image, icon), categoryName (string)
```

**Example 2: `DeleteModal`**
```jsx
const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => { ... }
// Props: isOpen (boolean), onClose (function), onConfirm (function), title (string), message (string)
```

**Example 3: `CategoryModal`**
```jsx
const CategoryModal = ({
  isOpen, isCategoryEdit, editingCategory, newCategory,
  setNewCategory, setIsCategoryModalOpen, setIsCategoryEdit,
  setEditingCategory, handleCategorySubmit
}) => { ... }
// 9 props: modal state, form data, state setters, submit handler
```

### 4. Custom Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useCart` | `hooks/useCart.js` | Wrapper around `useContext(CartContext)` — provides `cart`, `addToCart`, `removeFromCart`, `updateCartQty`, `clearCart`, `subtotal`, `addToast`, `toasts` |
| `useFetch` | `hooks/useFetch.js` | Generic data fetching hook — accepts URL, returns `{ data, setData, loading, error, refetch }`. Uses `api.get()` internally, auto-fetches on mount and URL change |

### 5. Navbar Component — Conditional Navigation

| User State | Links Shown |
|-----------|-------------|
| **Guest** (not logged in) | Home, Menu, Our Story, Contact, 🛒 Cart, Login button |
| **Logged-in Customer** | Home, Menu, Our Story, Contact, 🛒 Cart, Profile dropdown (showing name, email, "My Orders" link, Logout) |
| **Admin** | Same as Customer + ⚙️ Admin link (visible when `customerInfo.role === 'admin'`) |
| **Mobile** | Hamburger menu → Full-screen overlay with same links, Escape key to close, body scroll locked |

---

## ═══ SECTION 6: STATE MANAGEMENT DETAILS ═══

### 1. Global States Managed

| State | Manager | Scope |
|-------|---------|-------|
| Shopping Cart (`cart` array) | `CartContext.jsx` | Entire application via `CartProvider` |
| Cart Subtotal (computed) | `CartContext.jsx` | Derived from cart items |
| Toast Notifications (`toasts` array) | `CartContext.jsx` | Application-wide notifications |
| User Authentication | `localStorage` + component-level `useState` | Per-component; synced via `authchange` events |
| Admin Data (products, orders, categories) | `AdminLayout.jsx` via `useFetch` + `useOutletContext` | Admin section only |

### 2. Cart Data Management & Persistence
- **Storage**: Cart is stored in-memory via `useState` and **persisted to `localStorage`** under the key `bakery_cart`
- **Initialization**: On app load, cart is initialized from `localStorage.getItem('bakery_cart')` with JSON parsing (wrapped in try-catch for safety)
- **Sync**: A `useEffect` in `CartContext.jsx` runs `localStorage.setItem('bakery_cart', JSON.stringify(cart))` whenever the `cart` state changes
- **Operations**: `addToCart(product, qty)`, `updateCartQty(id, delta)`, `removeFromCart(id)`, `clearCart()`

### 3. Logged-in User Session Persistence
- **On Login**: Customer data (name, email, token) saved to `localStorage` as `customerInfo`
- **On Page Refresh**: `Navbar` component reads `getCustomerInfo()` on mount, then calls `verifyCustomer(token)` to validate the session with the backend. If invalid, calls `logoutCustomer()` to clear storage
- **Cross-tab**: `window.addEventListener('storage', ...)` listens for changes from other browser tabs
- **Custom Event**: `window.addEventListener('authchange', ...)` listens for programmatic auth changes within the same tab

### 4. React Contexts Created

| Context | File | Values Provided |
|---------|------|-----------------|
| `CartContext` | `context/CartContext.jsx` | `cart`, `toasts`, `addToCart`, `updateCartQty`, `removeFromCart`, `addToast`, `clearCart`, `subtotal` |

Admin state is **NOT** a React Context — it uses React Router's `Outlet` context via `useOutletContext()`, provided by `AdminLayout.jsx`. This context includes: `products`, `orders`, `categories`, state setters, refetch functions, delete handlers, filter states, and pagination toggles.

---

## ═══ SECTION 7: API INTEGRATION (Frontend Perspective) ═══

### All API Calls from the Frontend

| Feature | HTTP Method | Endpoint URL | What it does |
|---------|-------------|-------------|--------------|
| Customer Register | POST | `/api/auth/register` | Creates new customer account |
| Customer Login | POST | `/api/auth/login` | Authenticates customer, returns JWT token |
| Admin Login | POST | `/api/auth/login` | Authenticates admin (same endpoint, checks `isAdmin`) |
| Verify Token | POST | `/api/auth/verify` | Validates stored JWT token is still valid |
| Get All Products | GET | `/api/products` | Fetches all products (used in App.jsx and AdminLayout) |
| Get Product by ID | GET | `/api/products/:id` | Fetches single product details |
| Create Product | POST | `/api/products` | Admin adds new product (multipart/form-data with image) |
| Update Product | PUT | `/api/products/:id` | Admin edits existing product (multipart/form-data) |
| Delete Product | DELETE | `/api/products/:id` | Admin removes product |
| Get All Categories | GET | `/api/categories` | Fetches all product categories |
| Create Category | POST | `/api/categories` | Admin adds new category |
| Update Category | PUT | `/api/categories/:id` | Admin edits category name |
| Delete Category | DELETE | `/api/categories/:id` | Admin removes category |
| Place Order | POST | `/api/orders` | Customer places new order with cart items and details |
| Get My Orders | GET | `/api/orders/myorders` | Customer fetches their order history |
| Get All Orders | GET | `/api/orders` | Admin fetches all orders |
| Update Order Status | PUT | `/api/orders/:id/status` | Admin changes order status (Pending → Delivered, etc.) |
| Delete Order | DELETE | `/api/orders/:id` | Admin removes an order record |

---

## ═══ SECTION 8: UI/UX DESIGN DETAILS ═══

### 1. Color Scheme/Theme
| Token | Hex Value | Usage |
|-------|-----------|-------|
| Primary | `#1A1A1A` | Main text, headings, dark elements, primary buttons |
| Secondary | `#A0816C` | Accent text, highlights, hover states |
| Accent | `#F2E9D4` | Decorative accents, star ratings |
| Background | `#F9F7F2` | Page background (warm off-white) |
| Card BG | `#FFFFFF` | Card and container backgrounds |
| Cream | `#fcf9f2` | Light background sections |
| Light Brown | `#d4a373` | Primary action buttons, links, admin active states |
| Pastel Pink | `#ffb5a7` | Secondary action buttons |
| Dark Brown | `#4a3b32` | Admin text, form labels, dark accent |

### 2. Responsive Design
- **Yes, fully responsive** using Tailwind breakpoints:
  - `sm:` (640px) — Small screens
  - `md:` (768px) — Tablet; switches from mobile menu to desktop nav
  - `lg:` (1024px) — Desktop; sidebar layouts kick in
  - `xl:` (1280px) — Large desktop; wider product grids
- **Mobile menu**: Hamburger toggle → full-screen overlay with animated nav links
- **Admin sidebar**: Hidden on mobile → hamburger toggle; fixed sidebar on desktop

### 3. Animations & Transitions
| Animation | CSS / Class | Used In |
|-----------|-------------|---------|
| Fade in up | `animate-fade-in-up` (0.8s ease-out) | Page entrances, profile dropdown, mobile menu |
| Slide in right | `animate-slide-in-right` (0.4s ease-out) | CartDrawer entrance, toast notifications |
| Float | `animate-float` (6s ease-in-out infinite) | Hero decorative elements, product detail emoji, story chef emoji |
| Bounce | `animate-bounce` (Tailwind built-in) | Hero scroll indicator |
| Pulse | `animate-pulse` (Tailwind built-in) | Loading states, Suspense fallback |
| Spin | `animate-spin` (Tailwind built-in) | `Loader2` icon in EditProduct, AdminLayout |
| Scale on hover | `hover:scale-[1.02]`, `group-hover:scale-110` | Banner image, related products, category icons, product images |

### 4. Loading States
- **Suspense Fallback**: "Hatemalo is loading..." pulsing text (for lazy-loaded routes)
- **Product Details**: "Loading treat..." text with `animate-pulse`
- **My Orders**: "Loading your orders..." text with `animate-pulse`
- **Admin Layout**: `Loader2` spinning icon (from lucide-react)
- **Edit Product**: `Loader2` spinning icon with "Loading treat details..." text
- **Form Submissions**: Buttons show "Signing In...", "Creating Account...", "Creating Treat...", etc. with `disabled` state

### 5. Error Messages & Notifications
- **Toast Notifications**: `react-hot-toast` `<Toaster>` component at top-center, dark brown background, 3-second duration, rounded style
- **Custom Toasts**: `ToastContainer` in `App.jsx` for cart-specific messages (slide-in from right, green for success, red for errors)
- **Form Validation**: Inline error messages below fields with red text and "✕" prefix, red border on invalid fields, red-50 background
- **Auth Errors**: Red banner at top of form (e.g., "Invalid credentials", "Not authorized as an admin")
- **Admin Error Banner**: Red alert in `AdminLayout` with "Error loading data" message and "Retry" button

### 6. Overall Design Style
**Warm, premium bakery-themed design with modern aesthetics**:
- Warm earth tones (browns, creams, off-whites) evoking a cozy bakery atmosphere
- Playfair Display serif font for headings creates an artisanal, sophisticated feel
- Lato sans-serif for body text ensures readability
- Generous spacing and large rounded corners (up to `rounded-[4rem]`) for a soft, inviting look
- Uppercase tracking-widest labels for a luxury brand feel
- Emoji icons as visual accents (bread, cake, etc.)
- Subtle backdrop blurs and glassmorphism effects
- Card-based layout with soft shadows

---

## ═══ SECTION 9: SYSTEM DIAGRAMS INFORMATION ═══

### 1. Use Case Diagram — Actors and Use Cases

**Actor: Guest (Unauthenticated Visitor)**
- View Home/Landing Page
- Browse Menu (with filters)
- View Product Details
- Read Our Story page
- View Contact Information
- Register as Customer
- Login as Customer

**Actor: Customer (Authenticated User)**
- All Guest use cases, plus:
- Add Products to Cart
- Manage Cart (update quantity, remove items)
- Proceed to Checkout
- Fill Billing/Delivery Details
- Place Order
- View Order History (My Orders)
- Search/Filter Orders
- Logout

**Actor: Admin (Bakery Administrator)**
- Login to Admin Portal
- View Dashboard Analytics
- Manage Products (Add, Edit, Delete)
- Upload Product Images
- Manage Categories (Add, Edit, Delete)
- Manage Orders (View, Update Status, Delete)
- View Inventory Health
- Logout

### 2. Component/Module Diagram

```
┌──────────────────────────────────────────────────────────┐
│                        App.jsx                            │
│  ┌──────────┐ ┌──────────────┐ ┌──────────────────────┐  │
│  │CartProvider│ │  Toaster     │ │     Router           │  │
│  └──────────┘ └──────────────┘ │  ┌─────────────────┐ │  │
│                                 │  │    Layout        │ │  │
│                                 │  │ ┌──────┐ ┌────┐ │ │  │
│                                 │  │ │Navbar│ │Foot│ │ │  │
│                                 │  │ └──────┘ └────┘ │ │  │
│                                 │  │ ┌────────────┐  │ │  │
│                                 │  │ │ CartDrawer │  │ │  │
│                                 │  │ └────────────┘  │ │  │
│                                 │  │ ┌────────────┐  │ │  │
│                                 │  │ │ AppRoutes  │  │ │  │
│                                 │  │ └────────────┘  │ │  │
│                                 │  └─────────────────┘ │  │
│                                 └──────────────────────┘  │
└──────────────────────────────────────────────────────────┘

AppRoutes splits into:
  ├── Client Routes: Home, Menu, ProductDetails, Contact, Story, Checkout, MyOrders, Login, Register
  └── Admin Routes (wrapped in AdminLayout):
        ├── Dashboard
        ├── ProductsManagement → AddProduct, EditProduct
        ├── OrdersManagement
        └── CategoriesManagement
```

### 3. Data Flow

```
User Action (click "Add to Cart")
    ↓
Component (ProductCard) calls addToCart(product)
    ↓
CartContext updates cart state via useState
    ↓
useEffect syncs cart to localStorage
    ↓
CartDrawer re-renders showing new item
    ↓
User clicks "Checkout Now"
    ↓
Checkout page reads cart from useCart() hook
    ↓
User fills form and clicks "Place Order"
    ↓
Checkout calls api.post('/orders', orderData)
    ↓
Axios interceptor attaches JWT token from localStorage
    ↓
Backend processes order, returns success
    ↓
Checkout calls clearCart() and navigates to /my-orders
    ↓
MyOrders page calls useFetch('/orders/myorders')
    ↓
Backend returns orders → UI renders order cards
```

### 4. Navigation Flows

**(a) Client Placing an Order:**
```
Home → Menu (browse/filter) → Product Details (view) → Add to Cart →
Cart Drawer (review) → Checkout (fill form) → Place Order → My Orders (confirmation)
```

**(b) Admin Managing Products:**
```
Admin Login → Dashboard (overview) → Products Management (list) →
Add Product (create) OR Edit Product (update) OR Delete (confirm modal) →
Back to Products Management (refreshed list)
```

---

## ═══ SECTION 10: DEVELOPMENT PROCESS & WEEKLY WORK LOG ═══

| Week | Tasks Completed |
|------|----------------|
| **Week 1** | Project initialization with Vite + React; Tailwind CSS v4 setup; ESLint configuration; Google Fonts integration; Folder structure planning (components/, pages/, hooks/, context/, services/); Git repository setup |
| **Week 2** | Design system creation (color tokens, typography, custom theme in index.css); Navbar component with responsive mobile menu; Footer component; Layout wrapper component in App.jsx |
| **Week 3** | Home page development: Hero section with CTA buttons, CategoryQuickLinks grid, background animations; Static data file (data.js) with product catalog (70 items, 10 categories) |
| **Week 4** | Product listing (Menu) page with category filter, search input, price range slider; ProductCard component; FeaturedProducts and Testimonials sections for home page |
| **Week 5** | CartContext with localStorage persistence; useCart hook; CartDrawer slide-in component; Add-to-cart functionality with toast notifications; Cart badge on Navbar |
| **Week 6** | API service layer (api.js): Axios instance configuration, request interceptor, token management, image URL handling; useFetch custom hook; Product detail page with related products, share functionality |
| **Week 7** | Customer authentication: Login and Registration pages with form validation; JWT token storage; verifyCustomer token check; Navbar auth-aware rendering (guest vs customer); authchange event system |
| **Week 8** | Checkout page with billing form, delivery method selection (local pickup vs delivery with free-over-5000 logic), order summary, form validation; Order placement API integration; My Orders page with search/filter/pagination |
| **Week 9** | Admin module: AdminLogin, AdminLayout (data fetching, outlet context), AdminSidebar, Dashboard analytics; ProductsManagement with table, search, stock filter; AddProduct and EditProduct with image upload; DeleteModal for confirmations |
| **Week 10** | OrdersManagement with status dropdown updates, expandable notes; CategoriesManagement with CategoryModal for add/edit; Contact page with Google Maps; Story/About page; Final bug fixes, responsive testing, code cleanup, documentation |

---

## ═══ SECTION 11: CHALLENGES & SOLUTIONS ═══

### 1. Cart State Persistence Across Page Refreshes
**Challenge**: Shopping cart data was lost when the user refreshed the browser, leading to poor user experience.
**Solution**: Implemented `localStorage` persistence in `CartContext.jsx` — cart state is initialized from `localStorage.getItem('bakery_cart')` on load, and a `useEffect` hook syncs state to localStorage on every cart change. Error handling with try-catch ensures graceful fallback to empty cart if JSON parsing fails.

### 2. JWT Authentication with Role-Based Token Routing  
**Challenge**: The application has two user types (customer and admin) each storing tokens under different localStorage keys. API requests needed the correct token based on the route type.
**Solution**: Created an Axios request interceptor in `api.js` that uses `isAdminAPIRoute()` to determine the route type, then calls `getAuthTokenForRoute()` to retrieve the correct token from either `userInfo` or `customerInfo` in localStorage. Special handling for `/orders/myorders` as a customer route despite containing `/orders`.

### 3. Protected Route Implementation Without Router Guards
**Challenge**: React Router v7 does not have built-in route guards, and the project needed to protect checkout, orders, and admin pages from unauthenticated access.
**Solution**: Each protected page component implements its own auth check via `useEffect` on mount — reading `getCustomerInfo()` and calling `verifyCustomer(token)`, redirecting to `/login` if the check fails. Admin pages are wrapped in `AdminLayout` which checks for `userInfo` in localStorage and redirects to `/admin` login if absent.

### 4. Cross-Component Authentication State Synchronization
**Challenge**: When a user logs in or out, all components displaying auth-dependent UI (Navbar profile, cart, etc.) needed to update immediately without a full page refresh.
**Solution**: Implemented a custom event system using `window.dispatchEvent(new Event('authchange'))`. The Navbar listens for both the `authchange` custom event and the browser's native `storage` event (for cross-tab sync). On either event, it re-reads customer info from localStorage and updates its state.

### 5. Image URL Handling Between Frontend and Backend
**Challenge**: Product images stored in the database have various path formats (relative paths, `/uploads/` prefix, `/assets/` prefix, or full URLs), causing broken images.
**Solution**: Created a centralized `getImageUrl()` utility in `api.js` that normalizes any image path format into a full working URL. It handles: null paths (returns SVG placeholder), full URLs and data URIs (returned as-is), `/uploads/` paths, `/assets/` paths, and bare filenames (prefixed with `/assets/bakery/`). A fallback `PLACEHOLDER_IMAGE` SVG is embedded as a data URI string.

### 6. Responsive Admin Dashboard on Mobile Devices
**Challenge**: The admin dashboard with sidebar navigation and data tables did not display properly on mobile screens, with tables overflowing horizontally.
**Solution**: Made the admin sidebar fully responsive — hidden by default on mobile with a hamburger toggle that opens a full-screen overlay. Added `overflow-x-auto` and `min-w-*` classes to admin tables. Used `md:flex-row` responsive layouts for the sidebar-content arrangement. Added sticky mobile header with branding.

### 7. Form Validation UX with On-Blur Strategy
**Challenge**: Showing validation errors immediately on page load was intrusive, but only showing them on submit missed opportunities for inline feedback.
**Solution**: Implemented a "touched" field tracking pattern across all forms. Validation errors only show for fields the user has interacted with (`touched[field] === true`). Fields are marked as touched on blur. On form submission, all fields are forcefully marked as touched to show any remaining errors. This provides a balanced UX between early feedback and non-intrusiveness.

---

## ═══ SECTION 12: TESTING & DEPLOYMENT ═══

### 1. Testing Approach
- **Manual Testing**: All features tested manually during development
- **Browser Developer Tools**: Used React DevTools for component inspection, Network tab for API call verification, Console for error monitoring
- **Responsive Testing**: Tested across different viewport sizes using browser DevTools responsive mode

### 2. Browsers Tested
- Google Chrome (primary development browser)
- Mozilla Firefox
- Microsoft Edge

### 3. Frontend Deployment/Hosting
- **Development**: Runs locally via `npm run dev` (Vite dev server with Hot Module Replacement)
- **Deployment**: Not yet deployed to production hosting (runs on `localhost`)
- **Potential Hosting**: Vercel or Netlify (Vite projects are supported out-of-the-box)

### 4. Build Command and Output
```bash
npm run build      # Runs: vite build
```
- **Output Folder**: `dist/` (Vite default)
- **Preview**: `npm run preview` — serves the production build locally for testing

### 5. API Base URL Configuration
- Currently **hardcoded** in `src/services/api.js`:
  ```javascript
  const API_BASE_URL = 'http://localhost:5000';
  const API_ENDPOINT = '/api';
  ```
- For production, this would be changed to the deployed backend URL or configured via environment variables (`import.meta.env.VITE_API_URL`)

---

## ═══ SECTION 13: LEARNING OUTCOMES ═══

### 1. React.js Concepts Applied and Strengthened
- **React 19 Features**: Latest version with StrictMode for development checks
- **Functional Components & Hooks**: Entire application built with functional components; extensive use of `useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useParams`, `useNavigate`, `useLocation`, `useOutletContext`
- **Context API**: Implemented global state management for shopping cart without external libraries
- **Custom Hooks**: Created `useCart` and `useFetch` for reusable logic abstraction
- **Code Splitting**: Implemented `React.lazy()` and `Suspense` for performance optimization via lazy-loaded routes
- **Component Composition**: Complex pages built by composing smaller, focused components (Home = Hero + CategoryQuickLinks + FeaturedProducts + Testimonials)
- **Conditional Rendering**: Auth-aware navigation, admin vs client layouts, loading/error/empty states
- **Event Handling**: Form validation, shopping cart interactions, modal controls, keyboard events (Escape)

### 2. Professional/Industry Practices Learned
- **Separation of Concerns**: API layer (`services/api.js`) separated from UI components
- **DRY Principle**: Consolidated helper functions (`authenticateAndStore`, `getTokenFromStorage`, `normalizeProduct`, `getErrorMessage`)
- **Centralized Configuration**: All API URLs, storage keys, and route constants defined in one place
- **Error Handling**: Graceful degradation — API failures fall back to local data, image loading failures show placeholder
- **Code Documentation**: JSDoc-style comments on every component and function
- **ESLint**: Configured with React Hooks rules and React Refresh plugins

### 3. Full-Stack Communication Understanding
- **RESTful API Design**: Understood GET/POST/PUT/DELETE patterns for CRUD operations
- **JWT Authentication Flow**: End-to-end token lifecycle — login → store → attach to requests → verify → refresh/logout
- **Axios Interceptors**: Middleware pattern for automatically attaching auth headers
- **File Upload**: `multipart/form-data` handling for product image uploads via `FormData` API
- **Error Response Handling**: Parsing `error.response?.data?.message` pattern for server-side validation errors

### 4. Future Improvements
- **Environment Variables**: Move `API_BASE_URL` to `.env` file using `import.meta.env.VITE_*`
- **Route Guards**: Implement a reusable `ProtectedRoute` component instead of per-page auth checks
- **Online Payment Integration**: Add eSewa, Khalti, or card payment in addition to Cash on Delivery
- **Real-time Order Tracking**: WebSocket or polling for live order status updates
- **Search Enhancement**: Server-side search with debouncing for large product catalogs
- **Image Optimization**: Lazy loading, responsive `srcset`, WebP format for product images
- **Unit Testing**: Add Jest + React Testing Library for component tests
- **PWA Support**: Add service worker and manifest for offline capability
- **Internationalization**: Support Nepali (नेपाली) language alongside English

---

## ═══ SECTION 14: SCREENSHOTS LIST ═══

| # | Page/Screen | What to Demonstrate |
|---|-------------|---------------------|
| 1 | Home Page — Hero Section | Full hero banner with heading, CTA buttons, banner image, animated elements |
| 2 | Home Page — Category Quick Links | All 10 category buttons with emoji icons |
| 3 | Home Page — Featured Products | 6 featured product cards in grid layout |
| 4 | Home Page — Testimonials | 3 customer reviews with star ratings |
| 5 | Menu Page — Full View | Product grid with sidebar filters visible |
| 6 | Menu Page — Filtered View | Products filtered by a specific category |
| 7 | Menu Page — Search Active | Search results with search term typed |
| 8 | Product Details Page | Full product view with image, description, ingredients, add-to-cart |
| 9 | Shopping Cart Drawer — With Items | Cart panel open showing items, quantities, subtotal |
| 10 | Shopping Cart Drawer — Empty | Empty cart state with emoji message |
| 11 | Checkout Page — Form | Billing form with all fields filled |
| 12 | Checkout Page — Order Summary | Order summary panel with delivery options, free delivery badge |
| 13 | Customer Login Page | Login form with email and password fields |
| 14 | Customer Registration Page | Registration form with all fields |
| 15 | Login — Validation Error | Form showing inline validation errors (red borders, error messages) |
| 16 | My Orders Page — With Orders | Order history showing multiple orders with status badges |
| 17 | My Orders Page — Empty State | Empty state when no orders exist |
| 18 | Our Story Page | About page with bakery story, statistics, chef emoji |
| 19 | Contact Page | Location details with embedded Google Maps |
| 20 | Admin Login Page | Admin portal login with lock icon |
| 21 | Admin Dashboard | Analytics cards, inventory health, order flow, menu breakdown |
| 22 | Admin Products Management | Products table with search, stock filter, action buttons |
| 23 | Admin Add Product | Product creation form with image upload area |
| 24 | Admin Edit Product | Pre-filled product edit form with current image |
| 25 | Admin Orders Management | Orders table with status dropdowns, expanded order notes |
| 26 | Admin Categories Management | Categories table with product counts, add/edit modal |
| 27 | Delete Confirmation Modal | DeleteModal with trash icon and confirm/cancel buttons |
| 28 | Category Add/Edit Modal | CategoryModal form for creating or updating a category |
| 29 | Navbar — Mobile Menu Open | Mobile hamburger menu showing animated navigation links |
| 30 | Navbar — Profile Dropdown | User profile dropdown showing name, email, My Orders link, Logout |
| 31 | Toast Notification | Success or error toast notification visible |
| 32 | Responsive View — Mobile | Any page viewed on mobile viewport (e.g., 375px wide) |
