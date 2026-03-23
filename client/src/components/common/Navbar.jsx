/**
 * Navbar Component - Main navigation bar for the Hatemalo Bakery website
 *
 * Features:
 * - Logo and branding
 * - Navigation links (Home, Menu, Story, Contact)
 * - User authentication UI (Login/Logout buttons)
 * - User profile dropdown with order history link
 * - Shopping cart button with item count badge
 * - Admin access link (only visible to admin users)
 * - Mobile menu with hamburger toggle
 * - Responsive design for all screen sizes
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, UserCircle, Package } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { getCustomerInfo, logoutCustomer, verifyCustomer } from '../../services/api';

const Navbar = ({ setIsCartOpen }) => {
  // Get cart data and toast function from cart context
  const { cart, addToast } = useCart();
  // Get current page location to highlight active nav link
  const location = useLocation();
  // Navigation utility hook
  const navigate = useNavigate();
  // State for mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State for user profile dropdown visibility
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // State for current logged-in customer info
  const [customerInfo, setCustomerInfo] = useState(getCustomerInfo());
  // Ref to detect clicks outside profile dropdown
  const profileRef = useRef(null);

  // Verify customer session is still valid on component mount
  useEffect(() => {
    const verifyCustomerExistence = async () => {
      const currentCustomerInfo = customerInfo || getCustomerInfo();
      if (currentCustomerInfo && currentCustomerInfo.token) {
        // Check if user session token is still valid
        const verified = await verifyCustomer(currentCustomerInfo.token).catch(() => null);
        if (!verified) {
          // If not valid, log them out
          logoutCustomer();
          setCustomerInfo(null);
        } else {
          // Update with fresh customer data
          setCustomerInfo(verified);
        }
      }
    };
    verifyCustomerExistence();
  }, []);

  // Listen for authentication changes (login/logout) from other tabs or components
  useEffect(() => {
    const handleStorageChange = () => {
      // Update customer info when auth status changes
      const updatedInfo = getCustomerInfo();
      setCustomerInfo(updatedInfo);
    };

    // Listen for storage changes (from other tabs) and custom auth events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authchange', handleStorageChange);

    return () => {
      // Clean up listeners on unmount
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authchange', handleStorageChange);
    };
  }, []);

  // Toggle mobile menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  // Close mobile menu
  const closeMenu = () => setIsMenuOpen(false);

  // Close profile dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // Close mobile menu when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  /**
   * Handle customer logout - clear session and update UI
   */
  const handleCustomerLogout = () => {
    // Clear customer info from storage
    logoutCustomer();
    // Clear local state
    setCustomerInfo(null);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authchange'));
    // Show goodbye message
    addToast('See you soon! 👋');
    // Close profile dropdown
    setIsProfileOpen(false);
    // Close mobile menu
    closeMenu();
    // Redirect to home page
    navigate('/');
  };

  // Navigation links configuration
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Our Story', path: '/story' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-primary/5 px-8 h-28 flex justify-between items-center shadow-md">
      <Link to="/" className="flex items-center gap-6 cursor-pointer group">
        <img src="/logo.png" alt="Hatemalo Bakery Logo" className="w-20 h-20 rounded-full object-cover group-hover:rotate-12 transition-transform shadow-2xl border-2 border-primary/10" />
        <div className="flex flex-col">
          <h1 className="font-display text-4xl font-bold text-primary tracking-tighter leading-none">Hatemalo</h1>
          <p className="text-sm uppercase tracking-[0.45em] font-bold text-secondary mt-1">Bakery & Cafe</p>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-primary">
        {navLinks.map(v => (
          <Link key={v.name} to={v.path} className={`hover:text-secondary transition-colors ${location.pathname === v.path ? 'text-secondary font-extrabold' : ''}`}>{v.name}</Link>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2">
          {customerInfo?.role === 'admin' && (
            <Link to="/admin" className="p-2 text-primary hover:text-secondary transition-all rounded-lg hover:bg-primary/5">⚙️</Link>
          )}

          {customerInfo && (
            <div ref={profileRef} className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="px-4 py-2 bg-gradient-to-r from-light-brown to-secondary text-white rounded-full transition-all flex items-center gap-2 font-bold text-sm shadow-lg hover:shadow-xl hover:from-dark-brown hover:to-secondary hover:-translate-y-0.5 duration-300"
                title="Profile"
              >
                <UserCircle size={18} className="text-white/90" />
                <span className="hidden sm:inline">{customerInfo.name}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-fade-in-up">
                  <div className="bg-gradient-to-r from-light-brown/10 to-secondary/10 px-6 py-5 border-b border-gray-100">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="p-3 bg-light-brown/20 rounded-full text-light-brown">
                        <UserCircle size={32} />
                      </div>
                      <div className="w-full">
                        <p className="font-bold text-dark-brown text-base leading-tight truncate">{customerInfo.name}</p>
                        <p className="text-xs text-gray-500 break-words mt-1">{customerInfo.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link 
                      to="/my-orders" 
                      onClick={() => setIsProfileOpen(false)}
                      className={`block px-6 py-3 font-bold text-sm flex items-center gap-3 group transition-colors rounded-lg mx-2 ${
                        location.pathname === '/my-orders'
                          ? 'bg-gradient-to-r from-light-brown/20 to-secondary/20 text-dark-brown border-l-4 border-light-brown'
                          : 'text-dark-brown hover:bg-light-brown/10'
                      }`}
                    >
                      <Package size={18} className={`${location.pathname === '/my-orders' ? 'text-dark-brown font-bold' : 'text-light-brown group-hover:text-dark-brown'}`} /> 
                      <span>My Orders</span>
                    </Link>
                    <button 
                      onClick={handleCustomerLogout}
                      className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition-colors font-bold text-sm flex items-center gap-3 group"
                    >
                      <LogOut size={18} className="text-red-500 group-hover:text-red-700" /> 
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-primary group hover:bg-primary/5 rounded-lg transition-all">
            <span className="text-2xl group-hover:scale-110 transition-transform block">🛒</span>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md ring-2 ring-white z-10">{cart.length}</span>}
          </button>
        </div>

        <div className="hidden sm:block">
          {!customerInfo && (
            <Link to="/login" className="px-6 py-2 bg-light-brown text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-dark-brown transition-all shadow-md flex items-center gap-2">
              <UserCircle size={12} /> Login
            </Link>
          )}
        </div>

        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-lg transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 top-28 bg-primary/10 backdrop-blur-sm z-40 md:hidden" onClick={closeMenu}></div>
          <div className="fixed top-28 left-0 right-0 bg-background shadow-2xl z-50 md:hidden rounded-b-[2rem] border-b border-primary/5 animate-fade-in-up">
            <div className="px-6 py-10 space-y-4">
              {navLinks.map(v => (
                <Link 
                  key={v.name} 
                  to={v.path} 
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-display text-3xl font-bold uppercase tracking-[0.2em] transition-all group ${location.pathname === v.path ? 'bg-primary text-white shadow-xl translate-x-4' : 'text-primary hover:bg-primary/5'}`}
                >
                  <span className="text-sm opacity-60">→</span>
                  {v.name}
                </Link>
              ))}

              {customerInfo && (
                <Link 
                  to="/my-orders" 
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-display text-3xl font-bold uppercase tracking-[0.2em] transition-all group ${location.pathname === '/my-orders' ? 'bg-primary text-white shadow-xl translate-x-4' : 'text-primary hover:bg-primary/5'}`}
                >
                  <Package size={24} />
                  My Orders
                </Link>
              )}
              
              <div className="pt-6 mt-6 border-t border-primary/5 flex flex-col gap-4">
                {customerInfo ? (
                  <button onClick={handleCustomerLogout} className="w-full py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-secondary transition-all">Logout</button>
                ) : (
                  <Link to="/login" onClick={closeMenu} className="w-full py-4 bg-light-brown text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-dark-brown transition-all flex items-center justify-center gap-2">
                    <UserCircle size={12} />Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
