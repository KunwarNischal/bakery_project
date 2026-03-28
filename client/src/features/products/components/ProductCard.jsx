/**
 * ProductCard Component - Displays a single product in grid/list view
 *
 * Shows:
 * - Product image or icon
 * - Product name
 * - Category badge
 * - Price
 * - Quick "Add to Cart" button
 *
 * Interactions:
 * - Click card to view product details
 * - Click + button to add to cart without leaving current page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/shared/utils/formatters';

const ProductCard = ({ product, categoryName }) => {
  // Get function to add products to shopping cart
  const { addToCart } = useCart();
  // Use navigate hook to redirect to product details page
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product._id || product.id}`)}
      className="bg-cardBg rounded-[2rem] border border-primary/5 p-6 hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-square bg-background rounded-2xl flex items-center justify-center overflow-hidden mb-6 group-hover:scale-95 transition-transform border border-primary/5">
         {product.image ? (
           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
         ) : (
           <span className="text-6xl drop-shadow-lg">{product.icon}</span>
         )}
      </div>
      <h3 className="font-display text-lg font-bold text-primary mb-4 flex-grow">{product.name}</h3>
      <div className="flex justify-between items-end mt-auto">
        <div>
           <p className="text-[8px] text-primary font-bold uppercase tracking-widest">{categoryName}</p>
           <span className="text-secondary font-bold text-sm tracking-tight">{formatPrice(product.price)}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="p-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
