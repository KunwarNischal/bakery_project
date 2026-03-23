/**
 * Product Details Page Component
 *
 * This page displays detailed information about a single product.
 * It includes:
 * - Large product image and icon
 * - Product name, price, and category
 * - Full product description
 * - Ingredients and allergen information
 * - Add to cart functionality with quantity selector
 * - Share product button
 * - 4 related products from same category
 *
 * Product is fetched by ID from URL parameters.
 * If product not found, user is redirected back to menu.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { getProductById } from '../../services/api';
import { INITIAL_PRODUCTS, CATEGORIES, formatPrice } from '../../assets/data';

const ProductDetails = ({ products = INITIAL_PRODUCTS }) => {
  // Get product ID from URL (e.g., /products/123)
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // Store the product data fetched from server
  const [product, setProduct] = useState(null);

  // Calculate related products - other items in same category
  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];

    // First, try to get products from same category
    let related = products.filter(p =>
      p.category === product.category && p._id !== product._id && p.id !== product.id
    );

    // If less than 4, add featured products
    if (related.length < 4) {
      const featured = products.filter(p =>
        p.featured && p._id !== product._id && p.id !== product.id
      );
      related = [...related, ...featured].slice(0, 4);
    }

    // If still less than 4, add other products
    if (related.length < 4) {
      const others = products.filter(p =>
        p._id !== product._id && p.id !== product.id && !related.find(r => r._id === p._id)
      );
      related = [...related, ...others].slice(0, 4);
    }

    return related;
  }, [product, products]);

  // Fetch product data when component loads or product ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      // Try to fetch from server first
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
      } else {
        // Fall back to local data if server request fails
        const p = products.find(item => item._id === id || item.id === parseInt(id));
        if (p) {
          setProduct(p);
        } else {
          // Redirect to menu if product not found
          navigate('/menu');
        }
      }
      // Scroll to top of page when product loads
      window.scrollTo(0, 0);
    };
    fetchProduct();
  }, [id, navigate, products]);

  if (!product) return <div className="p-20 text-center animate-pulse">Loading treat...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-32 mt-10 animate-fade-in-up">
      <button onClick={() => navigate(-1)} className="mb-10 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-secondary flex items-center gap-2">
        ← Back to Menu
      </button>

      <div className="bg-cardBg rounded-[4rem] overflow-hidden border border-primary/5 shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-2 sm:p-4 flex items-center justify-center bg-background overflow-hidden relative min-h-[400px]">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-[3rem] animate-fade-in-up" />
          ) : (
            <span className="text-[12rem] drop-shadow-2xl animate-float">{product.icon}</span>
          )}
        </div>

        <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-secondary mb-6 pb-2 border-b border-secondary/20">
            {CATEGORIES.find(c => c.id === product.categoryId)?.name}
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            {product.name}
          </h1>
          <p className="text-secondary text-3xl font-display font-bold mb-10">
            {formatPrice(product.price)}
          </p>

          <div className="space-y-8 mb-12">
            <div>
              <h4 className="font-bold text-primary text-[10px] uppercase tracking-widest mb-3">Description</h4>
              <p className="text-primary text-sm leading-relaxed font-body">
                {product.description || `Our signature ${product.name} is a testament to artisanal baking. Hand-crafted using premium ingredients and baked to perfection in our traditional stone ovens.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-primary/5">
              <div>
                <h4 className="font-bold text-primary text-[10px] uppercase tracking-widest mb-2">Ingredients</h4>
                <p className="text-primary text-[10px] font-bold">
                  {product.ingredients && product.ingredients.length > 0 
                    ? product.ingredients.join(', ') 
                    : 'Unbleached Flour, Organic Sugar, Love'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-primary text-[10px] uppercase tracking-widest mb-2">Shelf Life</h4>
                <p className="text-primary text-[10px] font-bold">2-3 Days Fresh</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-grow py-5 bg-primary text-white font-bold rounded-2xl hover:bg-secondary transition-all uppercase tracking-widest text-xs shadow-xl"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                const url = window.location.href;
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} at Hatemalo Bakery!`,
                    url: url
                  });
                } else {
                  alert('Share link: ' + url);
                }
              }}
              className="px-8 py-5 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-32">
          <h3 className="font-display text-3xl font-bold text-primary mb-12 italic">You might also enjoy...</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <div key={p._id || p.id} onClick={() => navigate(`/product/${p._id || p.id}`)} className="bg-cardBg p-6 rounded-3xl border border-primary/5 hover:shadow-lg transition-all cursor-pointer group text-center">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-110 transition-transform" />
                ) : (
                  <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">{p.icon}</span>
                )}
                <h4 className="font-bold text-primary text-sm mb-1">{p.name}</h4>
                <p className="text-secondary font-bold text-xs">Rs. {p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
