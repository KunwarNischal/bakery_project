import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/common/LoginForm';
import { useFormManager } from '../../hooks';
import api from '../../services/api';
import toast from 'react-hot-toast';

/**
 * AdminLogin Page
 * Admin authentication page using reusable LoginForm component
 * Handles admin-specific login and token storage
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const form = useFormManager({
    initialValues: {
      email: '',
      password: ''
    },
    validations: {
      email: [
        { required: true, message: 'Email is required' },
        { pattern: 'email', message: 'Invalid email format' }
      ],
      password: [
        { required: true, message: 'Password is required' },
        { minLength: 6, message: 'Password must be at least 6 characters' }
      ]
    },
    onSubmit: async (values) => {
      setAuthError('');
      try {
        const { data } = await api.post('/auth/login', values);

        if (data.isAdmin) {
          localStorage.setItem('userInfo', JSON.stringify(data));
          toast.success(`Welcome back, ${data.name}!`);
          navigate('/admin/dashboard');
        } else {
          const msg = 'Not authorized as an admin';
          setAuthError(msg);
          toast.error(msg);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Invalid credentials';
        setAuthError(msg);
        toast.error(msg);
      }
    }
  });

  return (
    <LoginForm
      form={form}
      title="Admin Portal"
      subtitle="Sign in to manage your bakery"
      authError={authError}
      onAuthErrorDismiss={() => setAuthError('')}
    />
  );
};

export default AdminLogin;
