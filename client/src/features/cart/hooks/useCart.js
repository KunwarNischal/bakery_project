/**
 * useCart Hook - Custom hook to access shopping cart context
 *
 * This is a custom hook that provides easy access to the Cart Context throughout the application.
 * Instead of using useContext(CartContext) everywhere, components can simply use this hook.
 *
 * Features:
 * - Access cart items array
 * - Add products to cart
 * - Remove products from cart
 * - Update product quantities
 * - Clear entire cart
 * - Get subtotal
 * - Show toast notifications
 *
 * Usage:
 * const { cart, addToCart, removeFromCart, subtotal } = useCart();
 *
 * Returns:
 * - cart: Array of items currently in the shopping cart
 * - addToCart(product, qty): Function to add product to cart
 * - removeFromCart(id): Function to remove item from cart
 * - updateCartQty(id, delta): Function to change item quantity
 * - clearCart(): Function to empty the entire cart
 * - subtotal: Calculated total of all cart items (price × quantity)
 * - addToast(message, type): Function to show notification messages
 * - toasts: Array of active toast notifications
 */

import { useContext } from 'react';
import { CartContext } from '@/features/cart/context/CartContext';

export const useCart = () => useContext(CartContext);


