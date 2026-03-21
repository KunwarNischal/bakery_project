import React from 'react';
import { Search, ShoppingBag, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { ORDER_STATUSES } from '../../constants/orderStatus';
import { updateOrderStatus } from '../../services/orderService';
import toast from 'react-hot-toast';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';

const OrdersManagement = () => {
  const context = useOutletContext();
  
  // Call hooks before any conditional returns
  const { searchTerm, setSearchTerm, filteredItems: filteredOrders } = useSearchAndFilter(
    context?.orders || [],
    (item, search) => 
      (item.orderNumber && item.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
      item._id.toLowerCase().includes(search.toLowerCase()) ||
      item.customerDetails?.name?.toLowerCase().includes(search.toLowerCase())
  );
  
  if (!context) {
    return <div>Loading...</div>;
  }

  const {
    showAllOrders,
    setShowAllOrders,
    handleDeleteOrder,
    setOrders
  } = context;

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success('Order status updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const OrderStatusDropdown = ({ order, onStatusChange }) => {
    return (
      <select
        className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide border-2 focus:outline-none cursor-pointer transition-all ${
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
        <table className="w-full text-left border-collapse min-w-[1150px]">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200 uppercase text-sm tracking-wider text-gray-700 font-bold whitespace-nowrap">
              <th className="p-4 w-24">Order ID</th>
              <th className="p-4 w-24">Customer</th>
              <th className="p-4 w-16">Phone</th>
              <th className="p-4 w-24">Email</th>
              <th className="p-4 w-20">Address</th>
              <th className="p-4 w-20">Items</th>
              <th className="p-4 w-16">Date</th>
              <th className="p-4 w-16">Total</th>
              <th className="p-4 w-20">Payment</th>
              <th className="p-4 w-16">Status</th>
              <th className="p-4 w-16 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="11" className="p-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <ShoppingBag size={40} className="text-gray-200" />
                    <p>{searchTerm ? `No orders matching "${searchTerm}"` : 'No orders placed yet. Delicious things take time!'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.slice(0, showAllOrders ? undefined : 10).map(order => (
                <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group border-b border-gray-100">
                  <td className="p-4 font-mono text-sm font-bold text-dark-brown">{order.orderNumber || `#${order._id}`}</td>
                  <td className="p-4 font-bold text-sm text-dark-brown">{order.customerDetails?.name}</td>
                  <td className="p-4 text-sm text-gray-700 font-semibold">{order.customerDetails?.phone}</td>
                  <td className="p-4 text-sm text-gray-600 truncate">{order.customerDetails?.email}</td>
                  <td className="p-4 text-sm text-gray-600 truncate max-w-[150px]">{order.customerDetails?.address}</td>
                  <td className="p-4">
                    <div className="space-y-2">
                      {order.orderItems?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-cream border border-gray-100 shrink-0 shadow-sm">
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
                        <p className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-50 rounded">
                          +{order.orderItems.length - 2} more
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700 font-semibold">
                    {new Date(order.createdAt || order.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="p-4 font-bold text-sm text-dark-brown">Rs. {order.totalAmount}</td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 rounded-lg font-bold text-xs uppercase tracking-wider bg-blue-100 text-blue-700 truncate max-w-[110px]">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4">
                    <OrderStatusDropdown order={order} onStatusChange={handleOrderStatusChange} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="h-8 w-8 inline-flex items-center justify-center bg-gray-50 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm opacity-0 group-hover:opacity-100"
                      title="Delete Order"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
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
