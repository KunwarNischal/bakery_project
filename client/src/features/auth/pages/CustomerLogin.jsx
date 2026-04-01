import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Eye, EyeOff } from 'lucide-react';
import { loginCustomer } from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/hooks/useToast';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [formErrors, setFormErrors] = useState({ email: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (name, value) => {
        if (name === 'email') {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        }
        if (name === 'password') {
            if (!value) return 'Password is required';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (touched[name]) {
            setFormErrors(prev => ({ ...prev, [name]: validate(name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFormErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

        const emailErr = validate('email', formData.email);
        const passErr = validate('password', formData.password);

        if (emailErr || passErr) {
            setFormErrors({ email: emailErr, password: passErr });
            setTouched({ email: true, password: true });
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await loginCustomer(formData.email, formData.password);
            if (data.isAdmin === true) {
                addToast('Admin accounts must use the admin login portal', 'error');
                setAuthError('Admin accounts must use the admin login portal');
                navigate('/admin/login');
                return;
            }
            login(data, data.accessToken || data.token, 'customer');
            
            addToast('Welcome back!', 'success');
            navigate('/my-orders');
        } catch (error) {
            const msg = error.response?.data?.message || 'Invalid credentials';
            setAuthError(msg);
            addToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center py-3 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6">
                <div className="text-center mb-6">
                    <div className="mx-auto h-12 w-12 bg-light-brown/10 rounded-full flex items-center justify-center mb-2 text-light-brown">
                        <User size={24} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-dark-brown">Login</h2>
                    <p className="mt-1 text-xs text-gray-500">Welcome back to our bakery family!</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="bg-red-50 text-red-600 p-2 rounded-xl text-xs font-medium">
                            {typeof authError === 'string' ? authError : authError?.toString()}
                        </div>
                    )}

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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-2 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-4 text-center border-t border-gray-200 pt-4">
                    <p className="text-gray-700 text-xs mb-2">Don't have an account?</p>
                    <Link to="/register" className="text-light-brown hover:text-dark-brown font-bold transition-colors text-xs">
                        Create one now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
