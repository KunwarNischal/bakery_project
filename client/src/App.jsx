import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/drawers/CartDrawer';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import { INITIAL_PRODUCTS, CATEGORIES } from './assets/data';
import { useCart } from './hooks/useCart';
import { getProducts, getCategories } from './services/productService';

// Toast sub-component to use context
const ToastContainer = () => {
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

const Layout = ({ children, setUser, setIsCartOpen, user, isCartOpen }) => {
  const location = useLocation();
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
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS); // Fallback to static data
  const [categories, setCategories] = useState(CATEGORIES); // Fallback to static data
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const prodData = await getProducts();
      if (prodData && prodData.length > 0) {
        setProducts(prodData);
      }
      const catData = await getCategories();
      if (catData && catData.length > 0) {
        setCategories(catData);
      }
    };
    fetchData();
  }, []);

  return (
    <ErrorBoundary title="Hatemalo Bakery - Something went wrong">
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
    </ErrorBoundary>
  );
}
