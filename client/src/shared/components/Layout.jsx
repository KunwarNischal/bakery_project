import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/features/cart/components/CartDrawer';
import Toast from './Toast';
import { useToast } from '@/shared/hooks/useToast';

/**
 * Main application layout wrapper
 * Renders the global Navbar and Footer around dynamic page content
 * Skips customer-facing elements when on admin routes
 */
const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { toasts } = useToast();

  // Check if we are on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Toast Container - Top Right Corner */}
        <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Navigation */}
      <Navbar setIsCartOpen={setIsCartOpen} />

      {/* Shopping Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

      {/* Main Content Area - padded top to account for fixed navbar */}
      <main className="flex-grow pt-[80px]">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
      
      {/* Toast Container - Top Right Corner */}
      <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
          />
        ))}
      </div>
    </div>
  );
};

export default Layout;
