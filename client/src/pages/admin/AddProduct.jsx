import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useFetchData } from '../../hooks/useFetchData';
import ProductForm from '../../components/admin/ProductForm';

/**
 * AddProduct Page
 * Product creation page using reusable ProductForm component
 * Handles form submission and product creation via API
 */
const AddProduct = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthCheck('admin', { redirectTo: '/admin' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories using custom hook
  const { data: categories = [], loading: categoriesLoading } = useFetchData(
    () => api.get('/categories').then(res => res.data),
    [],
    (error) => toast.error('Failed to load categories'),
    { initialData: [] }
  );

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    const { name, price, category, stock, description, image } = formData;

    const uploadFormData = new FormData();
    uploadFormData.append('name', name);
    uploadFormData.append('price', price);
    uploadFormData.append('category', category);
    uploadFormData.append('stock', stock);
    uploadFormData.append('description', description);
    if (image) {
      uploadFormData.append('image', image);
    }

    try {
      await api.post('/products', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`${name} created successfully!`, {
        icon: '🧁',
        style: { borderRadius: '16px', background: '#3d2b1f', color: '#fff' }
      });
      navigate('/admin/dashboard', { state: { activeTab: 'products' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard', { state: { activeTab: 'products' } });
  };

  return (
    <ProductForm
      mode="create"
      categories={categories}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={categoriesLoading}
      isSubmitting={isSubmitting}
    />
  );
};

export default AddProduct;
