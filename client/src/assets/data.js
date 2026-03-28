/**
 * Bakery UI Utilities and Constants
 * 
 * This file contains purely UI-related data and formatting functions.
 * All product and category names/prices are now fetched dynamically from the database.
 */

export const formatPrice = (price) => `Rs ${Number(price).toFixed(2)}`;

/**
 * Icons mapped by Category Name
 * Maintain this list to add new emojis as new categories are created in the DB.
 */
export const CATEGORY_ICONS = {
  'Bread & Bun': '🍞',
  'Cake': '🎂',
  'Chocolate': '🍫',
  'Cookies': '🍪',
  'Croissant': '🥐',
  'Danish': '🥧',
  'Doughnut': '🍩',
  'Macaroons': '🥮',
  'Muffin & Apple Pie': '🧁',
  'Pastry': '🍰',
};

/**
 * Robust helper to get an icon based on a category name.
 * Handles casing and missing categories gracefully.
 */
export const getIconForCategory = (categoryName) => {
  if (!categoryName) return '🥖';
  
  const normalized = categoryName.trim();
  const icon = CATEGORY_ICONS[normalized];
  
  if (icon) return icon;
  
  // Try case-insensitive fallback if direct match fails
  const found = Object.keys(CATEGORY_ICONS).find(
    k => k.toLowerCase() === normalized.toLowerCase()
  );
  
  return found ? CATEGORY_ICONS[found] : '🥖';
};

export const ORDER_STATUSES = [
    'Pending',
    'Preparing',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
];

export const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-700';
        case 'Preparing': return 'bg-blue-100 text-blue-700';
        case 'Processing': return 'bg-indigo-100 text-indigo-700';
        case 'Shipped': return 'bg-purple-100 text-purple-700';
        case 'Delivered': return 'bg-green-100 text-green-700';
        case 'Cancelled': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};
