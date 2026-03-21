import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Lock, Eye, EyeOff } from 'lucide-react';
import FormField from './FormField';

/**
 * LoginForm Component
 * Reusable login form for both admin and customer authentication
 * Handles email/password validation and submission
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.form - Form object from useFormManager hook
 * @param {string} props.title - Form title (e.g., "Admin Portal", "Customer Login")
 * @param {string} props.subtitle - Subtitle text
 * @param {Function} props.onSubmit - Custom submit handler
 * @param {string} [props.authError] - Authentication error message
 * @param {Function} [props.onAuthErrorDismiss] - Clear auth error
 * @param {boolean} [props.showRememberMe] - Show remember me checkbox
 * @param {React.ReactNode} [props.footer] - Footer content (e.g., sign up link)
 * 
 * @example
 * const form = useFormManager({
 *   initialValues: { email: '', password: '' },
 *   validations: { ... },
 *   onSubmit: handleLogin
 * });
 * 
 * <LoginForm
 *   form={form}
 *   title="Admin Portal"
 *   subtitle="Sign in to manage your bakery"
 *   authError={error}
 *   onAuthErrorDismiss={() => setError('')}
 * />
 */
const LoginForm = ({
  form,
  title = 'Login',
  subtitle = 'Sign in to your account',
  onSubmit,
  authError,
  onAuthErrorDismiss,
  showRememberMe = false,
  footer
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleFormSubmit = async (e) => {
    try {
      await form.handleSubmit(e);
      onSubmit?.();
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <img 
          src="/logo.png" 
          alt="HateMalo Bakery" 
          className="h-20 w-auto rounded-full shadow-md" 
        />
        <h1 className="text-4xl md:text-5xl font-black text-dark-brown tracking-tighter">
          HateMalo <span className="text-light-brown">Bakery</span>
        </h1>
      </div>

      {/* Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
        {/* Card Header */}
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 bg-light-brown/10 rounded-full flex items-center justify-center mb-4 text-light-brown">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-dark-brown">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {subtitle}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          {/* Auth Error */}
          {authError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center justify-between">
              <span>{authError}</span>
              {onAuthErrorDismiss && (
                <button
                  type="button"
                  onClick={onAuthErrorDismiss}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all ${
                form.touched.email && form.errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-light-brown focus:ring-light-brown/20'
              }`}
            />
            {form.touched.email && form.errors.email && (
              <p className="text-red-500 text-sm mt-1">⚠ {form.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all ${
                  form.touched.password && form.errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-light-brown focus:ring-light-brown/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-light-brown transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {form.touched.password && form.errors.password && (
              <p className="text-red-500 text-sm mt-1">⚠ {form.errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          {showRememberMe && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-light-brown focus:ring-light-brown cursor-pointer"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={form.isSubmitting}
            className="w-full bg-light-brown text-white font-bold py-3 px-6 rounded-xl hover:bg-dark-brown transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {form.isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        {footer && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  form: PropTypes.shape({
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onSubmit: PropTypes.func,
  authError: PropTypes.string,
  onAuthErrorDismiss: PropTypes.func,
  showRememberMe: PropTypes.bool,
  footer: PropTypes.node
};

export default LoginForm;
