/**
 * Customer Registration Page Component
 *
 * This page allows new customers to create an account.
 * Features include:
 * - Name, email, and password input fields
 * - Password confirmation field to prevent typos
 * - Form validation (name length, email format, password match)
 * - Show/hide password toggles for both password fields
 * - Error messages for validation issues
 * - Link to login page for existing customers
 * - After registration, user is sent to login page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/shared/hooks/useToast';
import { registerCustomer } from '@/features/auth/services/authService';

const CustomerRegister = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    // Toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    // Toggle confirm password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form data for registration
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    // Track which fields have been interacted with
    const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });
    // Store validation error messages
    const [formErrors, setFormErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    // Store server errors (e.g., email already exists)
    const [authError, setAuthError] = useState('');
    // Track if registration is being submitted
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate individual field based on field name and value
    const validate = (name, value) => {
        if (name === 'name') {
            if (!value) return 'Name is required';
            if (value.length < 2) return 'Name must be at least 2 characters long';
        }
        if (name === 'email') {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        }
        if (name === 'password') {
            if (!value) return 'Password is required';
            if (value.length < 6) return 'Password must be at least 6 characters long';
        }
        if (name === 'confirmPassword') {
            if (!value) return 'Please confirm your password';
            if (value !== formData.password) return 'Passwords do not match';
        }
        return '';
    };

    // Handle form input changes and validate if field has been touched
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (touched[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: validate(name, value),
                // If password changes, also revalidate confirm password
                ...(name === 'password' && touched.confirmPassword ? { confirmPassword: validate('confirmPassword', formData.confirmPassword) } : {})
            }));
        }
    };

    // Mark field as touched and validate when user leaves the field
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFormErrors(prev => ({
            ...prev,
            [name]: validate(name, value)
        }));
    };

    // Handle registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

        // Validate all fields before submitting
        const nameErr = validate('name', formData.name);
        const emailErr = validate('email', formData.email);
        const passErr = validate('password', formData.password);
        const confirmPassErr = validate('confirmPassword', formData.confirmPassword);

        if (nameErr || emailErr || passErr || confirmPassErr) {
            setFormErrors({ name: nameErr, email: emailErr, password: passErr, confirmPassword: confirmPassErr });
            setTouched({ name: true, email: true, password: true, confirmPassword: true });
            return;
        }

        setIsSubmitting(true);
        try {
            // Send registration request to server
            await registerCustomer({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            // Dispatch event to update auth state throughout app
            window.dispatchEvent(new Event('authchange'));
            addToast('Account created Successfully. Please log in!', 'success');
            // Redirect to login page after successful registration
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.message || error || 'Registration failed';
            setAuthError(msg);
            addToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center pt-24 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6">
                <div className="text-center mb-6">
                    <div className="mx-auto h-12 w-12 bg-light-brown/10 rounded-full flex items-center justify-center mb-2 text-light-brown">
                        <User size={24} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-dark-brown">Create Account</h2>
                    <p className="mt-1 text-xs text-gray-500">Join our sweet bakery family!</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="bg-red-50 text-red-600 p-2 rounded-xl text-xs font-medium">
                            {typeof authError === 'string' ? authError : authError?.toString()}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown text-sm ${touched.name && formErrors.name ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="John Doe"
                        />
                        {touched.name && formErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown text-sm ${touched.email && formErrors.email ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="your@email.com"
                        />
                        {touched.email && formErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown text-sm ${touched.password && formErrors.password ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-light-brown transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {touched.password && formErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown text-sm ${touched.confirmPassword && formErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-light-brown transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {touched.confirmPassword && formErrors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-2 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-4 text-center border-t border-gray-200 pt-4">
                    <p className="text-gray-700 text-xs mb-2">Already have an account?</p>
                    <Link to="/login" className="text-light-brown hover:text-dark-brown font-bold transition-colors text-xs">
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default CustomerRegister;
