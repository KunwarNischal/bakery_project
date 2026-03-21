import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { User, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

const AuthModal = ({ isOpen, setIsOpen, authMode, setAuthMode, setUser }) => {
  const { addToast } = useCart();
  const [cred, setCred] = useState({ name: '', email: '', pass: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(cred.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      let data;
      if (authMode === 'login') {
        const response = await api.post('/auth/login', { email: cred.email, password: cred.pass });
        data = response.data;
        addToast(`Welcome back, ${data.name}!`);
      } else {
        const response = await api.post('/auth/register', { name: cred.name, email: cred.email, password: cred.pass });
        data = response.data;
        addToast(`Welcome to Hatemalo Bakery, ${data.name}!`);
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      // Dispatch event so Navbar and other components know about login
      window.dispatchEvent(new Event('authchange'));
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-cream/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
      <div className="relative w-full max-w-md bg-white rounded-3xl p-10 shadow-xl animate-fade-in-up">
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-dark-brown transition-colors text-2xl font-light">✕</button>
        
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-light-brown/10 rounded-full flex items-center justify-center mb-4 text-light-brown">
             <User size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-dark-brown">
            {authMode === 'login' ? 'Customer Portal' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {authMode === 'login' ? 'Sign in to your account' : 'Join Hatemalo Bakery today'}
          </p>
        </div>

        <div className="flex gap-4 mb-6 p-1 bg-gray-100 rounded-xl">
          <button 
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'login' ? 'bg-white text-dark-brown shadow' : 'text-gray-500 hover:text-dark-brown'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'register' ? 'bg-white text-dark-brown shadow' : 'text-gray-500 hover:text-dark-brown'}`}
          >
            Register
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown" 
                placeholder="John Doe"
                value={cred.name}
                onChange={e => setCred({...cred, name: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown" 
              placeholder="customer@hatemalo.com"
              value={cred.email}
              onChange={e => setCred({...cred, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown" 
                  placeholder="••••••••"
                  value={cred.pass}
                  onChange={e => setCred({...cred, pass: e.target.value})}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-light-brown transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>
          <button disabled={loading} className="btn-primary w-full py-3 text-lg mt-2 disabled:opacity-50">
            {loading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Join Now')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
