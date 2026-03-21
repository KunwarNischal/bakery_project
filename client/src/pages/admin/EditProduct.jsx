import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getImageUrl } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useFetchData } from '../../hooks/useFetchData';
import ProductForm from '../../components/admin/ProductForm';

/**
 * EditProduct Page
 * Product editing page using reusable ProductForm component
 * Fetches product data and handles form submission for product updates
 */
const EditProduct = () => {
  const { id } = useParams();
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

  // Fetch product details using custom hook
  const { data: productData, loading: productLoading, error: productError } = useFetchData(
    () => api.get(`/products/${id}`).then(res => res.data),
    [id],
    (error) => toast.error('Failed to load product details'),
    { initialData: null }
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
      await api.put(`/products/${id}`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`${name} updated successfully!`, {
        icon: '✏️',
        style: { borderRadius: '16px', background: '#3d2b1f', color: '#fff' }
      });
      navigate('/admin/dashboard', { state: { activeTab: 'products' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard', { state: { activeTab: 'products' } });
  };

  // Prepare product data with image URL for form
  const productForForm = productData ? {
    ...productData,
    image: productData.image ? getImageUrl(productData.image) : null
  } : null;

  return (
    <ProductForm
      mode="edit"
      product={productForForm}
      categories={categories}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={productLoading || categoriesLoading}
      isSubmitting={isSubmitting}
    />
  );
};

export default EditProduct;
