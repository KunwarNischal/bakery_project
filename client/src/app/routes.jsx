import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import Loader from '../shared/components/Loader';

// Lazy loading feature pages
const Home = lazy(() => import('../features/home/pages/Home'));
const ProductList = lazy(() => import('../features/products/pages/ProductList'));
const ProductDetails = lazy(() => import('../features/products/pages/ProductDetails'));
const Contact = lazy(() => import('../features/info/pages/Contact'));
const Story = lazy(() => import('../features/info/pages/Story'));

const Checkout = lazy(() => import('../features/orders/pages/Checkout'));
const MyOrders = lazy(() => import('../features/orders/pages/MyOrders'));

const CustomerLogin = lazy(() => import('../features/auth/pages/CustomerLogin'));
const CustomerRegister = lazy(() => import('../features/auth/pages/CustomerRegister'));
const AdminLogin = lazy(() => import('../features/auth/pages/AdminLogin'));

// Admin pages
const AdminLayout = lazy(() => import('../features/admin/components/AdminLayout'));
const Dashboard = lazy(() => import('../features/admin/pages/Dashboard'));
const ProductsManagement = lazy(() => import('../features/admin/pages/ProductsManagement'));
const AddProduct = lazy(() => import('../features/admin/pages/AddProduct'));
const EditProduct = lazy(() => import('../features/admin/pages/EditProduct'));
const OrdersManagement = lazy(() => import('../features/admin/pages/OrdersManagement'));
const CategoriesManagement = lazy(() => import('../features/admin/pages/CategoriesManagement'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/story" element={<Story />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Redirect */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/products/add" element={<AddProduct />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/categories" element={<CategoriesManagement />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

