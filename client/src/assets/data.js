export const CATEGORIES = [
  { id: 1, name: "Bread & Bun", icon: "🍞" },
  { id: 2, name: "Cake", icon: "🎂" },
  { id: 3, name: "Chocolate", icon: "🍫" },
  { id: 4, name: "Cookies", icon: "🍪" },
  { id: 5, name: "Croissant", icon: "🥐" },
  { id: 6, name: "Danish", icon: "🥐" },
  { id: 7, name: "Doughnut", icon: "🍩" },
  { id: 8, name: "Macaroons", icon: "🥯" },
  { id: 9, name: "Muffin & Apple Pie", icon: "🥧" },
  { id: 10, name: "Pastry", icon: "🍰" },
];

export const INITIAL_PRODUCTS = [

  { id: 1, categoryId: 1, name: "Banana Bread Big", price: 420.00, stock: 15, featured: true, icon: "🍞", image: "/assets/bakery/Banana-Bread-big.jpg" },
  { id: 2, categoryId: 1, name: "Banana Bread Small", price: 215.00, stock: 20, icon: "🍞", image: "/assets/bakery/Banana-Bread-Small.jpg" },
  { id: 3, categoryId: 1, name: "Brown Bread", price: 135.00, stock: 30, icon: "🍞", image: "/assets/bakery/Brown_Bread.jpg" },
  { id: 4, categoryId: 1, name: "Brown Bread 650gm", price: 185.00, stock: 25, icon: "🍞", image: "/assets/bakery/brown_bread_650gm.jpg" },
  { id: 5, categoryId: 1, name: "Cheese Bread", price: 340.00, stock: 12, featured: true, icon: "🍞", image: "/assets/bakery/cheese_bread.jpg" },
  { id: 6, categoryId: 1, name: "Chicken Bun", price: 115.00, stock: 40, icon: "🥯", image: "/assets/bakery/chicken_bun.jpg" },

  { id: 7, categoryId: 2, name: "Black Forest Cake", price: 1205.00, stock: 8, featured: true, icon: "🎂", image: "/assets/bakery/black_forest_cake.jpg" },
  { id: 8, categoryId: 2, name: "Black Forest Eggless Cake", price: 1400.00, stock: 5, icon: "🎂", image: "/assets/bakery/black_forest_eggless_cake.jpg" },
  { id: 9, categoryId: 2, name: "Blueberry & Fruit Cake", price: 1520.00, stock: 6, icon: "🎂", image: "/assets/bakery/blueberry&fruitcake.jpg" },
  { id: 10, categoryId: 2, name: "Blueberry & Fruit Eggless Cake", price: 1650.00, stock: 4, icon: "🎂", image: "/assets/bakery/blueberry&fruitegglesscake.jpg" },
  { id: 11, categoryId: 2, name: "Blueberry Cheese Cake (Whole)", price: 2600.00, stock: 3, featured: true, icon: "🍰", image: "/assets/bakery/blueberry_cheese_cake(whole).jpg" },
  { id: 12, categoryId: 2, name: "Butter Scotch Ice Cream Cake", price: 1520.00, stock: 5, icon: "🍦", image: "/assets/bakery/butter_scotch_ice_cream_cake.jpg" },
  { id: 13, categoryId: 2, name: "Chocolate Cake & Biscuits", price: 1300.00, stock: 7, icon: "🎂", image: "/assets/bakery/chocolate_cake_and_biscuits.jpg" },
  { id: 14, categoryId: 2, name: "Chocolate Cake & Biscuits Eggless", price: 1455.00, stock: 5, icon: "🎂", image: "/assets/bakery/chocolate_cake_and_biscuits(eggless).jpg" },
  { id: 15, categoryId: 2, name: "Chocolate Ice Cream Cake", price: 1400.00, stock: 6, icon: "🍦", image: "/assets/bakery/chocolate_ice_cream_cake.jpg" },
  { id: 16, categoryId: 2, name: "Florida Cake & Apple", price: 1300.00, stock: 4, icon: "🎂", image: "/assets/bakery/florida_cake_and_apple.jpg" },
  { id: 17, categoryId: 2, name: "Florida Cake & Apple Eggless", price: 1455.00, stock: 3, icon: "🎂", image: "/assets/bakery/florida_cake_and_apple_eggless.jpg" },
  { id: 18, categoryId: 2, name: "Grand Chocolate Truffle & Biscuits", price: 1560.00, stock: 5, featured: true, icon: "🎂", image: "/assets/bakery/grand_chocolate_truffle_and_biscuits.jpg" },
  { id: 19, categoryId: 2, name: "Lemon Slice Cake", price: 1575.00, stock: 4, icon: "🍋", image: "/assets/bakery/lemon_slice_cake.jpeg" },
  { id: 20, categoryId: 2, name: "Mocca And Nougatine Cake", price: 1400.00, stock: 5, icon: "☕", image: "/assets/bakery/mocca_and_nougatine_cake.jpg" },
  { id: 21, categoryId: 2, name: "Pineapple & Fruit Cake", price: 1205.00, stock: 6, icon: "🎂", image: "/assets/bakery/pineapple_and_fruit_cake.jpg" },
  { id: 22, categoryId: 2, name: "Pineapple & Fruit Cake Eggless", price: 1400.00, stock: 4, icon: "🎂", image: "/assets/bakery/pineapple_and_fruit_cake(eggless).jpg" },
  { id: 23, categoryId: 2, name: "Red Velvet & Cheese Cake", price: 1905.00, stock: 3, featured: true, icon: "🎂", image: "/assets/bakery/red-velvet-&cheese-cake.jpg" },
  { id: 24, categoryId: 2, name: "Strawberry Cake", price: 1205.00, stock: 5, icon: "🎂", image: "/assets/bakery/strawberry_cake.jpg" },
  { id: 25, categoryId: 2, name: "Strawberry Ice Cream Cake", price: 1400.00, stock: 4, icon: "🍦", image: "/assets/bakery/strawberry_icecream_cake.jpg" },
  { id: 26, categoryId: 2, name: "Sugar Free Cake", price: 2030.00, stock: 2, icon: "🎂", image: "/assets/bakery/sugarfree_cake.jpg" },
  { id: 27, categoryId: 2, name: "Vanilla & Mix Fruits Cake", price: 1145.00, stock: 5, icon: "🎂", image: "/assets/bakery/vanilla_and_mixfruits_cake.jpg" },
  { id: 28, categoryId: 2, name: "Vanilla & Mix Fruits Cake Eggless", price: 1070.00, stock: 6, icon: "🎂", image: "/assets/bakery/vanilla_and_mixfruits_cake(eggless).jpg" },
  { id: 29, categoryId: 2, name: "Vanilla Ice Cream Cake", price: 1400.00, stock: 5, icon: "🍦", image: "/assets/bakery/vanilla_ice_cream_cake.jpg" },
  { id: 30, categoryId: 2, name: "White Forest & Chocolate", price: 1400.00, stock: 6, icon: "🎂", image: "/assets/bakery/white_forest&chocolate.jpg" },
  { id: 31, categoryId: 2, name: "White Forest & Chocolate Eggless", price: 1320.00, stock: 4, icon: "🎂", image: "/assets/bakery/white_forest&chocolate(eggless).jpg" },

  { id: 32, categoryId: 3, name: "Choco Lava", price: 200.00, stock: 18, featured: true, icon: "🌋", image: "/assets/bakery/choco_lava.jpg" },
  { id: 33, categoryId: 3, name: "Chocolate Rum Ball", price: 60.00, stock: 25, icon: "🍩", image: "/assets/bakery/chocolate_rum_ball.jpg" },
  { id: 34, categoryId: 3, name: "White Rum Ball", price: 60.00, stock: 20, icon: "🍩", image: "/assets/bakery/white_rum_Ball.jpg" },

  { id: 35, categoryId: 4, name: "Big Cookies", price: 70.00, stock: 50, icon: "🍪", image: "/assets/bakery/big_cookies.jpg" },
  { id: 36, categoryId: 4, name: "Velvet Cookies", price: 50.00, stock: 40, icon: "🍪", image: "/assets/bakery/velvet_cookies.jpg" },

  { id: 37, categoryId: 5, name: "Plain Croissant", price: 150.00, stock: 25, featured: true, icon: "🥐", image: "/assets/bakery/plain_croissant.jpg" },

  { id: 38, categoryId: 6, name: "Chocolate Danish", price: 190.00, stock: 15, icon: "🥐", image: "/assets/bakery/chocolate_danish.jpg" },
  { id: 39, categoryId: 6, name: "Cinnamon Danish", price: 130.00, stock: 18, icon: "🥐", image: "/assets/bakery/cinnamon_danish.jpg" },
  { id: 40, categoryId: 6, name: "Crunchy Chocolate Danish", price: 165.00, stock: 12, icon: "🥐", image: "/assets/bakery/cruncy_chocolate_danish.jpg" },
  { id: 41, categoryId: 6, name: "Peach Danish", price: 140.00, stock: 10, icon: "🥐", image: "/assets/bakery/peach_danish.jpg" },
  { id: 42, categoryId: 6, name: "Pineapple Danish", price: 120.00, stock: 14, icon: "🥐", image: "/assets/bakery/pineapple_danish.jpg" },

  { id: 43, categoryId: 7, name: "Chocolate Doughnut", price: 65.00, stock: 30, icon: "🍩", image: "/assets/bakery/chocolate_doughnut.jpg" },
  { id: 44, categoryId: 7, name: "Chocolate Doughnut Small", price: 40.00, stock: 25, icon: "🍩", image: "/assets/bakery/chocolate_doughnut_small.jpg" },
  { id: 45, categoryId: 7, name: "Plain Doughnut", price: 50.00, stock: 35, icon: "🍩", image: "/assets/bakery/plain_doughnut.jpg" },
  { id: 46, categoryId: 7, name: "Doughnut Small", price: 30.00, stock: 40, icon: "🍩", image: "/assets/bakery/doughnut_small.jpg" },

  { id: 47, categoryId: 8, name: "Blue Vanilla Macaroons", price: 100.00, stock: 30, icon: "🥯", image: "/assets/bakery/blue_vanilla_macaroons.jpg" },
  { id: 48, categoryId: 8, name: "Blueberry Macaroons", price: 100.00, stock: 30, icon: "🥯", image: "/assets/bakery/blueberry_macaroons.jpg" },
  { id: 49, categoryId: 8, name: "Chocolate Macaroons", price: 100.00, stock: 30, icon: "🥯", image: "/assets/bakery/chocolate_macaroons.jpg" },
  { id: 50, categoryId: 8, name: "Coconut Macaroon", price: 100.00, stock: 25, icon: "🥯", image: "/assets/bakery/coconut_macaroon.jpg" },
  { id: 51, categoryId: 8, name: "Green Tea Macaroon", price: 100.00, stock: 20, icon: "🥯", image: "/assets/bakery/green_tea_macaroon.jpg" },
  { id: 52, categoryId: 8, name: "Mango Macaroons", price: 100.00, stock: 22, icon: "🥯", image: "/assets/bakery/mango_macaroons.jpg" },
  { id: 53, categoryId: 8, name: "Moca Macaroons", price: 100.00, stock: 18, icon: "🥯", image: "/assets/bakery/moca_macaroons.jpg" },
  { id: 54, categoryId: 8, name: "Orange Macaroons", price: 100.00, stock: 25, icon: "🥯", image: "/assets/bakery/orange_macaroons.jpg" },
  { id: 55, categoryId: 8, name: "Oreo Macaroons", price: 100.00, stock: 28, icon: "🥯", image: "/assets/bakery/oreo_macaroons.jpg" },
  { id: 56, categoryId: 8, name: "Strawberry Macaroons", price: 100.00, stock: 30, icon: "🥯", image: "/assets/bakery/strawberry_macaroons.jpg" },
  { id: 57, categoryId: 8, name: "Vanilla Macaroons", price: 100.00, stock: 35, icon: "🥯", image: "/assets/bakery/vanilla_macaroons.jpg" },

  { id: 58, categoryId: 9, name: "Apple Pie", price: 230.00, stock: 14, featured: true, icon: "🥧", image: "/assets/bakery/apple_pie.jpg" },
  { id: 59, categoryId: 9, name: "Chocolate Muffin", price: 105.00, stock: 20, icon: "🧁", image: "/assets/bakery/chocolate_muffin.jpg" },
  { id: 60, categoryId: 9, name: "Plain Muffin", price: 95.00, stock: 25, icon: "🧁", image: "/assets/bakery/plain_muffin.jpg" },

  { id: 61, categoryId: 10, name: "Blueberry Tart", price: 195.00, stock: 12, icon: "🥧", image: "/assets/bakery/blueberry_tart.jpg" },
  { id: 62, categoryId: 10, name: "Choco Mix Pastry", price: 200.00, stock: 15, icon: "🍰", image: "/assets/bakery/choco_mix_pastry.jpg" },
  { id: 63, categoryId: 10, name: "Chocolate Pyramid", price: 180.00, stock: 10, icon: "🍰", image: "/assets/bakery/chocolate_pyramid.jpg" },
  { id: 64, categoryId: 10, name: "Classic White Forest Eggless", price: 200.00, stock: 8, icon: "🍰", image: "/assets/bakery/classic_white_forest_eggless.jpg" },
  { id: 65, categoryId: 10, name: "Eclairs", price: 140.00, stock: 20, icon: "🍰", image: "/assets/bakery/eclairs.jpg" },
  { id: 66, categoryId: 10, name: "Honey Pastry", price: 205.00, stock: 12, icon: "🍰", image: "/assets/bakery/honey_pastry.jpg" },
  { id: 67, categoryId: 10, name: "Lemon Tart", price: 200.00, stock: 15, icon: "🥧", image: "/assets/bakery/lemon_tart.jpg" },
  { id: 68, categoryId: 10, name: "Lollipop", price: 60.00, stock: 50, icon: "🍭", image: "/assets/bakery/lollipop.jpg" },
  { id: 69, categoryId: 10, name: "Red Velvet", price: 220.00, stock: 12, featured: true, icon: "🍰", image: "/assets/bakery/red_velvet.jpg" },
  { id: 70, categoryId: 10, name: "Strawberry Tart", price: 190.00, stock: 14, icon: "🥧", image: "/assets/bakery/strawberry_tart.jpg" },
];

export const formatPrice = (price) => `Rs ${price.toFixed(2)}`;

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
