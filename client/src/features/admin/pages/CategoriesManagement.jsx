/**
 * Categories Management Page Component
 *
 * This page allows admins to manage product categories.
 * Features include:
 * - View all categories in a table
 * - Search categories by name
 * - Add new categories via modal form
 * - Edit existing categories
 * - Delete categories
 * - Show number of products in each category
 * - Pagination with "Show More" button
 *
 * Categories help organize products and make browsing easier for customers.
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Layers } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const CategoriesManagement = () => {
  // Get context data from parent AdminLayout
  const context = useOutletContext();

  if (!context) {
    return <div>Loading...</div>;
  }

  // Get functions and data from parent context
  const {
    categories,
    products,
    showAllCategories,
    setShowAllCategories,
    handleDeleteCategory,
    handleEditCategoryClick,
    setIsCategoryModalOpen
  } = context;

  // Search input for filtering categories
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories by search term
  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-brown">Categories Management</h1>
          <p className="text-gray-500 mt-1">Organize your menu by creating and managing treat types.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown/20 focus:border-light-brown shadow-sm transition-all"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-light-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-dark-brown transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} /> Add Category
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 uppercase text-sm tracking-widest text-gray-700 font-bold">
                <th className="p-5">Category Name</th>
                <th className="p-5 text-center">Number of Items</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-12 text-center text-gray-400">
                    {searchTerm ? `No categories matching "${searchTerm}"` : 'No categories yet.'}
                  </td>
                </tr>
              ) : (
                filteredCategories.slice(0, showAllCategories ? undefined : 10).map(cat => (
                  <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 font-bold text-dark-brown text-base">{cat.name}</td>
                    <td className="p-5 text-center">
                      <span className="font-black text-dark-brown text-base">
                        {products.filter(p => p.category === cat.name).length}
                      </span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEditCategoryClick(cat)}
                        className="h-9 w-9 inline-flex items-center justify-center bg-gray-50 text-light-brown hover:bg-light-brown hover:text-white rounded-lg transition-all shadow-sm"
                        title="Edit Category"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="h-9 w-9 inline-flex items-center justify-center bg-gray-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                        title="Delete Category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredCategories.length > 10 && (
            <div className="p-4 text-center border-t border-gray-100">
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-light-brown hover:text-dark-brown font-bold text-sm transition-colors"
              >
                {showAllCategories ? 'Show Less' : 'Show All'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group">
          <div className="h-64 overflow-hidden relative">
            <img
              src="/categories-cover.png"
              alt="Bakery Items"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">HateMalo Selection</h2>
            </div>
          </div>
          <div className="p-8">
            <h3 className="font-bold text-xl text-dark-brown mb-4">Curate Your Menu</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Use categories to help customers find exactly what they're craving. A well-organized menu makes your treats even more irresistible.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream rounded-2xl p-6 border border-light-brown/10">
                <span className="text-[10px] font-black text-light-brown uppercase block mb-1">Total Categories</span>
                <span className="text-3xl font-black text-dark-brown leading-none">{categories.length}</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Menu Focus</span>
                <span className="text-lg font-bold text-dark-brown leading-tight">Handcrafted Excellence</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-light-brown/10 rounded-2xl text-light-brown">
              <Layers size={24} />
            </div>
            <h4 className="font-bold text-dark-brown">Admin Perspective</h4>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            "A diverse menu keeps the kitchen busy and the customers coming back. Keep experimenting with new treat types!"
          </p>
        </div>
      </div>
    </div>
  );
};
export default CategoriesManagement;
