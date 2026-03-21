import React from 'react';
import { Plus, Edit, Trash2, Search, Package, X } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';

const ProductsManagement = () => {
  const context = useOutletContext();
  
  // Call hooks before any conditional returns
  const { searchTerm, setSearchTerm, filters, setFilter, filteredItems } = useSearchAndFilter(
    context?.products || [],
    (item, search, filters) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesStock = filters.stock === 'all'
        ? true
        : filters.stock === 'low'
          ? (item.stock > 0 && item.stock <= 10)
          : filters.stock === 'out'
            ? item.stock === 0
            : item.stock > 10;
      return matchesSearch && matchesStock;
    },
    { stock: context?.stockFilter || 'all' }
  );

  if (!context) {
    return <div>Loading...</div>;
  }

  const {
    showAllProducts,
    setShowAllProducts,
    handleDeleteProduct
  } = context;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-brown">Products Management</h1>
        <div className="flex items-center gap-4">
          {filters.stock !== 'all' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-light-brown/10 text-light-brown rounded-xl border border-light-brown/20 animate-in fade-in zoom-in">
              <span className="text-xs font-black uppercase tracking-widest">Filter: {filters.stock}</span>
              <button onClick={() => setFilter('stock', 'all')} className="hover:bg-light-brown hover:text-white rounded-full p-0.5 transition-colors">
                <X size={14} />
              </button>
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown/20 focus:border-light-brown text-sm w-full md:w-72 bg-white shadow-sm transition-all"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <Link
            to="/admin/products/add"
            className="bg-light-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-dark-brown transition-all shadow-md flex items-center"
          >
            <Plus size={20} className="mr-2" /> Add New Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 uppercase text-sm tracking-widest text-gray-700 font-bold">
              <th className="p-5">Product</th>
              <th className="p-5">Category</th>
              <th className="p-5">Price</th>
              <th className="p-5">Stock Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Package size={40} className="text-gray-200" />
                    <p>{searchTerm ? `No products matching "${searchTerm}"` : filters.stock !== 'all' ? `No ${filters.stock} stock items found.` : 'No products found. Start by adding one!'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.slice(0, showAllProducts ? undefined : 10).map(product => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-cream border border-gray-100 shrink-0 shadow-sm">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.src = '/placeholder.png'; }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-dark-brown text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-[220px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1.5 bg-light-brown/10 text-light-brown text-xs font-bold rounded-lg uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="font-black text-dark-brown capitalize text-base">Rs. {product.price}</span>
                  </td>
                  <td className="p-5">
                    <span className="text-sm font-bold text-gray-700">{product.stock} in stock</span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="h-9 w-9 flex items-center justify-center bg-gray-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="h-9 w-9 flex items-center justify-center bg-gray-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filteredItems.length > 10 && (
          <div className="p-4 text-center border-t border-gray-100">
            <button
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="text-light-brown hover:text-dark-brown font-bold text-sm transition-colors"
            >
              {showAllProducts ? 'Show Less' : 'Show All'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;
