import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, UserCircle, Package } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getCustomerInfo, logoutCustomer, verifyCustomer } from '../../services/authService';

const Navbar = ({ setIsCartOpen }) => {
  const { cart, addToast } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [customerInfoState, setCustomerInfoState] = useLocalStorage('customerInfo', null, { sync: true });
  const [customerInfo, setCustomerInfo] = useState(customerInfoState);
  const profileRef = useRef(null);

  // Verify customer on mount to check if user still exists in database
  useEffect(() => {
    const verifyCustomerExistence = async () => {
      const currentCustomerInfo = customerInfo || getCustomerInfo();
      if (currentCustomerInfo && currentCustomerInfo.token) {
        // Silently verify in background
        const verified = await verifyCustomer(currentCustomerInfo.token).catch(() => null);
        if (!verified) {
          // User not found or token invalid, logout silently
          logoutCustomer();
          setCustomerInfo(null);
          setCustomerInfoState(null);
        } else {
          setCustomerInfo(verified);
        }
      }
    };
    verifyCustomerExistence();
  }, []);

  // Listen for storage changes (when user logs in from AuthModal)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedInfo = getCustomerInfo();
      setCustomerInfo(updatedInfo);
      setCustomerInfoState(updatedInfo);
    };

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event from AuthModal
    window.addEventListener('authchange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authchange', handleStorageChange);
    };
  }, []);

  // Toggle menu state
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Close profile dropdown when clicking outside
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

  // Disable scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  const handleCustomerLogout = () => {
    logoutCustomer();
    setCustomerInfo(null);
    // Dispatch event so other components know about logout
    window.dispatchEvent(new Event('authchange'));
    addToast('See you soon! 👋');
    setIsProfileOpen(false);
    closeMenu();
    navigate('/');
  };

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

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-primary">
        {navLinks.map(v => (
          <Link key={v.name} to={v.path} className={`hover:text-secondary transition-colors ${location.pathname === v.path ? 'text-secondary font-extrabold' : ''}`}>{v.name}</Link>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Actions Button Group */}
        <div className="flex items-center gap-1 md:gap-2">
          {customerInfo?.role === 'admin' && (
            <Link to="/admin" className="p-2 text-primary hover:text-secondary transition-all rounded-lg hover:bg-primary/5">⚙️</Link>
          )}

          {/* Customer Profile Dropdown */}
          {customerInfo && (
            <div ref={profileRef} className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 text-primary group hover:bg-primary/5 rounded-lg transition-all"
                title="Profile"
              >
                <UserCircle size={24} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-primary/10 rounded-lg shadow-xl z-50 overflow-hidden">
                  <Link 
                    to="/my-orders" 
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-6 py-3 text-primary hover:bg-primary/5 transition-colors font-bold text-sm flex items-center gap-2 border-b border-primary/10"
                  >
                    <Package size={18} /> My Orders
                  </Link>
                  <button 
                    onClick={handleCustomerLogout}
                    className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition-colors font-bold text-sm flex items-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
          
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-primary group hover:bg-primary/5 rounded-lg transition-all">
            <span className="text-2xl group-hover:scale-110 transition-transform block">🛒</span>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md ring-2 ring-white z-10">{cart.length}</span>}
          </button>
        </div>

        {/* Auth Button (Desktop and Tablet) */}
        <div className="hidden sm:block">
          {!customerInfo && (
            <Link to="/login" className="px-6 py-2 bg-light-brown text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-dark-brown transition-all shadow-md flex items-center gap-2">
              <UserCircle size={12} /> Login
            </Link>
          )}
        </div>

        {/* Hamburger Toggle */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-lg transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (Drawer) */}
      {isMenuOpen && (
        <>
          {/* Backdrop for the dropdown drawer as well */}
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
