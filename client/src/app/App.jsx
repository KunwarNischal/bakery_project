import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { CartProvider } from '../features/cart/context/CartContext';
import Layout from '../shared/components/Layout';
import ErrorBoundary from '../shared/components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <AppRoutes />
            </Layout>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;