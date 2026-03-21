import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '../services/api';
import DeleteModal from '../components/common/DeleteModal';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import CategoryModal from '../components/admin/CategoryModal';
import { useFetchData } from '../hooks/useFetchData';
import { useApiCall } from '../hooks/useApiCall';
import { useAuthCheck } from '../hooks/useAuthCheck';

const AdminLayout = () => {
    const navigate = useNavigate();
    useAuthCheck('admin', { redirectTo: '/admin' });
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null, title: '', message: '' });
    const [isCategoryEdit, setIsCategoryEdit] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [stockFilter, setStockFilter] = useState('all');

    // Use custom hooks for data fetching
    const { data: fetchedProducts, loading: productsLoading, error: productsError } = useFetchData(
        () => api.get('/products').then(res => res.data),
        [],
        null,
        { initialData: [] }
    );

    const { data: fetchedOrders, loading: ordersLoading, error: ordersError } = useFetchData(
        () => api.get('/orders').then(res => res.data),
        [],
        null,
        { initialData: [] }
    );

    const { data: fetchedCategories, loading: categoriesLoading, error: categoriesError } = useFetchData(
        () => api.get('/categories').then(res => res.data),
        [],
        null,
        { initialData: [] }
    );

    // Combined loading and error states
    const loading = productsLoading || ordersLoading || categoriesLoading;
    const error = productsError || ordersError || categoriesError;

    // Keep products, orders, categories in sync with fetched data

    // Use custom hook for delete operations
    const { execute: executeDelete } = useApiCall(
        async (id, type) => {
            if (type === 'product') {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } else if (type === 'category') {
                await api.delete(`/categories/${id}`);
                setCategories(categories.filter(c => c._id !== id));
            } else if (type === 'order') {
                await api.delete(`/orders/${id}`);
                setOrders(orders.filter(o => o._id !== id));
            }
        },
        {
            onSuccess: (result, type) => {
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, {
                    style: { borderRadius: '16px', background: '#3d2b1f', color: '#fff' }
                });
            },
            onError: (error, type) => {
                toast.error(error.response?.data?.message || `Failed to delete ${type}`);
            }
        }
    );

    const handleDeleteProduct = (id) => {
        setDeleteModal({
            isOpen: true,
            type: 'product',
            id,
            title: 'Delete Product?',
            message: 'Are you sure you want to remove this treat from your menu? This action cannot be undone.'
        });
    };

    const handleDeleteCategory = (id) => {
        setDeleteModal({
            isOpen: true,
            type: 'category',
            id,
            title: 'Delete Category?',
            message: 'Are you sure? Removing a category might make its products look a bit lonely!'
        });
    };

    const handleDeleteOrder = (id) => {
        setDeleteModal({
            isOpen: true,
            type: 'order',
            id,
            title: 'Cancel Order?',
            message: 'Are you sure you want to delete this order record? This will permanently remove it from your history.'
        });
    };

    const handleDeleteConfirm = async () => {
        const { type, id } = deleteModal;
        await executeDelete(id, type);
        setDeleteModal({ ...deleteModal, isOpen: false });
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        toast.success('Logged out successfully');
        navigate('/admin');
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        try {
            if (isCategoryEdit) {
                const { data } = await api.put(`/categories/${editingCategory._id}`, { name: newCategory });
                setCategories(categories.map(cat => cat._id === editingCategory._id ? data : cat));
                toast.success('Category updated!');
            } else {
                const { data } = await api.post('/categories', { name: newCategory });
                setCategories([...categories, data]);
                toast.success('Category created!');
            }
            setNewCategory('');
            setSearchTerm('');
            setIsCategoryModalOpen(false);
            setIsCategoryEdit(false);
            setEditingCategory(null);
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isCategoryEdit ? 'update' : 'add'} category`);
        }
    };

    const handleEditCategoryClick = (cat) => {
        setIsCategoryEdit(true);
        setEditingCategory(cat);
        setNewCategory(cat.name);
        setIsCategoryModalOpen(true);
    };

    // Props to pass to child pages via context or as layout state
    const adminContextData = {
        products: products.length > 0 ? products : fetchedProducts || [],
        orders: orders.length > 0 ? orders : fetchedOrders || [],
        categories: categories.length > 0 ? categories : fetchedCategories || [],
        searchTerm,
        setSearchTerm,
        stockFilter,
        setStockFilter,
        showAllProducts,
        setShowAllProducts,
        showAllOrders,
        setShowAllOrders,
        showAllCategories,
        setShowAllCategories,
        handleDeleteProduct,
        handleDeleteOrder,
        handleDeleteCategory,
        handleEditCategoryClick,
        setIsCategoryModalOpen,
        setOrders
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
            {/* Sidebar */}
            <AdminSidebar
                setIsMenuOpen={setIsMenuOpen}
                isMenuOpen={isMenuOpen}
                handleLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8">
                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
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

            {/* Category Modal */}
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

            {/* Delete Confirmation Modal */}
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
