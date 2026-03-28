/**
 * FeaturedProducts Component - Displays 6 featured bakery items on home page
 *
 * Features:
 * - Shows only products marked as "featured"
 * - Displays a maximum of 6 items in a responsive grid
 * - Includes a "View Full Collection" button to see all products
 * - Showcases the bakery's signature items with attractive styling
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/features/products/components/ProductCard';

const FeaturedProducts = ({ products, categories }) => {
  // Use navigate hook for redirecting to menu page
  const navigate = useNavigate();
  // Filter products to show only featured items, limit to 6
  const featured = products.filter(p => p.featured).slice(0, 6);
  
  return (
    <section className="py-20 px-6 bg-cardBg/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="animate-fade-in-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Our Signature <span className="text-secondary italic">Collectibles</span></h2>
            <p className="text-primary font-bold uppercase text-[10px] tracking-widest">Handmade fresh every morning</p>
          </div>
          <button onClick={() => navigate('/menu')} className="text-primary font-bold uppercase text-[10px] tracking-widest border-b-2 border-accent hover:text-accent transition-colors pb-1">View Full Collection →</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((p, idx) => (
            <ProductCard 
              key={p._id || p.id} 
              product={p} 
              categoryName={p.category || categories.find(c => (c._id === p.categoryId || c.id === p.categoryId))?.name} 
              style={{ animationDelay: `${idx * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
