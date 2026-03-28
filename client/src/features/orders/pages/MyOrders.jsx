/**
 * My Orders Page Component
 *
 * This page displays all orders placed by the logged-in customer.
 * Features include:
 * - View all customer orders with order details
 * - Search orders by Order ID
 * - Filter orders by status (Pending, Preparing, Delivered, etc.)
 * - Show order items, amounts, and delivery information
 * - Display order status with icons
 * - Pagination (show 2 orders by default, "Show More" button)
 * - Requires customer to be logged in
 *
 * If not logged in, user is redirected to login page.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, Search } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/hooks/useToast';
import { getImageUrl, PLACEHOLDER_IMAGE } from '@/shared/utils/imageUtils';
import { useFetch } from '@/shared/hooks/useFetch';
import { ORDER_STATUSES, getStatusColor } from '@/assets/data';
import { API_ENDPOINTS } from '@/config/constants';

const MyOrders = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    // Get logged-in customer information from AuthContext
    const { customer: customerInfo } = useAuth();
    // Fetch customer's orders from the server - always fetch fresh data, don't use cache
    const { data: fetchedOrders, loading: ordersLoading, error: ordersError, refetch } = useFetch(API_ENDPOINTS.ORDERS.MY_ORDERS, { skipCache: true });
    // Search input for filtering orders by ID
    const [searchTerm, setSearchTerm] = useState('');
    // Status filter dropdown (all, Pending, Delivered, etc.)
    const [selectedStatus, setSelectedStatus] = useState('all');
    // Toggle to show all orders or just first 2
    const [showAllOrders, setShowAllOrders] = useState(false);
    // Track if we've already refetched on mount
    const hasRefetched = useRef(false);

    // Check if customer is logged in, redirect to login if not
    useEffect(() => {
        if (!customerInfo) {
            navigate('/login');
        }
    }, [navigate, customerInfo]);

    // Ensure orders are refetched when component mounts and customer is available
    useEffect(() => {
        if (customerInfo && refetch && !hasRefetched.current) {
            hasRefetched.current = true;
            refetch();
        }
    }, [customerInfo, refetch]);

    // Handle session expired - redirect to login if token is invalid
    useEffect(() => {
        if (ordersError) {
            addToast('Session expired. Please login again.', 'error');
            navigate('/login');
        }
    }, [ordersError, navigate, addToast]);

    // Use fetched orders or empty array
    const orders = fetchedOrders || [];
    const loading = ordersLoading;

    // Get appropriate icon for each order status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <Clock size={18} />;
            case 'Preparing':
                return <Package size={18} />;
            case 'Processing':
                return <Package size={18} />;
            case 'Shipped':
                return <Truck size={18} />;
            case 'Delivered':
                return <CheckCircle size={18} />;
            case 'Cancelled':
                return <ShoppingBag size={18} />;
            default:
                return <Package size={18} />;
        }
    };

    // Filter orders by search term and status
    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        // Search by order number, full ID, or last 6 characters of ID
        const matchesSearch =
            (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
            order._id.toLowerCase().includes(searchLower) ||
            order._id.slice(-6).toLowerCase().includes(searchLower);
        const matchesStatus = selectedStatus === 'all' || order.orderStatus === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // Show loading spinner while fetching orders
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="text-center">
                    <p className="text-gray-500 font-display text-xl animate-pulse">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-cream via-white to-light-brown/10 pt-32 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-dark-brown mb-2">My Orders</h1>
                        <p className="text-gray-600">Welcome, <span className="font-bold text-light-brown">{customerInfo?.name}</span>!</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by Order ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-light-brown focus:ring-2 focus:ring-light-brown/20"
                            />
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-light-brown focus:ring-2 focus:ring-light-brown/20 font-medium"
                            >
                                <option value="all">All Orders</option>
                                {ORDER_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">
                            {orders.length === 0 ? "You haven't placed any orders yet." : `No orders match your search.`}
                        </p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="mt-6 bg-light-brown text-white font-bold py-3 px-8 rounded-xl hover:bg-dark-brown transition-all"
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {(showAllOrders ? filteredOrders : filteredOrders.slice(0, 2)).map(order => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="grid grid-cols-6 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase">Order ID</p>
                                            <p className="text-sm font-bold text-dark-brown">{order.orderNumber || `#${order._id.slice(-6)}`}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase">Name</p>
                                            <p className="text-sm font-bold text-dark-brown">{order.customerDetails?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase">Phone</p>
                                            <p className="text-sm font-bold text-dark-brown">{order.customerDetails?.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase">Date</p>
                                            <p className="text-sm font-bold text-dark-brown">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase">Amount</p>
                                            <p className="text-sm font-bold text-light-brown">Rs. {order.totalAmount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase">Status</p>
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                                                {getStatusIcon(order.orderStatus)}
                                                {order.orderStatus}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 py-3 border-b border-gray-200">
                                    <div className="space-y-2">
                                        {order.orderItems?.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded bg-cream border border-gray-200 shrink-0">
                                                    <img
                                                        src={getImageUrl(item.image)}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                                                    />
                                                </div>
                                                <div className="flex-1 text-xs">
                                                    <p className="font-bold text-dark-brown truncate">{item.name}</p>
                                                    <p className="text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-dark-brown text-xs whitespace-nowrap">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                        {order.orderItems?.length > 2 && (
                                            <p className="text-xs text-gray-500 font-medium">+{order.orderItems.length - 2} more items</p>
                                        )}
                                    </div>
                                </div>

                                <div className="px-4 py-3 border-b border-gray-200 bg-white">
                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-600 font-medium">Subtotal</p>
                                            <p className="font-bold text-dark-brown">Rs. {(order.totalAmount - order.deliveryFee).toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-600 font-medium">Delivery</p>
                                            <p className="font-bold text-dark-brown">{order.deliveryMethod} - Rs. {order.deliveryFee?.toFixed(2) || '0.00'}</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                                            <p className="font-bold text-dark-brown uppercase">Total</p>
                                            <p className="font-bold text-light-brown">Rs. {order.totalAmount?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredOrders.length > 2 && (
                            <div className="flex justify-center gap-4 mt-8">
                                {!showAllOrders && (
                                    <button
                                        onClick={() => setShowAllOrders(true)}
                                        className="bg-light-brown text-white font-bold py-3 px-12 rounded-xl hover:bg-dark-brown transition-all"
                                    >
                                        Show More
                                    </button>
                                )}
                                {showAllOrders && (
                                    <button
                                        onClick={() => setShowAllOrders(false)}
                                        className="bg-light-brown text-white font-bold py-3 px-12 rounded-xl hover:bg-dark-brown transition-all"
                                    >
                                        Show Less
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
