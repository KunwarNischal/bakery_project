import { environment } from '@/config/environment';
import { DELIVERY_METHODS } from '@/config/constants';

/**
 * Formats a number to Nepali Rupees format
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price string (e.g., "Rs 1,500")
 */
export const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return 'Rs 0';
    
    return `Rs ${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Formats a date string into a readable format
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return 'N/A';
    
    try {
        const dateObj = new Date(date);
        
        const defaultOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            ...options
        };
        
        return new Intl.DateTimeFormat('en-IN', defaultOptions).format(dateObj);
    } catch (error) {
        return 'Invalid Date';
    }
};

/**
 * Formats delivery fee for display
 * @param {number} fee - The delivery fee amount
 * @returns {string} Formatted fee or "Free"
 */
export const formatDeliveryFee = (fee) => {
    if (fee === 0) return 'Free';
    return formatPrice(fee);
};

/**
 * Truncates text to a specified maximum length and adds ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 50)
 * @returns {string} Truncated string
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Calculates the total cost of items in the cart
 * @param {Array} cartItems - Array of cart item objects (needs price and quantity)
 * @returns {number} The subtotal amount
 */
export const calculateSubtotal = (cartItems = []) => {
    return cartItems.reduce((total, item) => {
        const itemPrice = Number(item.price) || 0;
        const itemQuantity = Number(item.quantity) || 1;
        return total + (itemPrice * itemQuantity);
    }, 0);
};

/**
 * Calculates delivery fee based on method and subtotal
 * @param {string} deliveryMethod - The selected delivery method
 * @param {number} subtotal - The cart subtotal
 * @returns {number} The calculated delivery fee
 */
export const calculateDeliveryFee = (deliveryMethod, subtotal) => {
    if (deliveryMethod === DELIVERY_METHODS.PICKUP) {
        return 0; // Free for pickup
    }
    
    if (subtotal >= environment.delivery.freeDeliveryThreshold) {
        return 0; // Free above threshold
    }
    
    return environment.delivery.standardFee;
};
