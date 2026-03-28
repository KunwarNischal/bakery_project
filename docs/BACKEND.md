# Backend Documentation - Hatemalo Bakery Project

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Routes & Endpoints](#api-routes--endpoints)
6. [Controllers Documentation](#controllers-documentation)
7. [Models Documentation](#models-documentation)
8. [Middleware](#middleware)
9. [Configuration](#configuration)
10. [Error Handling](#error-handling)
11. [Authentication & Security](#authentication--security)
12. [File Upload & Image Management](#file-upload--image-management)
13. [Data Seeding](#data-seeding)
14. [Installation & Setup](#installation--setup)
15. [Deployment](#deployment)

---

## Project Overview

**Hatemalo Bakery Backend** is a Node.js/Express REST API server that powers the e-commerce platform. It provides:
- **Product Management**: CRUD operations for bakery products
- **Category Management**: Organize products by categories
- **Order Management**: Order processing and status tracking
- **User Management**: Customer authentication and profiles
- **Admin Panel**: Secure admin access with authentication
- **Image Upload**: Handle product images and uploads
- **Database**: MongoDB for data persistence

### Architecture Pattern
- **REST API**: RESTful endpoints for all operations
- **MVC Pattern**: Models, Views (JSON responses), Controllers
- **Middleware**: Request validation, authentication, error handling
- **Database**: MongoDB with Mongoose ODM

---

## Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime |
| **Express** | 4.x | Web framework |
| **MongoDB** | 5.0+ | NoSQL database |
| **Mongoose** | 7.x | MongoDB ODM |
| **JWT** | Latest | Authentication tokens |
| **Bcrypt** | Latest | Password hashing |
| **Multer** | Latest | File upload handling |
| **CORS** | Latest | Cross-origin requests |

### Development Tools
- **Nodemon** - Auto-restart on file changes
- **dotenv** - Environment variables
- **Postman** - API testing
- **MongoDB Atlas** - Cloud database (optional)

---

## Project Structure

```
server/
├── config/
│   ├── db.js                    # MongoDB connection setup
│   └── upload.js                # Multer upload configuration
│
├── controllers/
│   ├── authController.js        # Authentication logic (login, register)
│   ├── productController.js     # Product CRUD operations
│   ├── categoryController.js    # Category CRUD operations
│   └── orderController.js       # Order operations
│
├── models/
│   ├── User.js                  # User schema & model
│   ├── Product.js               # Product schema & model
│   ├── Category.js              # Category schema & model
│   └── Order.js                 # Order schema & model
│
├── middleware/
│   ├── authMiddleware.js        # JWT verification
│   └── uploadMiddleware.js      # Multer configuration
│
├── routes/
│   ├── authRoutes.js            # Authentication endpoints
│   ├── productRoutes.js         # Product endpoints
│   ├── categoryRoutes.js        # Category endpoints
│   └── orderRoutes.js           # Order endpoints
│
├── public/
│   └── uploads/                 # Product images storage
│       ├── image-1774098103802.jpg
│       ├── image-1774098119024.jpg
│       └── ... (product images)
│
├── utils/
│   └── orderNumberGenerator.js  # Generate unique order IDs
│
├── .env                         # Environment variables (secret)
├── .env.example                 # Example environment file
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── server.js                    # Main server entry point
├── seed.js                      # Database seeding script
└── vercel.json                  # Vercel deployment config (optional)
```

---

## Database Schema

### User Model
**Collection**: `users`

```javascript
{
  _id: ObjectId,

  // Basic Info
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Admin Flag
  isAdmin: {
    type: Boolean,
    default: false
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes**:
- `email`: Unique, sparse

**Methods**:
- `comparePassword(plainPassword)`: Verify password against hash
- `toJSON()`: Remove sensitive fields in response

### Product Model
**Collection**: `products`

```javascript
{
  _id: ObjectId,

  // Product Info
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },

  // Stock Management
  stock: {
    type: Number,
    default: 0,
    min: 0
  },

  // Image
  image: {
    type: String
    // Stored as filename or URL
  },

  // Rating
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes**:
- `name`: For search
- `category`: For filtering
- `createdAt`: For sorting

**Relationships**:
- References: `Category` via `category` field

### Category Model
**Collection**: `categories`

```javascript
{
  _id: ObjectId,

  // Category Info
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },

  // Image
  image: {
    type: String
    // Category thumbnail
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes**:
- `name`: Unique

### Order Model
**Collection**: `orders`

```javascript
{
  _id: ObjectId,

  // Order Identification
  orderNumber: {
    type: String,
    unique: true
    // Auto-generated unique order ID
  },

  // Customer Reference
  customerId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },

  // Customer Details
  customerDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },

  // Order Items
  orderItems: [{
    _id: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    productId: ObjectId
  }],

  // Cost Breakdown
  subtotal: Number,      // Sum of (price × quantity)
  deliveryFee: Number,   // ₨0 if >= ₨5000, else ₨50
  totalAmount: Number,   // subtotal + deliveryFee

  // Delivery
  deliveryMethod: {
    type: String,
    enum: ['Home Delivery', 'Pickup'],
    default: 'Home Delivery'
  },

  // Status
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes**:
- `orderNumber`: Unique
- `customerId`: For customer orders
- `createdAt`: For sorting

**Relationships**:
- References: `User` via `customerId`

---

## API Routes & Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes (`/auth`)

#### 1. Register Customer
```
POST /auth/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}

Errors:
- 400: User already exists
- 400: Validation errors
```

#### 2. Login
```
POST /auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "secure123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}

Errors:
- 401: Invalid credentials
- 404: User not found
```

---

### Product Routes (`/products`)

#### 1. Get All Products
```
GET /products

Query Parameters:
- category (optional): Filter by category ID
- search (optional): Search by name
- limit (optional): Number of products
- skip (optional): Pagination offset

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Chocolate Cake",
      "description": "Rich chocolate cake",
      "category": "category_id",
      "price": 350,
      "stock": 20,
      "image": "image_filename",
      "rating": 4.5
    },
    ...
  ],
  "total": 50
}
```

#### 2. Get Single Product
```
GET /products/:id

Response (200):
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Chocolate Cake",
    "description": "Rich chocolate cake",
    "category": "category_id",
    "price": 350,
    "stock": 20,
    "image": "image_filename",
    "rating": 4.5,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}

Errors:
- 404: Product not found
```

#### 3. Create Product (Admin Only)
```
POST /products

Headers:
Authorization: Bearer {jwt_token}

Request Body (multipart/form-data):
{
  "name": "New Product",
  "description": "Product description",
  "category": "category_id",
  "price": 299,
  "stock": 100,
  "image": <file>          // File upload
}

Response (201):
{
  "success": true,
  "message": "Product created successfully",
  "data": { ...product_data }
}

Errors:
- 401: Not authenticated
- 403: Not admin
- 400: Validation errors
```

#### 4. Update Product (Admin Only)
```
PUT /products/:id

Headers:
Authorization: Bearer {jwt_token}

Request Body (multipart/form-data):
{
  "name": "Updated Name",
  "description": "Updated description",
  "category": "category_id",
  "price": 320,
  "stock": 90,
  "image": <file>         // Optional file update
}

Response (200):
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ...updated_product }
}

Errors:
- 401: Not authenticated
- 403: Not admin
- 404: Product not found
```

#### 5. Delete Product (Admin Only)
```
DELETE /products/:id

Headers:
Authorization: Bearer {jwt_token}

Response (200):
{
  "success": true,
  "message": "Product deleted successfully"
}

Errors:
- 401: Not authenticated
- 403: Not admin
- 404: Product not found
```

---

### Category Routes (`/categories`)

#### 1. Get All Categories
```
GET /categories

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Breads",
      "description": "Fresh breads",
      "image": "image_filename"
    },
    ...
  ]
}
```

#### 2. Get Single Category
```
GET /categories/:id

Response (200):
{
  "success": true,
  "data": { ...category_data }
}

Errors:
- 404: Category not found
```

#### 3. Create Category (Admin Only)
```
POST /categories

Headers:
Authorization: Bearer {jwt_token}

Request Body (multipart/form-data):
{
  "name": "Cakes",
  "description": "Delicious cakes",
  "image": <file>
}

Response (201):
{
  "success": true,
  "message": "Category created successfully",
  "data": { ...category_data }
}

Errors:
- 401: Not authenticated
- 403: Not admin
```

#### 4. Update Category (Admin Only)
```
PUT /categories/:id

Headers:
Authorization: Bearer {jwt_token}

Request Body:
{
  "name": "Updated Name",
  "description": "Updated description",
  "image": <file>        // Optional
}

Response (200):
{
  "success": true,
  "message": "Category updated successfully",
  "data": { ...updated_category }
}
```

#### 5. Delete Category (Admin Only)
```
DELETE /categories/:id

Headers:
Authorization: Bearer {jwt_token}

Response (200):
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### Order Routes (`/orders`)

#### 1. Get All Orders (Admin Only)
```
GET /orders

Headers:
Authorization: Bearer {admin_token}

Query Parameters:
- status (optional): Filter by order status
- limit (optional): Results per page
- skip (optional): Pagination

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "orderNumber": "ORD-001",
      "customerId": "user_id",
      "customerDetails": { ...details },
      "orderItems": [ ...items ],
      "totalAmount": 2500,
      "orderStatus": "Delivered",
      "createdAt": "2024-01-10"
    },
    ...
  ],
  "total": 25
}
```

#### 2. Get Customer Orders (Customer)
```
GET /orders/myorders

Headers:
Authorization: Bearer {customer_token}

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "orderNumber": "ORD-001",
      "orderItems": [ ...items ],
      "totalAmount": 2500,
      "orderStatus": "Delivered"
    },
    ...
  ]
}

Errors:
- 401: Not authenticated
```

#### 3. Get Single Order
```
GET /orders/:id

Headers:
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": { ...complete_order_data }
}

Errors:
- 401: Not authenticated
- 404: Order not found
- 403: Unauthorized (not owner or admin)
```

#### 4. Create Order (Place Order)
```
POST /orders

Headers:
Authorization: Bearer {customer_token}
Content-Type: application/json

Request Body:
{
  "orderItems": [
    {
      "productId": "product_id",
      "name": "Chocolate Cake",
      "price": 350,
      "quantity": 2,
      "image": "image_filename"
    },
    ...
  ],
  "customerDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+977 9812345678",
    "address": "123 Street",
    "city": "Dhanusha",
    "postalCode": "45600",
    "country": "Nepal"
  },
  "deliveryMethod": "Home Delivery",
  "totalAmount": 2500,
  "deliveryFee": 50
}

Response (201):
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "order_id",
    "orderNumber": "ORD-12345",
    "orderStatus": "Pending",
    "createdAt": "2024-01-20"
  }
}

Errors:
- 401: Not authenticated
- 400: Validation errors
- 400: Insufficient stock
```

#### 5. Update Order Status (Admin Only)
```
PUT /orders/:id

Headers:
Authorization: Bearer {admin_token}

Request Body:
{
  "orderStatus": "Preparing"    // One of: Pending, Processing, Preparing, Shipped, Delivered, Cancelled
}

Response (200):
{
  "success": true,
  "message": "Order status updated",
  "data": { ...updated_order }
}

Errors:
- 401: Not authenticated
- 403: Not admin
- 404: Order not found
```

---

## Controllers Documentation

### authController.js

#### `register(req, res)`
- **Purpose**: Register new customer
- **Parameters**:
  - `name` (string): Customer name
  - `email` (string): Email (unique)
  - `password` (string): Password (min 6 chars)
- **Logic**:
  1. Validate input
  2. Check if email already exists
  3. Hash password with bcrypt
  4. Create user document
  5. Generate JWT token
  6. Return token and user info
- **Returns**: { success, message, token, user }
- **Status Codes**: 201 (success), 400 (error), 500 (server)

#### `login(req, res)`
- **Purpose**: Authenticate user and return token
- **Parameters**:
  - `email` (string): User email
  - `password` (string): User password
- **Logic**:
  1. Validate input
  2. Find user by email
  3. Compare password with hash
  4. Generate JWT token
  5. Return token and user info
- **Returns**: { success, message, token, user }
- **Status Codes**: 200 (success), 401 (invalid), 404 (not found), 500 (error)

---

### productController.js

#### `getAllProducts(req, res)`
- **Purpose**: Fetch all products with filtering
- **Query Params**:
  - `category` (optional): Filter by category ObjectId
  - `search` (optional): Search by product name (case-insensitive)
  - `limit` (optional, default: 50): Results per page
  - `skip` (optional, default: 0): Pagination offset
- **Logic**:
  1. Build filter query (category, search)
  2. Query products from database
  3. Count total results
  4. Return paginated results
- **Returns**: { success, data: [products], total }

#### `getProductById(req, res)`
- **Purpose**: Get single product details
- **Parameter**: `id` - Product ObjectId
- **Logic**:
  1. Find product by ID
  2. Return with category details (populated)
- **Returns**: { success, data: product }
- **Status Codes**: 200 (success), 404 (not found)

#### `createProduct(req, res)`
- **Purpose**: Create new product (admin only)
- **Parameters**:
  - `name` (string): Product name
  - `description` (string): Product description
  - `category` (ObjectId): Category ID
  - `price` (number): Product price
  - `stock` (number): Initial stock
  - `image` (file): Product image
- **Middleware**: `authMiddleware`, `uploadMiddleware`
- **Logic**:
  1. Validate authenticated user is admin
  2. Validate all fields
  3. Save image file via multer
  4. Create product in database
  5. Return created product
- **Returns**: { success, message, data: product }
- **Status Codes**: 201 (created), 400 (validation), 403 (not admin)

#### `updateProduct(req, res)`
- **Purpose**: Update existing product (admin only)
- **Parameter**: `id` - Product ObjectId
- **Parameters**: Same as createProduct (all optional)
- **Logic**:
  1. Validate admin
  2. Find product by ID
  3. Update fields if provided
  4. Handle image replacement if uploaded
  5. Save updated product
  6. Return updated product
- **Returns**: { success, message, data: product }
- **Status Codes**: 200 (updated), 404 (not found), 403 (not admin)

#### `deleteProduct(req, res)`
- **Purpose**: Delete product (admin only)
- **Parameter**: `id` - Product ObjectId
- **Logic**:
  1. Validate admin
  2. Find product by ID
  3. Delete image file if exists
  4. Delete product from database
  5. Return success message
- **Returns**: { success, message }
- **Status Codes**: 200 (success), 404 (not found), 403 (not admin)

---

### categoryController.js

#### `getAllCategories(req, res)`
- **Purpose**: Fetch all categories
- **Logic**:
  1. Query all categories
  2. Sort by name
  3. Return categories
- **Returns**: { success, data: [categories] }

#### `getCategoryById(req, res)`
- **Purpose**: Get single category
- **Parameter**: `id` - Category ObjectId
- **Returns**: { success, data: category }
- **Status Code**: 404 if not found

#### `createCategory(req, res)`
- **Purpose**: Create new category (admin only)
- **Parameters**:
  - `name` (string): Category name
  - `description` (string): Description
  - `image` (file): Category image
- **Logic**:
  1. Validate admin
  2. Validate name is unique
  3. Save image
  4. Create category
- **Returns**: { success, message, data: category }

#### `updateCategory(req, res)`
- **Purpose**: Update category (admin only)
- **Logic**: Similar to updateProduct
- **Returns**: { success, message, data: category }

#### `deleteCategory(req, res)`
- **Purpose**: Delete category (admin only)
- **Logic**: Similar to deleteProduct
- **Returns**: { success, message }

---

### orderController.js

#### `getAllOrders(req, res)`
- **Purpose**: Get all orders (admin only)
- **Query Params**:
  - `status` (optional): Filter by order status
  - `limit`, `skip`: Pagination
- **Logic**:
  1. Validate admin
  2. Build filter (status if provided)
  3. Query orders
  4. Populate customer details
  5. Return paginated orders
- **Returns**: { success, data: [orders], total }

#### `getMyOrders(req, res)`
- **Purpose**: Get customer's orders
- **Logic**:
  1. Get customerId from JWT token
  2. Query orders for this customer
  3. Sort by recent first
  4. Return customer's orders
- **Returns**: { success, data: [orders] }
- **Protection**: Requires customer token

#### `getOrderById(req, res)`
- **Purpose**: Get single order details
- **Parameter**: `id` - Order ObjectId
- **Logic**:
  1. Find order
  2. Validate user is owner or admin
  3. Return order with populated details
- **Returns**: { success, data: order }
- **Status Codes**: 200, 404, 403

#### `createOrder(req, res)`
- **Purpose**: Place new order (customer)
- **Parameters**:
  - `orderItems` (array): Items to order
  - `customerDetails` (object): Customer info
  - `deliveryMethod` (string): Delivery method
  - `totalAmount` (number): Total amount
  - `deliveryFee` (number): Delivery fee
- **Logic**:
  1. Validate customer authenticated
  2. Validate all fields
  3. Verify stock availability
  4. Generate unique order number
  5. Calculate delivery fee (free over ₨5000, else ₨50)
  6. Create order document
  7. Clear customer cart
  8. Return confirmation
- **Returns**: { success, message, data: order }
- **Status Codes**: 201 (created), 400 (validation), 500 (error)

#### `updateOrderStatus(req, res)`
- **Purpose**: Update order status (admin only)
- **Parameter**: `id` - Order ObjectId
- **Body**: `{ orderStatus: "Shipped" }`
- **Logic**:
  1. Validate admin
  2. Find order
  3. Update status
  4. Save order
  5. (Optional) Send notification to customer
- **Returns**: { success, message, data: order }
- **Valid Statuses**: Pending, Processing, Preparing, Shipped, Delivered, Cancelled

---

## Models Documentation

### User Model (User.js)

#### Schema Fields
- `name` (String, required): User's full name
- `email` (String, required, unique): Email address
- `password` (String, required): Hashed password
- `isAdmin` (Boolean, default: false): Admin flag
- `createdAt` (Date): Creation timestamp
- `updatedAt` (Date): Last update timestamp

#### Instance Methods
```javascript
// Compare password with hash
userDocument.comparePassword(plainPassword) → Promise<boolean>

// Convert to JSON (removes sensitive fields)
userDocument.toJSON() → { _id, name, email, isAdmin }
```

#### Pre-hooks
- `pre('save')`: Hash password if modified
- `pre('save')`: Set updatedAt timestamp

#### Validation
- Email format validation (regex)
- Password minimum 6 characters
- Email must be unique in database

---

### Product Model (Product.js)

#### Schema Fields
- `name` (String, required): Product name
- `description` (String, required): Detailed description
- `category` (ObjectId, required): Reference to Category
- `price` (Number, required, min: 0): Price in ₨
- `stock` (Number, default: 0, min: 0): Available quantity
- `image` (String): Filename or URL of product image
- `rating` (Number, default: 0, min: 0, max: 5): Average rating
- `createdAt` (Date): Creation timestamp
- `updatedAt` (Date): Last update timestamp

#### Static Methods
```javascript
// Search products
Product.search(searchTerm) → Promise<[products]>

// Filter by category
Product.byCategory(categoryId) → Promise<[products]>

// Get featured products
Product.getFeatured(limit) → Promise<[products]>
```

#### Validation
- Name is required and unique
- Description required
- Category must exist
- Price must be >= 0
- Stock must be >= 0
- Rating must be between 0-5

---

### Category Model (Category.js)

#### Schema Fields
- `name` (String, required, unique): Category name
- `description` (String): Category description
- `image` (String): Category image filename
- `createdAt` (Date): Creation timestamp
- `updatedAt` (Date): Last update timestamp

#### Validation
- Name is unique
- Name is required

---

### Order Model (Order.js)

#### Schema Fields
- `orderNumber` (String, unique): Auto-generated order ID
- `customerId` (ObjectId, required): Reference to User
- `customerDetails` (Object):
  - `name`, `email`, `phone`, `address`, `city`, `postalCode`, `country`
- `orderItems` (Array of Objects):
  - Each item: `{ _id, name, price, quantity, image, productId }`
- `subtotal` (Number): Sum of item totals
- `deliveryFee` (Number): Delivery charge
- `totalAmount` (Number): subtotal + deliveryFee
- `deliveryMethod` (String): "Home Delivery" or "Pickup"
- `orderStatus` (String): Current order status
- `createdAt` (Date): Order creation time
- `updatedAt` (Date): Last update time

#### Valid Order Statuses
1. **Pending** - Order received, awaiting processing
2. **Processing** - Order being prepared for shipment
3. **Preparing** - Items being packed/prepared
4. **Shipped** - Order left bakery, in transit
5. **Delivered** - Order received by customer
6. **Cancelled** - Order cancelled

#### Static Methods
```javascript
// Generate unique order number
Order.generateOrderNumber() → string

// Get order by order number
Order.findByOrderNumber(orderNumber) → Promise<order>

// Get orders by customer
Order.findByCustomer(customerId) → Promise<[orders]>
```

---

## Middleware

### Authentication Middleware (authMiddleware.js)

#### `authenticate(req, res, next)`
- **Purpose**: Verify JWT token and attach user to request
- **Expected Header**: `Authorization: Bearer {token}`
- **Logic**:
  1. Extract token from Authorization header
  2. Verify token signature
  3. Extract user ID from token payload
  4. Attach user to `req.user`
  5. Call next()
- **Errors**:
  - 401: No token provided
  - 401: Invalid token
  - 401: Token expired
- **Usage**: Applied to protected routes

#### `authorizeAdmin(req, res, next)`
- **Purpose**: Verify user is admin
- **Usage**: Applied to admin-only routes
- **Logic**:
  1. Check if `req.user.isAdmin` is true
  2. Continue if admin
  3. Return 403 if not admin
- **Requires**: `authenticate` middleware first

---

### Upload Middleware (uploadMiddleware.js)

#### Multer Configuration
```javascript
const upload = multer({
  dest: 'public/uploads/',
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB max
  }
});
```

#### Middleware Usage
- `upload.single('image')` - Single file upload (e.g., product image)
- `upload.array('images', 10)` - Multiple file upload (max 10)

---

## Configuration

### Database Configuration (config/db.js)

```javascript
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
```

### Environment Variables (.env)

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hatemalo_bakery
# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Upload
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

---

## Error Handling

### Global Error Handler

```javascript
// Centralized error handling
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});
```

### Custom Error Classes

#### ValidationError
- Used for input validation failures
- Status: 400

#### AuthenticationError
- Used for auth failures
- Status: 401

#### AuthorizationError
- Used for permission denials
- Status: 403

#### NotFoundError
- Used when resource doesn't exist
- Status: 404

#### ServerError
- Used for server issues
- Status: 500

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "details": "additional info"
  }
}
```

---

## Authentication & Security

### JWT Implementation

#### Token Structure
```javascript
Header: { alg: "HS256", typ: "JWT" }
Payload: {
  userId: "ObjectId",
  isAdmin: boolean,
  iat: timestamp,
  exp: timestamp
}
Signature: SHA256(header.payload.secret)
```

#### Token Expiry
- Default: 7 days
- Set in JWT_EXPIRY environment variable

#### Token Storage (Frontend)
- Stored in localStorage
- Included in Authorization header for API calls
- Cleared on logout

### Password Security

#### Hashing
- Algorithm: Bcrypt
- Salt rounds: 10
- Hash before storing in database
- Never store plain passwords

#### Validation
- Minimum 6 characters
- Case sensitive
- Special characters allowed

### Security Best Practices

1. ✅ Passwords hashed with bcrypt
2. ✅ JWT tokens for authentication
3. ✅ CORS enabled for frontend domain only
4. ✅ Environment variables for secrets
5. ✅ Input validation on all endpoints
6. ✅ Admin check for sensitive operations
7. ✅ File upload validation
8. ✅ HTTP headers security (helmet)
9. ✅ Rate limiting (recommended)
10. ✅ HTTPS enforced in production

---

## File Upload & Image Management

### Upload Process

#### 1. Single File Upload (Product Image)
```javascript
// Route with upload middleware
POST /products
Middleware: authenticate, authorizeAdmin, upload.single('image')

// In controller
const filename = req.file.filename;
// Save filename to database
```

#### 2. File Storage
- Location: `server/public/uploads/`
- Naming: Multer auto-generates unique names
- Format: `image-{timestamp}.jpg`

#### 3. Image URL Construction
```javascript
// Frontend
const imageUrl = `${API_URL}/uploads/${product.image}`;
```

#### 4. Image Retrieval
- Served from `public/uploads/` directory
- Direct HTTP access via Express static middleware

#### 5. Image Deletion
```javascript
// When product deleted
const fs = require('fs');
const imagePath = path.join('public/uploads', product.image);
fs.unlinkSync(imagePath);
```

---

## Data Seeding

### Seed Script (seed.js)

#### Seed Data Included
1. **Initial Products** (100+ bakery items):
   - Cakes, cookies, breads, pastries, etc.
   - Each with name, description, price, image
   - Assigned to categories

2. **Categories** (10+):
   - Breads, Cakes, Cookies, Pastries, etc.
   - Each with description and image

3. **Users** (optional):
   - Sample admin user
   - Sample customer users

#### Running Seed
```bash
node seed.js
```

#### What It Does
1. Connects to MongoDB
2. Clears existing data (optional)
3. Creates categories
4. Creates products
5. Creates users
6. Logs statistics

---

## Installation & Setup

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/hatemalo-bakery.git
cd hatemalo-bakery/server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment
```bash
# Copy template
cp .env.example .env

# Edit .env with your values
# - MongoDB connection string
# - JWT secret
# - CORS origin (frontend URL)
```

### Step 4: Seed Database
```bash
npm run seed
# or
node seed.js
```

### Step 5: Start Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

### Step 6: Test Endpoints
```bash
# Use Postman or curl
curl http://localhost:5000/api/products
```

---

## Deployment

### Vercel Deployment

#### 1. Create vercel.json
```json
{
  "buildCommand": "npm install",
  "devCommand": "npm run dev",
  "outputDirectory": ".",
  "functions": {
    "api/server.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

#### 2. Environment Variables
- Add to Vercel project settings:
  - MONGODB_URI
  - JWT_SECRET
  - NODE_ENV=production
  - CORS_ORIGIN=frontend_url

#### 3. Deploy
```bash
npm i -g vercel
vercel
```

### MongoDB Atlas Setup

1. Create account at mongodb.com/atlas
2. Create cluster
3. Add IP to whitelist
4. Create database user
5. Copy connection string
6. Add to MONGODB_URI in .env

### Production Checklist

- [ ] HTTPS enabled
- [ ] MongoDB on production (Atlas)
- [ ] Environment variables set
- [ ] CORS configured for production domain
- [ ] Error logging enabled
- [ ] Rate limiting implemented
- [ ] Backup strategy in place
- [ ] Monitoring enabled
- [ ] API documentation updated
- [ ] Security headers set

---

## API Best Practices

### Request-Response Format
```javascript
// Successful response (GET)
{
  "success": true,
  "data": { ...resource }
}

// Successful response (POST)
{
  "success": true,
  "message": "Created successfully",
  "data": { ...created_resource }
}

// Error response
{
  "success": false,
  "message": "Error description"
}
```

### Status Codes Used
- 200: OK - Successful GET/PUT
- 201: Created - Successful POST
- 400: Bad Request - Validation error
- 401: Unauthorized - Missing/invalid token
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 500: Internal Server Error

### Pagination Pattern
```javascript
GET /api/products?limit=20&skip=0

Response:
{
  "success": true,
  "data": [...products],
  "total": 150,
  "limit": 20,
  "skip": 0
}
```

---

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Real-time order updates (Socket.io)
- [ ] Product reviews and ratings
- [ ] Inventory alerts
- [ ] Admin analytics dashboard
- [ ] Customer notification preferences
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Promotional codes/coupons
