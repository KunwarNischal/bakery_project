/**
 * Admin Dashboard Page Component
 *
 * This is the main admin dashboard showing business analytics and key metrics.
 * It displays:
 * - Total number of products
 * - Number of active orders (not delivered/cancelled)
 * - Total number of product categories
 * - Inventory health (low stock and out of stock items)
 * - Recent orders overview
 * - Quick action buttons to view detailed pages
 *
 * This page gives admin a quick overview of business status.
 */

import React from 'react';
import { Package, ShoppingBag, Clock, Layers } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // Get context data from parent AdminLayout
  const context = useOutletContext();
  const navigate = useNavigate();

  if (!context) {
    return <div>Loading...</div>;
  }

  // Destructure data from context
  const { products, orders, categories, setStockFilter } = context;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-brown">Business Analytics</h1>
        <p className="text-gray-500">Real-time insights into your bakery's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Products</p>
            <p className="text-2xl font-black text-dark-brown">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Orders</p>
            <p className="text-2xl font-black text-dark-brown">{orders.filter(o => !['Delivered', 'Cancelled'].includes(o.orderStatus)).length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Categories</p>
            <p className="text-2xl font-black text-dark-brown">{categories.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-dark-brown mb-6 flex items-center gap-2">
            <Package size={22} className="text-light-brown" /> Inventory Health
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm font-bold">
                <span className="text-gray-500">Low Stock Items</span>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 font-black">{products.filter(p => p.stock > 0 && p.stock <= 10).length}</span>
                  <button
                    onClick={() => { setStockFilter('low'); navigate('/admin/products'); }}
                    className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded hover:bg-orange-600 hover:text-white transition-colors uppercase font-black"
                  >View</button>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm font-bold">
                <span className="text-gray-500">Out of Stock</span>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-black">{products.filter(p => p.stock === 0).length}</span>
                  <button
                    onClick={() => { setStockFilter('out'); navigate('/admin/products'); }}
                    className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded hover:bg-red-600 hover:text-white transition-colors uppercase font-black"
                  >View</button>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm font-bold">
                <span className="text-gray-500">Healthy Stock</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-black">{products.filter(p => p.stock > 10).length}</span>
                  <button
                    onClick={() => { setStockFilter('healthy'); navigate('/admin/products'); }}
                    className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded hover:bg-green-600 hover:text-white transition-colors uppercase font-black"
                  >View</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-dark-brown mb-6 flex items-center gap-2">
            <ShoppingBag size={22} className="text-light-brown" /> Order Flow
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
              <p className="text-4xl font-black text-dark-brown">{orders.length}</p>
            </div>
            <div className="bg-cream p-6 rounded-2xl border border-light-brown/10">
              <p className="text-[10px] font-black text-light-brown uppercase tracking-widest mb-1">Total Revenue</p>
              <p className="text-2xl font-black text-dark-brown">Rs. {orders.filter(o => o.orderStatus === 'Delivered').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Clock size={16} />
            </div>
            <p className="text-xs font-bold text-blue-800">Tracking performance since site launch</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-dark-brown mb-6 flex items-center gap-2">
          <Layers size={22} className="text-light-brown" /> Menu Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 6).map(cat => {
            const count = products.filter(p => p.category === cat.name).length;
            return (
              <div key={cat._id} className="p-4 rounded-2xl border border-gray-100 hover:border-light-brown/30 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-dark-brown text-sm">{cat.name}</span>
                  <span className="text-xs font-bold text-light-brown">{count} items</span>
                </div>
              </div>
            );
          })}
          {categories.length > 6 && (
            <button
              onClick={() => navigate('/admin/categories')}
              className="flex items-center justify-center p-4 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-bold hover:border-light-brown/50 hover:text-light-brown hover:bg-light-brown/5 transition-all group"
            >
              +{categories.length - 6} more categories
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

