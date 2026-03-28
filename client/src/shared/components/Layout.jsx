import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/features/cart/components/CartDrawer';

/**
 * Main application layout wrapper
 * Renders the global Navbar and Footer around dynamic page content
 * Skips customer-facing elements when on admin routes
 */
const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Check if we are on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
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
    </div>
  );
};

export default Layout;
