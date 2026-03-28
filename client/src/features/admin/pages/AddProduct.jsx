/**
 * Add New Product Page Component
 *
 * This page allows admins to add new bakery products.
 * Features include:
 * - Product form with fields: name, category, price, stock, description
 * - Image upload with preview
 * - Form validation
 * - Success/error notifications
 * - Automatic category selection
 * - After creation, redirects to Products Management page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Save, Upload, XCircle } from 'lucide-react';
import api from '@/shared/services/api';
import { useToast } from '@/shared/hooks/useToast';
import { useFetch } from '@/shared/hooks/useFetch';

const AddProduct = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    // Get refetchProducts function from parent AdminLayout to refresh product list
    const { refetchProducts } = useOutletContext();
    // Track image upload state
    const [uploading, setUploading] = useState(false);
    // Store selected image file
    const [image, setImage] = useState(null);
    // Store image preview URL for UI display
    const [imagePreview, setImagePreview] = useState(null);

    // Product form fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');

    // Fetch all categories from server
    const { data: categoriesResult, loading: categoriesLoading } = useFetch('/categories');
    const categories = categoriesResult || [];

    // Auto-select first category when categories load
    useEffect(() => {
        if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0]._id);
        }
    }, [categories, categoryId]);

    // Handle image file selection and create preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview URL for image display
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle product creation form submission
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setUploading(true);

        // Get category name for product
        const selectedCategory = categories.find(cat => cat._id === categoryId);
        const categoryName = selectedCategory?.name || '';

        // Prepare form data for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('categoryId', categoryId);
        formData.append('category', categoryName);
        formData.append('stock', stock);
        formData.append('description', description);

        // Add image if selected
        if (image) {
            formData.append('image', image);
        }

        try {
            // Send product creation request to server
            await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            addToast('Product Created Successfully!', 'success');

            // Refresh products list in parent component
            await refetchProducts();
            // Redirect to products management page
            navigate('/admin/products');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to create product', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/products')} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-dark-brown cursor-pointer">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-dark-brown">Add New Treat</h1>
                            <p className="text-gray-500">Create a delicious new addition to your menu</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <form onSubmit={handleCreateProduct} className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Product Name</label>
                                    <input
                                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown"
                                        placeholder="e.g. Dreamy Vanilla Cake"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Price (Rs.)</label>
                                        <input
                                            type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown"
                                            placeholder="1500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Stock</label>
                                        <input
                                            type="number" required value={stock} onChange={(e) => setStock(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown"
                                            placeholder="10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category</label>
                                    <select
                                        value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown bg-white"
                                    >
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Description</label>
                                    <textarea
                                        required rows="4" value={description} onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown resize-none"
                                        placeholder="Describe your delicious creation..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Product Image</label>
                                <div
                                    className={`relative aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${imagePreview ? 'border-light-brown' : 'border-gray-200 bg-gray-50'}`}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setImage(null); setImagePreview(null); }}
                                                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-md hover:text-red-700 transition-all"
                                            >
                                                <XCircle size={24} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-8">
                                            <div className="mx-auto h-16 w-16 bg-light-brown/10 rounded-full flex items-center justify-center mb-4 text-light-brown">
                                                <Upload size={32} />
                                            </div>
                                            <p className="text-gray-500 font-medium mb-4">Click below to upload a photo</p>
                                            <input
                                                type="file"
                                                id="image-upload"
                                                className="hidden"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="px-6 py-2 bg-light-brown text-white rounded-full font-bold cursor-pointer hover:bg-dark-brown transition-all inline-block"
                                            >
                                                Select File
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 text-center"
                            >
                                Discard Changes
                            </button>
                            <button
                                type="submit" disabled={uploading}
                                className="flex-1 bg-light-brown text-white py-4 rounded-xl font-bold hover:bg-dark-brown transition-all shadow-lg shadow-light-brown/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {uploading ? 'Creating Treat...' : 'Save & Publish Treat'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;

