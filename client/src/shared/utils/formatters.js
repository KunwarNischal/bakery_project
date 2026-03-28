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
    } catch {
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
