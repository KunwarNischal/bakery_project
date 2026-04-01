import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/hooks/useToast';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [touched, setTouched] = useState({ email: false, password: false });
    const [errors, setErrors] = useState({ email: '', password: '' });

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

    const handleEmailChange = (e) => {
        const val = e.target.value;
        setEmail(val);
        if (touched.email) setErrors(prev => ({ ...prev, email: validate('email', val) }));
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        if (touched.password) setErrors(prev => ({ ...prev, password: validate('password', val) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

        const emailErr = validate('email', email);
        const passErr = validate('password', password);

        if (emailErr || passErr) {
            setErrors({ email: emailErr, password: passErr });
            setTouched({ email: true, password: true });
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await loginAdmin(email, password);

            if (data.isAdmin) {
                login(data, data.accessToken || data.token, 'admin');

                addToast(`Welcome back, ${data.name}!`, 'success');
                navigate('/admin/dashboard');
            } else {
                setAuthError('Not authorized as an admin');
                addToast('Not authorized as an admin', 'error');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials';
            setAuthError(msg);
            addToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 mb-10">
                <img src="/logo.png" alt="HateMalo Bakery" className="h-20 w-auto rounded-full shadow-md" />
                <h1 className="text-4xl md:text-5xl font-black text-dark-brown tracking-tighter">
                    HateMalo <span className="text-light-brown">Bakery</span>
                </h1>
            </div>

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-light-brown/10 rounded-full flex items-center justify-center mb-4 text-light-brown">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-dark-brown">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to manage your bakery
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                            {typeof authError === 'string' ? authError : authError?.toString()}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown ${touched.email && errors.email ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="admin@hatemalo.com"
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                className={`w-full px-4 py-3 pr-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-brown bg-white text-dark-brown ${touched.password && errors.password ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-light-brown transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {touched.password && errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-3 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
