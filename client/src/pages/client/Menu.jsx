/**
 * Menu / Products Page Component
 *
 * This page displays all bakery products in a filterable grid.
 * Users can filter products by:
 * - Category (Breads, Cakes, Pastries, etc.)
 * - Price range (0 to 3000 rupees)
 * - Search term (search in product names)
 *
 * The page shows 20+ products in a responsive grid layout
 * with a sticky sidebar for easy filtering.
 */

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/client/ProductCard';
import { formatPrice } from '../../assets/data';
import { Search } from 'lucide-react';

const Menu = ({ products, categories, selectedCategory }) => {
  // Maximum price filter for the range slider (₨ 3000)
  const [priceRange, setPriceRange] = useState(3000);
  // Currently selected category filter
  const [selectedCat, setSelectedCat] = useState(selectedCategory || null);

  // Update selected category when the prop changes (e.g., from quick links)
  useEffect(() => {
    if (selectedCategory) {
      setSelectedCat(selectedCategory);
    }
  }, [selectedCategory]);

  // Search input text for filtering by product name
  const [search, setSearch] = useState('');

  // Filter products based on search, category, and price
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat ? (p.category === selectedCat || p.categoryId === selectedCat) : true;
    const matchesPrice = p.price <= priceRange;
    return matchesSearch && matchesCat && matchesPrice;
  });

  // Handle category filter changes
  const handleCategoryChange = (cat) => {
    setSelectedCat(cat);
  };

  // Handle price range filter changes
  const handlePriceChange = (newPrice) => {
    setPriceRange(newPrice);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-fade-in-up mt-20">
      <h1 className="text-4xl font-bold text-primary text-center mb-10">Our Menu</h1>
      <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-1/4 h-fit lg:sticky lg:top-24 flex-shrink-0">
        <div className="bg-cardBg p-6 rounded-3xl shadow-xl border border-primary/5">
          <h2 className="text-xl font-bold text-primary mb-4">Categories</h2>

          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search treats..." 
              className="w-full bg-primary/5 border border-primary/5 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-primary/30"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-primary" size={18} />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-primary">Max Price</span>
              <span className="text-sm font-bold text-secondary">Rs. {priceRange}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="3000" 
              step="50"
              value={priceRange}
              onChange={e => handlePriceChange(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[60vh] lg:overflow-y-auto pb-4 lg:pb-0 scrollbar-hide">
            <button 
              onClick={() => handleCategoryChange(null)}
              className={`flex-shrink-0 lg:w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${!selectedCat ? 'bg-primary text-white shadow-md' : 'text-primary hover:bg-primary/5'}`}
            >
              All items
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id || cat.id || cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`flex-shrink-0 lg:w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCat === cat.name ? 'bg-primary text-white shadow-md' : 'text-primary hover:bg-primary/5'}`}
              >
                {cat.name} items
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="lg:w-3/4">
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-primary/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{filtered.length} products found</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map(p => (
            <ProductCard 
              key={p._id || p.id} 
              product={p} 
              categoryName={p.category || categories.find(c => c.id === p.categoryId)?.name} 
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <span className="text-8xl block mb-4">🥐</span>
            <p className="text-2xl font-display font-bold">No treats match your filters.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default Menu;
