import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Eye, EyeOff } from 'lucide-react';
import { loginCustomer, registerCustomer } from '../../services/authService';
import { useFormManager } from '../../hooks';
import LoginForm from '../../components/common/LoginForm';

/**
 * CustomerLogin Page
 * Customer authentication page with login and register modes
 * Uses LoginForm component for login UI
 */
const CustomerLogin = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const form = useFormManager({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validations: {
      name: [
        { required: !isLoginMode, message: 'Name is required' },
        { minLength: 2, message: 'Name must be at least 2 characters', when: !isLoginMode }
      ],
      email: [
        { required: true, message: 'Email is required' },
        { pattern: 'email', message: 'Invalid email format' }
      ],
      password: [
        { required: true, message: 'Password is required' },
        { minLength: 6, message: 'Password must be at least 6 characters' }
      ],
      confirmPassword: [
        { required: !isLoginMode, message: 'Please confirm your password' },
        { match: 'password', message: 'Passwords do not match', when: !isLoginMode }
      ]
    },
    onSubmit: async (values) => {
      setAuthError('');
      try {
        if (isLoginMode) {
          await loginCustomer(values.email, values.password);
          window.dispatchEvent(new Event('authchange'));
          toast.success('Welcome back! 🎉');
          navigate('/my-orders');
        } else {
          await registerCustomer(values.name, values.email, values.password);
          window.dispatchEvent(new Event('authchange'));
          toast.success('Account created! Welcome to Hatemalo! 🎉');
          navigate('/my-orders');
        }
      } catch (error) {
        const msg = error || 'Authentication failed';
        setAuthError(msg);
        toast.error(msg);
      }
    }
  });

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    form.resetForm();
    setAuthError('');
  };

  // Login Mode - Use LoginForm component
  if (isLoginMode) {
    return (
      <LoginForm
        form={form}
        title={isLoginMode ? 'Sign In' : 'Create Account'}
        subtitle={isLoginMode ? 'Welcome back to our bakery!' : 'Join our sweet bakery family!'}
        authError={authError}
        onAuthErrorDismiss={() => setAuthError('')}
        footer={
          <div className="text-center">
            <p className="text-gray-700 text-sm mb-3">
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="text-light-brown hover:text-dark-brown font-bold transition-colors"
            >
              {isLoginMode ? 'Create one now' : 'Sign in instead'}
            </button>
          </div>
        }
      />
    );
  }

  // Register Mode - Custom form
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 bg-light-brown/10 rounded-full flex items-center justify-center mb-2 text-light-brown">
            <User size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-dark-brown">
            Create Account
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Join our sweet bakery family!
          </p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit}>
          {authError && (
            <div className="bg-red-50 text-red-600 p-2 rounded-xl text-xs font-medium">
              {authError}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.values.name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown text-sm ${
                form.touched.name && form.errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="John Doe"
            />
            {form.touched.name && form.errors.name && (
              <p className="text-red-500 text-xs mt-1">{form.errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown text-sm ${
                form.touched.email && form.errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="your@email.com"
            />
            {form.touched.email && form.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className={`w-full px-3 py-2 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown text-sm ${
                  form.touched.password && form.errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-light-brown transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.touched.password && form.errors.password && (
              <p className="text-red-500 text-xs mt-1">{form.errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.values.confirmPassword}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className={`w-full px-3 py-2 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown text-sm ${
                  form.touched.confirmPassword && form.errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-light-brown transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.touched.confirmPassword && form.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{form.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={form.isSubmitting}
            className="btn-primary w-full py-2 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {form.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center border-t border-gray-200 pt-4">
          <p className="text-gray-700 text-xs mb-2">
            Already have an account?
          </p>
          <button
            type="button"
            onClick={toggleMode}
            className="text-light-brown hover:text-dark-brown font-bold transition-colors text-xs"
          >
            Sign in instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
