/**
 * Orders Management Page Component
 *
 * This page allows admins to manage all customer orders.
 * Features include:
 * - View all orders with detailed information
 * - Search orders by Order ID or customer name
 * - Update order status (Pending, Preparing, Shipped, Delivered, Cancelled)
 * - Delete orders with confirmation
 * - Display order items and pricing
 * - Color-coded status indicators
 * - Expandable order details
 * - Pagination with "Show More" button
 */

import React, { useState } from 'react';
import { Search, ShoppingBag, Trash2, ChevronDown } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { ORDER_STATUSES } from '../../assets/data';
import { updateOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';

const OrdersManagement = () => {
  // Get context data from parent AdminLayout
  const context = useOutletContext();
  // Track which order is expanded for details
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  // Search input for filtering orders
  const [searchTerm, setSearchTerm] = useState('');

  const orders = context?.orders || [];
  // Filter orders by search term (order number, ID, or customer name)
  const filteredOrders = orders.filter(item =>
    (item.orderNumber && item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!context) {
    return <div>Loading...</div>;
  }

  // Get functions from parent context
  const {
    showAllOrders,
    setShowAllOrders,
    handleDeleteOrder,
    setOrders
  } = context;

  // Handle order status change (Pending -> Preparing -> Shipped -> Delivered, etc.)
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      // Update order status on server
      await updateOrderStatus(orderId, newStatus);
      // Update local state to reflect change immediately
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success('Order status updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Dropdown component for changing order status
  const OrderStatusDropdown = ({ order, onStatusChange }) => {
    return (
      <select
        className={`px-3 py-1 rounded-lg text-sm font-bold tracking-wide border-2 focus:outline-none cursor-pointer transition-all ${
          order.orderStatus === 'Delivered'
            ? 'bg-green-100 text-green-700 border-green-300'
            : order.orderStatus === 'Cancelled'
              ? 'bg-red-100 text-red-700 border-red-300'
              : 'bg-orange-100 text-orange-700 border-orange-300'
        }`}
        value={order.orderStatus}
        onChange={e => onStatusChange(order._id, e.target.value)}
      >
        {ORDER_STATUSES.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-brown">Orders Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Order ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown/20 focus:border-light-brown text-sm w-full md:w-72 bg-white shadow-sm transition-all"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200 uppercase text-sm tracking-wider text-gray-700 font-bold whitespace-nowrap">
              <th className="p-3 w-14">Order ID</th>
              <th className="p-3 w-16">Customer</th>
              <th className="p-3 w-13">Phone</th>
              <th className="p-3 w-16">Email</th>
              <th className="p-3 w-24">Address</th>
              <th className="p-3 w-14">Items</th>
              <th className="p-3 w-11">Date</th>
              <th className="p-3 w-11">Total</th>
              <th className="p-3 w-20">Payment</th>
              <th className="p-3 w-16">Status</th>
              <th className="p-3 w-14">Notes</th>
              <th className="p-3 w-11 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="12" className="p-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <ShoppingBag size={40} className="text-gray-200" />
                    <p>{searchTerm ? `No orders matching "${searchTerm}"` : 'No orders placed yet. Delicious things take time!'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.slice(0, showAllOrders ? undefined : 10).map(order => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-blue-50/30 transition-colors group border-b border-gray-100">
                    <td className="p-3 font-mono text-sm font-bold text-dark-brown">{order.orderNumber || `#${order._id}`}</td>
                    <td className="p-3 font-bold text-sm text-dark-brown">{order.customerDetails?.name}</td>
                    <td className="p-3 text-sm text-gray-700 font-semibold">{order.customerDetails?.phone}</td>
                    <td className="p-3 text-sm text-gray-600 truncate">{order.customerDetails?.email}</td>
                    <td className="p-3 text-sm text-gray-600" title={order.customerDetails?.address}>{order.customerDetails?.address}</td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {order.orderItems?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="h-8 w-8 rounded-lg overflow-hidden bg-cream border border-gray-100 shrink-0 shadow-sm">
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-dark-brown truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-500">x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.orderItems?.length > 2 && (
                          <p className="text-xs text-gray-500 font-medium px-1 py-0.5 bg-gray-50 rounded">
                            +{order.orderItems.length - 2} more
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-700 font-semibold">
                      {new Date(order.createdAt || order.date).toLocaleDateString(undefined, {
                        year: '2-digit',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-3 font-bold text-sm text-dark-brown">₨{order.totalAmount}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-blue-100 text-blue-700">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      <OrderStatusDropdown order={order} onStatusChange={handleOrderStatusChange} />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                        className="px-2 py-1 bg-light-brown text-white text-xs font-bold rounded-lg hover:bg-dark-brown transition-colors flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>View</span>
                        <ChevronDown size={12} className={`transition-transform ${expandedOrderId === order._id ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="h-7 w-7 inline-flex items-center justify-center bg-gray-50 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                        title="Delete Order"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order._id && (
                    <tr className="bg-blue-50/20 border-b border-gray-100">
                      <td colSpan="12" className="p-3">
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <h4 className="font-bold text-dark-brown mb-1 text-sm">Order Notes:</h4>
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {order.customerDetails?.notes ? order.customerDetails.notes : 'N/A'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
        {filteredOrders.length > 10 && (
          <div className="p-4 text-center border-t border-gray-100">
            <button
              onClick={() => setShowAllOrders(!showAllOrders)}
              className="text-light-brown hover:text-dark-brown font-bold text-sm transition-colors"
            >
              {showAllOrders ? 'Show Less' : 'Show All'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
