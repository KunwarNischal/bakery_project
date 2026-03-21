import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../assets/data';

const ProductCard = ({ product, categoryName }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
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
