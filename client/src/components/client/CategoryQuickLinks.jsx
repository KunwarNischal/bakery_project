/**
 * CategoryQuickLinks Component - Quick navigation to browse products by category
 *
 * Features:
 * - Displays all categories as clickable buttons
 * - Shows category icon and name
 * - Navigates to menu page with selected category pre-filtered
 * - Responsive grid layout (adapts from 2 to 10 columns)
 * - Hover effects for visual feedback
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getIconForCategory } from '../../assets/data';

const CategoryQuickLinks = ({ categories, onCategorySelect }) => {
  // Use navigate hook to go to menu page
  const navigate = useNavigate();

  /**
   * Handle category click - calls parent callback if provided and navigates to menu
   * @param {string} categoryName - Name of the selected category
   */
  const handleCategoryClick = (categoryName) => {
    // Call parent callback to set selected category filter
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
    // Navigate to menu page to show products from this category
    navigate('/menu');
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="font-display text-3xl font-bold text-center mb-12 text-primary">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
        {categories.map(cat => (
          <button 
            key={cat._id || cat.id} 
            onClick={() => handleCategoryClick(cat.name)}
            className="flex flex-col items-center gap-3 p-4 bg-cardBg rounded-2xl border border-primary/5 hover:border-secondary hover:shadow-lg transition-all group"
            title={cat.name}
          >
            <span className="text-3xl group-hover:scale-125 transition-transform">{getIconForCategory(cat.name)}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-primary text-center">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryQuickLinks;
