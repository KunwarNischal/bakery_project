/**
 * Main App Component - Root component of the Hatemalo Bakery application
 *
 * This component serves as the main container for the entire application. It:
 * - Sets up the router for navigation between pages
 * - Initializes the shopping cart context provider
 * - Manages global state for user, products, and categories
 * - Provides a layout with navbar, footer, and cart drawer
 * - Displays toast notifications for user feedback
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';

import AppRoutes from './routes.jsx';
import { INITIAL_PRODUCTS, CATEGORIES } from './assets/data';
import { useCart } from './hooks/useCart';
import { useFetch } from './hooks/useFetch';

/**
 * ToastContainer component - Displays notification messages to users
 * Shows success and error messages in the top-right corner of the screen
 * Auto-dismisses after 3 seconds
 */
const ToastContainer = () => {
  // Get toast notifications from the cart context to display to user
  const { toasts } = useCart();
  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3">
      {toasts.map(toast => (
        <div key={toast.id} className={`px-6 py-4 rounded-2xl shadow-2xl border-l-4 animate-slide-in-right ${toast.type === 'success' ? 'bg-primary text-white border-secondary' : 'bg-red-600 text-white border-red-800'}`}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Layout component - Wraps page content with common UI elements (navbar, footer, cart)
 * Handles conditional rendering of layout elements based on whether the user is in admin or client section
 * Manages the display of animations and global styles
 */
const Layout = ({ children, setUser, setIsCartOpen, user, isCartOpen }) => {
  // Get current page location to determine if we're in admin section
  const location = useLocation();
  // Check if current path is an admin path
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background text-textMain font-body selection:bg-secondary/30">
      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.4s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      <ToastContainer />
      
      {!isAdmin && (
        <Navbar 
          setIsCartOpen={setIsCartOpen} 
        />
      )}
      
      <main>
        {children}
      </main>

      {!isAdmin && <Footer />}

      <CartDrawer 
        isOpen={isCartOpen} 
        setIsOpen={setIsCartOpen} 
      />

    </div>
  );
};

export default function App() {
  // User authentication state - stores logged-in user info or null if not logged in
  const [user, setUser] = useState(null);
  // Products state - stores all available products from the bakery
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  // Categories state - stores all product categories for filtering
  const [categories, setCategories] = useState(CATEGORIES);
  // Shopping cart drawer visibility state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products from backend API
  const { data: fetchedProducts } = useFetch('/products');
  // Fetch categories from backend API
  const { data: fetchedCategories } = useFetch('/categories');

  // Update products state when new products are fetched from API
  useEffect(() => {
    if (fetchedProducts && fetchedProducts.length > 0) {
      setProducts(fetchedProducts);
    }
  }, [fetchedProducts]);

  // Update categories state when new categories are fetched from API
  useEffect(() => {
    if (fetchedCategories && fetchedCategories.length > 0) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  return (
    <CartProvider>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, style: { borderRadius: '16px', background: '#3d2b1f', color: '#fff' } }} />
      <Router>
        <Layout 
          user={user} 
          setUser={setUser} 
          isCartOpen={isCartOpen} 
          setIsCartOpen={setIsCartOpen} 
        >
          <AppRoutes 
            products={products} 
            categories={categories} 
          />
        </Layout>
      </Router>
    </CartProvider>
  );
}