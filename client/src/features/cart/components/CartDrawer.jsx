/**
 * CartDrawer Component - Side panel showing shopping cart contents
 *
 * Features:
 * - Slides in from the right side of the screen
 * - Displays all items currently in the cart
 * - Shows product images/icons, names, prices, and quantities
 * - Allows quantity adjustment with +/- buttons
 * - Allows removing individual items
 * - Shows cart subtotal
 * - Checkout button to proceed to payment
 * - Empty cart message when no items
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/shared/utils/formatters';

const CartDrawer = ({ isOpen, setIsOpen }) => {
  // Get cart data and functions from cart context
  const { cart, updateCartQty, removeFromCart, subtotal } = useCart();
  // Navigation hook for redirect to checkout
  const navigate = useNavigate();

  // Don't render drawer if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      <div className="relative w-full max-w-md bg-background shadow-2xl animate-slide-in-right flex flex-col h-full border-l border-primary/5">
        <header className="p-8 border-b border-primary/5 flex justify-between items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary">Your Cart</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{cart.length} signature items</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-primary hover:text-secondary transition-colors text-2xl">✕</button>
        </header>

        <div className="grow overflow-y-auto p-8 space-y-8">
          {cart.map(item => (
            <div key={item._id || item.id} className="flex gap-4 group">
              <div className="w-20 h-20 bg-cardBg rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-primary/5 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="drop-shadow-sm">{item.icon || '🥐'}</span>
                )}
              </div>
              <div className="grow">
                <div className="flex justify-between mb-1">
                  <h4 className="font-bold text-primary text-sm">{item.name}</h4>
                  <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest hover:text-red-500">Remove</button>
                </div>
                <p className="text-[10px] font-bold text-primary uppercase mb-4">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateCartQty(item.id, -1)} className="w-8 h-8 rounded-lg border border-primary/10 flex items-center justify-center hover:bg-primary/5">-</button>
                  <span className="font-bold text-sm min-w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartQty(item.id, 1)} className="w-8 h-8 rounded-lg border border-primary/10 flex items-center justify-center hover:bg-primary/5">+</button>
                </div>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center py-20 opacity-20">
              <span className="text-6xl block mb-4">🛒</span>
              <p className="text-xl font-display font-bold uppercase tracking-widest">Cart is empty</p>
            </div>
          )}
        </div>

        <footer className="p-8 bg-cardBg border-t border-primary/5 space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Subtotal</span>
            <span className="text-2xl font-display font-bold text-primary">{formatPrice(subtotal)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => {
              navigate('/checkout'); setIsOpen(false);
            }}
            className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-secondary transition-all uppercase tracking-widest text-xs shadow-xl disabled:bg-primary/20 disabled:shadow-none"
          >
            Checkout Now
          </button>
        </footer>
      </div>
    </div>
  );
};


export default CartDrawer;
