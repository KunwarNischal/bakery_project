import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('../pages/client/Home'));
const Menu = lazy(() => import('../pages/client/Menu'));
const ProductDetails = lazy(() => import('../pages/client/ProductDetails'));
const Contact = lazy(() => import('../pages/client/Contact'));
const Story = lazy(() => import('../pages/client/Story'));
const Checkout = lazy(() => import('../pages/client/Checkout'));
const MyOrders = lazy(() => import('../pages/client/MyOrders'));
const AdminLayout = lazy(() => import('../layout/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const CustomerLogin = lazy(() => import('../pages/client/CustomerLogin'));
const AddProduct = lazy(() => import('../pages/admin/AddProduct'));
const EditProduct = lazy(() => import('../pages/admin/EditProduct'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const ProductsManagement = lazy(() => import('../pages/admin/ProductsManagement'));
const OrdersManagement = lazy(() => import('../pages/admin/OrdersManagement'));
const CategoriesManagement = lazy(() => import('../pages/admin/CategoriesManagement'));

const AppRoutes = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-display text-xl animate-pulse text-secondary">Hatemalo is loading...</div>}>
      <Routes>
        <Route path="/" element={<Home products={products} categories={categories} onCategorySelect={handleCategorySelect} />} />
        <Route path="/menu" element={<Menu products={products} categories={categories} selectedCategory={selectedCategory} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/story" element={<Story />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Admin Layout with nested routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductsManagement />} />
          <Route path="/admin/orders" element={<OrdersManagement />} />
          <Route path="/admin/categories" element={<CategoriesManagement />} />
        </Route>

        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
