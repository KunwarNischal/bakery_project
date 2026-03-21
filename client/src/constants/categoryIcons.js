// Hardcoded category icons mapping
export const CATEGORY_ICONS = {
  'Bread & Bun': '🥖',
  'Cake': '🎂',
  'Chocolate': '🍫',
  'Cookies': '🍪',
  'Croissant': '🥐',
  'Danish': '🥧',
  'Doughnut': '🍩',
  'Macaroons': '🪨',
  'Muffin & Apple Pie': '🧁',
  'Pastry': '🥐',
};

export const getIconForCategory = (categoryName) => {
  return CATEGORY_ICONS[categoryName] || '🥖';
};
