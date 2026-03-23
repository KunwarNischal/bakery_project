/**
 * CategoryModal Component - Modal for creating and editing product categories
 *
 * Features:
 * - Form to input category name
 * - Works in both "create new" and "edit existing" modes
 * - Cancel button to close without saving
 * - Submit button to create or update category
 * - Close button (X) in top-right corner
 * - Form validation (required field)
 */

import React from 'react';
import { X, Plus, Edit } from 'lucide-react';

const CategoryModal = ({
  isOpen,
  isCategoryEdit,
  editingCategory,
  newCategory,
  setNewCategory,
  setIsCategoryModalOpen,
  setIsCategoryEdit,
  setEditingCategory,
  handleCategorySubmit
}) => {
  // Don't render modal if not open
  if (!isOpen) return null;

  /**
   * Close the modal and reset all edit-related states
   */
  const handleClose = () => {
    // Close the modal
    setIsCategoryModalOpen(false);
    // Exit edit mode
    setIsCategoryEdit(false);
    // Clear the editing category
    setEditingCategory(null);
    // Clear the form input
    setNewCategory('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-dark-brown/40 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-brown">
              {isCategoryEdit ? 'Edit Category' : 'New Category'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleCategorySubmit}>
            <div className="mb-6">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Category Name
              </label>
              <input
                type="text"
                autoFocus
                required
                placeholder="e.g. Wedding Cakes"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown font-bold text-dark-brown"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-light-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-dark-brown transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isCategoryEdit ? <Edit size={18} /> : <Plus size={20} />}
                {isCategoryEdit ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;

