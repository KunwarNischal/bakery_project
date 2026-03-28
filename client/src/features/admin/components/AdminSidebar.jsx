/**
 * AdminSidebar Component - Navigation sidebar for admin dashboard
 *
 * Features:
 * - Navigation links to dashboard, products, orders, and categories
 * - Logout button
 * - Responsive design (hamburger menu on mobile, sidebar on desktop)
 * - Highlights current active page
 * - Logo and branding display
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingBag, LogOut, Layers, Menu, X } from 'lucide-react';

const AdminSidebar = ({ setIsMenuOpen, isMenuOpen, handleLogout }) => {
  // Get current page location to highlight active nav link
  const location = useLocation();

  /**
   * Check if a navigation path is currently active
   * @param {string} path - The navigation path to check
   * @returns {boolean} True if this path is active or is a parent of current path
   */
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation items configuration - displayed in sidebar/menu
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/categories', label: 'Categories', icon: Layers }
  ];

  /**
   * Close mobile menu after navigating
   */
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-100">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-bold text-dark-brown">Hatemalo Bakery</span>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-dark-brown hover:bg-gray-100 rounded-lg transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`
        w-full md:w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300
        ${isMenuOpen ? 'fixed inset-x-0 top-14 bottom-0 z-90 p-6' : 'hidden md:flex p-6'}
      `}>
        <Link to="/" className="hidden md:flex items-center gap-2 mb-10 overflow-hidden hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover shrink-0" />
          <span className="font-bold text-lg text-dark-brown truncate">Hatemalo Bakery</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map(({ path, label, icon }) => {
            const Icon = icon;
            return (
              <Link
                key={path}
                to={path}
                onClick={handleNavClick}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive(path)
                    ? 'bg-light-brown text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              handleLogout();
              handleNavClick();
            }}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} className="mr-3" /> Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;

