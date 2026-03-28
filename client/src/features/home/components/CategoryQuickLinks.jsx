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


const CategoryQuickLinks = ({ categories }) => {
  // Use navigate hook to go to menu page
  const navigate = useNavigate();

  /**
   * Handle category click - navigates to menu page with selected category
   * @param {string} categoryName - Name of the selected category
   */
  const handleCategoryClick = (categoryName) => {
    // Navigate to menu page with category as query parameter
    navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="font-display text-3xl font-bold text-center mb-12 text-primary">Browse by Category</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(cat => (
          <button
            key={cat._id || cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className="flex flex-col items-center px-5 py-3 bg-cardBg border border-primary/10 rounded-2xl hover:bg-secondary hover:text-white hover:border-secondary hover:shadow-md transition-all duration-200 group min-w-22.5"
            title={cat.name}
          >
            <span className="font-semibold text-sm text-primary group-hover:text-white transition-colors">
              {cat.name}
            </span>
            <span className="text-[10px] text-secondary group-hover:text-white/80 transition-colors mt-0.5">
              {cat.itemCount ?? 0} Items
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryQuickLinks;
