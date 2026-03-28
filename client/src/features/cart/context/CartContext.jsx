/**
 * Cart Context - Global state management for shopping cart
 *
 * This context provides cart functionality across the entire application:
 * - Manages shopping cart items and their quantities
 * - Persists cart data to browser localStorage
 * - Calculates subtotal for checkout
 * - Provides functions to add, update, and remove items from cart
 * - Note: Toast notifications are handled by separate ToastContext
 */

import React, { useState, useEffect } from 'react';
import { CartContext } from './cartContextValue';

export const CartProvider = ({ children }) => {

  // Initialize cart from localStorage or start with empty array
  const [cart, setCart] = useState(() => {
    try {
      // Try to get saved cart from localStorage
      const savedCart = localStorage.getItem('bakery_cart');
      // Return parsed cart or empty array if none saved
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      // Return empty array if localStorage parsing fails
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bakery_cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Add a product to the cart or increase its quantity if already in cart
   * @param {object} product - The product object to add
   * @param {number} qty - Quantity to add (default: 1)
   */
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      // Check if product already exists in cart
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // If exists, increase quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      // If not exists, add as new item
      return [...prev, { ...product, quantity: qty }];
    });
  };

  /**
   * Update quantity of a cart item by adding/subtracting a delta
   * Prevents quantity from going below 1
   * @param {string} id - Product ID
   * @param {number} delta - Change in quantity (positive or negative)
   */
  const updateCartQty = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  /**
   * Remove an item completely from the cart
   * @param {string} id - Product ID to remove
   */
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => setCart([]);

  // Context value object with all cart-related state and functions
  const value = {
    // Array of cart items
    cart,
    // Function to add items to cart
    addToCart,
    // Function to increase/decrease quantity
    updateCartQty,
    // Function to remove items from cart
    removeFromCart,
    // Function to empty the entire cart
    clearCart,
    // Calculated total price of all items in cart
    subtotal: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Re-export CartContext for backward compatibility
export { CartContext };

