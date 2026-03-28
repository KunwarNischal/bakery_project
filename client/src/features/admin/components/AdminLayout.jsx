/**
 * AdminLayout Component - Main layout for admin dashboard pages
 *
 * Features:
 * - Admin sidebar with navigation to dashboard, products, orders, categories
 * - Responsive layout for mobile and desktop
 * - Manages global admin state (products, orders, categories)
 * - Delete confirmation modal
 * - Category management modal (add/edit categories)
 * - Error handling with retry button
 * - Loading state with spinner
 * - Protected route - checks admin session on mount
 */

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '@/shared/services/api';
import { useFetch } from '@/shared/hooks/useFetch';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import DeleteModal from '@/features/admin/components/DeleteModal';
import AdminSidebar from './AdminSidebar';
import CategoryModal from './CategoryModal';


const AdminLayout = () => {
    // Navigation hook for redirecting
    const navigate = useNavigate();

    // Check admin session on component mount
    const { isAdminAuthenticated, logout } = useAuth();
    const { addToast } = useCart();
    
    useEffect(() => {
        if (!isAdminAuthenticated) {
            // Show error message if session expired or not an admin
            addToast('Session expired. Please login again.', 'error');
            // Redirect to admin login
            navigate('/admin/login');
        }
    }, [isAdminAuthenticated, navigate, addToast]);


    // State for mobile menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // State for new category name input
    const [newCategory, setNewCategory] = useState('');
    // State for category/product search input
    const [searchTerm, setSearchTerm] = useState('');
    // State to toggle showing all products vs paginated view
    const [showAllProducts, setShowAllProducts] = useState(false);
    // State to toggle showing all orders vs paginated view
    const [showAllOrders, setShowAllOrders] = useState(false);
    // State to toggle showing all categories vs paginated view
    const [showAllCategories, setShowAllCategories] = useState(false);
    // State for category modal visibility
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    // State for delete confirmation modal
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null, title: '', message: '' });
    // State for tracking if we're editing an existing category
    const [isCategoryEdit, setIsCategoryEdit] = useState(false);
    // State for storing the category being edited
    const [editingCategory, setEditingCategory] = useState(null);
    // State for filtering products by stock level
    const [stockFilter, setStockFilter] = useState('all');

    // Fetch products from API with refetch capability
    const { data: productsData, setData: setProducts, loading: productsLoading, error: productsError, refetch: refetchProducts } = useFetch('/products');
    // Fetch orders from API with refetch capability
    const { data: ordersData, setData: setOrders, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useFetch('/orders');
    // Fetch categories from API with refetch capability
    const { data: categoriesData, setData: setCategories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useFetch('/categories');


    // Normalize data - ensure we have arrays
    const products = productsData || [];
    const orders = ordersData || [];
    const categories = categoriesData || [];

    // Check if any data is still loading
    const loading = productsLoading || ordersLoading || categoriesLoading;
    // Check if there's any error loading data
    const error = productsError || ordersError || categoriesError;


    /**
     * Delete an item (product, category, or order) from the database
     * @param {string} id - ID of the item to delete
     * @param {string} type - Type of item: 'product', 'category', or 'order'
     */
    const executeDelete = async (id, type) => {
        if (type === 'product') {
            // Delete product and refresh list
            await api.delete(`/products/${id}`);
            await refetchProducts();
        } else if (type === 'category') {
            // Delete category and refresh list
            await api.delete(`/categories/${id}`);
            await refetchCategories();
        } else if (type === 'order') {
            // Delete order and refresh list
            await api.delete(`/orders/${id}`);
            await refetchOrders();
        }
    };


    /**
     * Show delete confirmation modal for a product
     * @param {string} id - Product ID to delete
     */
    const handleDeleteProduct = (id) => {
        setDeleteModal({
            isOpen: true,
            type: 'product',
            id,
            title: 'Delete Product?',
            message: 'Are you sure you want to remove this treat from your menu? This action cannot be undone.'
        });
    };

    /**
     * Show delete confirmation modal for a category
     * @param {string} id - Category ID to delete
     */
    const handleDeleteCategory = (id) => {
        setDeleteModal({
            isOpen: true,
            type: 'category',
            id,
            title: 'Delete Category?',
            message: 'Are you sure? Removing a category might make its products look a bit lonely!'
        });
    };

    /**
     * Show delete confirmation modal for an order
     * @param {string} id - Order ID to delete
     */
    const handleDeleteOrder = (id) => {
        setDeleteModal({
            isOpen: true,
            type: 'order',
            id,
            title: 'Cancel Order?',
            message: 'Are you sure you want to delete this order record? This will permanently remove it from your history.'
        });
    };

    /**
     * Confirm deletion - execute delete and show success message
     */
    const handleDeleteConfirm = async () => {
        const { type, id } = deleteModal;
        try {
            // Execute the delete API call
            await executeDelete(id, type);
            // Show success message
            addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, 'success');
        } catch (err) {
            // Show error message if delete fails
            addToast(err.response?.data?.message || `Failed to delete ${type}`, 'error');
        }
        // Close the modal
        setDeleteModal({ ...deleteModal, isOpen: false });
    };


    /**
     * Handle admin logout - clear session and redirect to login
     */
    const handleLogout = () => {
        // Logout only the admin session using auth context
        logout('admin');
        // Show success message
        addToast('Logged out successfully', 'success');
        // Redirect to admin login page
        navigate('/admin/login');
    };

    /**
     * Handle category form submission - add new or update existing category
     * @param {Event} e - Form submit event
     */
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        // Validate that category name is not empty
        if (!newCategory.trim()) return;
        try {
            if (isCategoryEdit) {
                // Update existing category
                const { data } = await api.put(`/categories/${editingCategory._id}`, { name: newCategory });
                addToast('Category updated!', 'success');
            } else {
                // Create new category
                const { data } = await api.post('/categories', { name: newCategory });
                addToast('Category created!', 'success');
            }
            // Refresh category list
            await refetchCategories();
            // Clear form inputs
            setNewCategory('');
            setSearchTerm('');
            // Close modal and reset edit state
            setIsCategoryModalOpen(false);
            setIsCategoryEdit(false);
            setEditingCategory(null);
        } catch (err) {
            // Show error message if submission fails
            addToast(err.response?.data?.message || `Failed to ${isCategoryEdit ? 'update' : 'add'} category`, 'error');
        }
    };

    /**
     * Handle edit category button click - open modal with category data
     * @param {object} cat - Category object to edit
     */
    const handleEditCategoryClick = (cat) => {
        // Set edit mode to true
        setIsCategoryEdit(true);
        // Store the category being edited
        setEditingCategory(cat);
        // Pre-fill form with current category name
        setNewCategory(cat.name);
        // Open modal
        setIsCategoryModalOpen(true);
    };

    // Context object to pass admin data and functions to child pages
    const adminContextData = {
        // Product, order, and category data
        products: products || [],
        orders: orders || [],
        categories: categories || [],
        // Search and filter states
        searchTerm,
        setSearchTerm,
        stockFilter,
        setStockFilter,
        // Pagination states
        showAllProducts,
        setShowAllProducts,
        showAllOrders,
        setShowAllOrders,
        showAllCategories,
        setShowAllCategories,
        // Delete handlers
        handleDeleteProduct,
        handleDeleteOrder,
        handleDeleteCategory,
        // Category edit handler
        handleEditCategoryClick,
        // Category modal control
        setIsCategoryModalOpen,
        // Data setters for direct updates
        setOrders,
        setProducts,
        setCategories,
        // Refetch functions to reload data from API
        refetchProducts,
        refetchOrders,
        refetchCategories
    };


    return (
        <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
            <AdminSidebar
                setIsMenuOpen={setIsMenuOpen}
                isMenuOpen={isMenuOpen}
                handleLogout={handleLogout}
            />

            <div className="flex-1 p-4 md:p-8">
                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={20} />
                            <div>
                                <p className="font-semibold">Error loading data</p>
                                <p className="text-sm">{error}</p>
                                {error.includes('401') && <p className="text-xs mt-1">Your session may have expired. Try logging in again.</p>}
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap text-sm font-medium"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 size={40} className="animate-spin text-light-brown" />
                    </div>
                )}

                {!loading && (
                    <Outlet context={adminContextData} />
                )}
            </div>

            <CategoryModal
                isOpen={isCategoryModalOpen}
                isCategoryEdit={isCategoryEdit}
                editingCategory={editingCategory}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                setIsCategoryModalOpen={setIsCategoryModalOpen}
                setIsCategoryEdit={setIsCategoryEdit}
                setEditingCategory={setEditingCategory}
                handleCategorySubmit={handleCategorySubmit}
            />

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleDeleteConfirm}
                title={deleteModal.title}
                message={deleteModal.message}
            />
        </div>
    );
};

export default AdminLayout;
