const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');

const CATEGORIES = [
  { name: "Bread & Bun" },
  { name: "Cake" },
  { name: "Chocolate" },
  { name: "Cookies" },
  { name: "Croissant" },
  { name: "Danish" },
  { name: "Doughnut" },
  { name: "Macaroons" },
  { name: "Muffin & Apple Pie" },
  { name: "Pastry" },
];

const INITIAL_PRODUCTS = [
  { category: "Bread & Bun", categoryId: 1, name: "Banana Bread Big", price: 420.00, stock: 15, featured: true, image: "/assets/bakery/Banana-Bread-big.jpg", description: "Rich, moist banana bread made with ripened bananas." },
  { category: "Bread & Bun", categoryId: 1, name: "Banana Bread Small", price: 215.00, stock: 20, image: "/assets/bakery/Banana-Bread-Small.jpg", description: "Conveniently sized moist banana bread." },
  { category: "Bread & Bun", categoryId: 1, name: "Brown Bread", price: 135.00, stock: 30, image: "/assets/bakery/Brown_Bread.jpg", description: "Wholesome brown bread baked fresh." },
  { category: "Bread & Bun", categoryId: 1, name: "Brown Bread 650gm", price: 185.00, stock: 25, image: "/assets/bakery/brown_bread_650gm.jpg", description: "Large loaf of wholesome brown bread." },
  { category: "Bread & Bun", categoryId: 1, name: "Cheese Bread", price: 340.00, stock: 12, featured: true, image: "/assets/bakery/cheese_bread.jpg", description: "Savory bread infused with premium cheese." },
  { category: "Bread & Bun", categoryId: 1, name: "Chicken Bun", price: 115.00, stock: 40, image: "/assets/bakery/chicken_bun.jpg", description: "Soft bun stuffed with seasoned chicken." },

  { category: "Cake", categoryId: 2, name: "Black Forest Cake", price: 1205.00, stock: 8, featured: true, image: "/assets/bakery/black_forest_cake.jpg", description: "Classic chocolate sponge with cream and cherries." },
  { category: "Cake", categoryId: 2, name: "Black Forest Eggless Cake", price: 1400.00, stock: 5, image: "/assets/bakery/black_forest_eggless_cake.jpg", description: "Eggless version of our classic Black Forest." },
  { category: "Cake", categoryId: 2, name: "Blueberry & Fruit Cake", price: 1520.00, stock: 6, image: "/assets/bakery/blueberry&fruitcake.jpg", description: "Stunning combination of blueberries and fresh fruits." },
  { category: "Cake", categoryId: 2, name: "Blueberry & Fruit Eggless Cake", price: 1650.00, stock: 4, image: "/assets/bakery/blueberry&fruitegglesscake.jpg", description: "Eggless blueberry and fruit berry delight." },
  { category: "Cake", categoryId: 2, name: "Blueberry Cheese Cake (Whole)", price: 2600.00, stock: 3, featured: true, image: "/assets/bakery/blueberry_cheese_cake(whole).jpg", description: "Rich and creamy whole blueberry cheesecake." },
  { category: "Cake", categoryId: 2, name: "Butter Scotch Ice Cream Cake", price: 1520.00, stock: 5, image: "/assets/bakery/butter_scotch_ice_cream_cake.jpg", description: "Cooling butter scotch ice cream in a cake form." },
  { category: "Cake", categoryId: 2, name: "Chocolate Cake & Biscuits", price: 1300.00, stock: 7, image: "/assets/bakery/chocolate_cake_and_biscuits.jpg", description: "Delicious chocolate cake with biscuit crunch." },
  { category: "Cake", categoryId: 2, name: "Chocolate Cake & Biscuits Eggless", price: 1455.00, stock: 5, image: "/assets/bakery/chocolate_cake_and_biscuits(eggless).jpg", description: "Eggless chocolate cake with biscuit crunch." },
  { category: "Cake", categoryId: 2, name: "Chocolate Ice Cream Cake", price: 1400.00, stock: 6, image: "/assets/bakery/chocolate_ice_cream_cake.jpg", description: "Delicious chocolate ice cream cake." },
  { category: "Cake", categoryId: 2, name: "Florida Cake & Apple", price: 1300.00, stock: 4, image: "/assets/bakery/florida_cake_and_apple.jpg", description: "Refreshing Florida cake with apple." },
  { category: "Cake", categoryId: 2, name: "Florida Cake & Apple Eggless", price: 1455.00, stock: 3, image: "/assets/bakery/florida_cake_and_apple_eggless.jpg", description: "Eggless Florida cake with apple." },
  { category: "Cake", categoryId: 2, name: "Grand Chocolate Truffle & Biscuits", price: 1560.00, stock: 5, featured: true, image: "/assets/bakery/grand_chocolate_truffle_and_biscuits.jpg", description: "Decadent chocolate truffle with biscuits." },
  { category: "Cake", categoryId: 2, name: "Lemon Slice Cake", price: 1575.00, stock: 4, image: "/assets/bakery/lemon_slice_cake.jpeg", description: "Zesty lemon slice cake." },
  { category: "Cake", categoryId: 2, name: "Mocca And Nougatine Cake", price: 1400.00, stock: 5, image: "/assets/bakery/mocca_and_nougatine_cake.jpg", description: "Rich mocca and nougatine cake." },
  { category: "Cake", categoryId: 2, name: "Pineapple & Fruit Cake", price: 1205.00, stock: 6, image: "/assets/bakery/pineapple_and_fruit_cake.jpg", description: "Delicious pineapple and fruit cake." },
  { category: "Cake", categoryId: 2, name: "Pineapple & Fruit Cake Eggless", price: 1400.00, stock: 4, image: "/assets/bakery/pineapple_and_fruit_cake(eggless).jpg", description: "Eggless pineapple and fruit cake." },
  { category: "Cake", categoryId: 2, name: "Red Velvet & Cheese Cake", price: 1905.00, stock: 3, featured: true, image: "/assets/bakery/red-velvet-&cheese-cake.jpg", description: "Elegant red velvet combined with cheesecake." },
  { category: "Cake", categoryId: 2, name: "Strawberry Cake", price: 1205.00, stock: 5, image: "/assets/bakery/strawberry_cake.jpg", description: "Sweet strawberry sponge cake." },
  { category: "Cake", categoryId: 2, name: "Strawberry Ice Cream Cake", price: 1400.00, stock: 4, image: "/assets/bakery/strawberry_icecream_cake.jpg", description: "Cool strawberry ice cream cake." },
  { category: "Cake", categoryId: 2, name: "Sugar Free Cake", price: 2030.00, stock: 2, image: "/assets/bakery/sugarfree_cake.jpg", description: "Guilt-free sugar-free cake." },
  { category: "Cake", categoryId: 2, name: "Vanilla & Mix Fruits Cake", price: 1145.00, stock: 5, image: "/assets/bakery/vanilla_and_mixfruits_cake.jpg", description: "Classic vanilla with mixed fruits." },
  { category: "Cake", categoryId: 2, name: "Vanilla & Mix Fruits Cake Eggless", price: 1070.00, stock: 6, image: "/assets/bakery/vanilla_and_mixfruits_cake(eggless).jpg", description: "Eggless vanilla and mixed fruits cake." },
  { category: "Cake", categoryId: 2, name: "Vanilla Ice Cream Cake", price: 1400.00, stock: 5, image: "/assets/bakery/vanilla_ice_cream_cake.jpg", description: "Classic vanilla ice cream cake." },
  { category: "Cake", categoryId: 2, name: "White Forest & Chocolate", price: 1400.00, stock: 6, image: "/assets/bakery/white_forest&chocolate.jpg", description: "White forest sponge with chocolate shavings." },
  { category: "Cake", categoryId: 2, name: "White Forest & Chocolate Eggless", price: 1320.00, stock: 4, image: "/assets/bakery/white_forest&chocolate(eggless).jpg", description: "Eggless white forest with chocolate." },

  { category: "Chocolate", categoryId: 3, name: "Choco Lava", price: 200.00, stock: 18, featured: true, image: "/assets/bakery/choco_lava.jpg", description: "Molten chocolate center dessert." },
  { category: "Chocolate", categoryId: 3, name: "Chocolate Rum Ball", price: 60.00, stock: 25, image: "/assets/bakery/chocolate_rum_ball.jpg", description: "Rich chocolate rum ball." },
  { category: "Chocolate", categoryId: 3, name: "White Rum Ball", price: 60.00, stock: 20, image: "/assets/bakery/white_rum_Ball.jpg", description: "Sweet white chocolate rum ball." },

  { category: "Cookies", categoryId: 4, name: "Big Cookies", price: 70.00, stock: 50, image: "/assets/bakery/big_cookies.jpg", description: "Large, crunchy cookies." },
  { category: "Cookies", categoryId: 4, name: "Velvet Cookies", price: 50.00, stock: 40, image: "/assets/bakery/velvet_cookies.jpg", description: "Soft velvet cookies." },

  { category: "Croissant", categoryId: 5, name: "Plain Croissant", price: 150.00, stock: 25, featured: true, image: "/assets/bakery/plain_croissant.jpg", description: "Buttery, flaky plain croissant." },

  { category: "Danish", categoryId: 6, name: "Chocolate Danish", price: 190.00, stock: 15, image: "/assets/bakery/chocolate_danish.jpg", description: "Sweet danish with chocolate filling." },
  { category: "Danish", categoryId: 6, name: "Cinnamon Danish", price: 130.00, stock: 18, image: "/assets/bakery/cinnamon_danish.jpg", description: "Spicy and sweet cinnamon danish." },
  { category: "Danish", categoryId: 6, name: "Crunchy Chocolate Danish", price: 165.00, stock: 12, image: "/assets/bakery/cruncy_chocolate_danish.jpg", description: "Danish with a crunchy chocolate topping." },
  { category: "Danish", categoryId: 6, name: "Peach Danish", price: 140.00, stock: 10, image: "/assets/bakery/peach_danish.jpg", description: "Fruity peach danish." },
  { category: "Danish", categoryId: 6, name: "Pineapple Danish", price: 120.00, stock: 14, image: "/assets/bakery/pineapple_danish.jpg", description: "Zesty pineapple danish." },

  { category: "Doughnut", categoryId: 7, name: "Chocolate Doughnut", price: 65.00, stock: 30, image: "/assets/bakery/chocolate_doughnut.jpg", description: "Classic glazed chocolate doughnut." },
  { category: "Doughnut", categoryId: 7, name: "Chocolate Doughnut Small", price: 40.00, stock: 25, image: "/assets/bakery/chocolate_doughnut_small.jpg", description: "Bite-sized chocolate doughnut." },
  { category: "Doughnut", categoryId: 7, name: "Plain Doughnut", price: 50.00, stock: 35, image: "/assets/bakery/plain_doughnut.jpg", description: "Soft and fluffy plain doughnut." },
  { category: "Doughnut", categoryId: 7, name: "Doughnut Small", price: 30.00, stock: 40, image: "/assets/bakery/doughnut_small.jpg", description: "Mini plain doughnut." },

  { category: "Macaroons", categoryId: 8, name: "Blue Vanilla Macaroons", price: 100.00, stock: 30, image: "/assets/bakery/blue_vanilla_macaroons.jpg", description: "Aromatic blue vanilla macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Blueberry Macaroons", price: 100.00, stock: 30, image: "/assets/bakery/blueberry_macaroons.jpg", description: "Sweet blueberry macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Chocolate Macaroons", price: 100.00, stock: 30, image: "/assets/bakery/chocolate_macaroons.jpg", description: "Rich chocolate macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Coconut Macaroon", price: 100.00, stock: 25, image: "/assets/bakery/coconut_macaroon.jpg", description: "Tropical coconut macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Green Tea Macaroon", price: 100.00, stock: 20, image: "/assets/bakery/green_tea_macaroon.jpg", description: "Unique green tea macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Mango Macaroons", price: 100.00, stock: 22, image: "/assets/bakery/mango_macaroons.jpg", description: "Fruity mango macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Moca Macaroons", price: 100.00, stock: 18, image: "/assets/bakery/moca_macaroons.jpg", description: "Coffee-flavored moca macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Orange Macaroons", price: 100.00, stock: 25, image: "/assets/bakery/orange_macaroons.jpg", description: "Zesty orange macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Oreo Macaroons", price: 100.00, stock: 28, image: "/assets/bakery/oreo_macaroons.jpg", description: "Crunchy Oreo macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Strawberry Macaroons", price: 100.00, stock: 30, image: "/assets/bakery/strawberry_macaroons.jpg", description: "Sweet strawberry macaroons." },
  { category: "Macaroons", categoryId: 8, name: "Vanilla Macaroons", price: 100.00, stock: 35, image: "/assets/bakery/vanilla_macaroons.jpg", description: "Classic vanilla macaroons." },

  { category: "Muffin & Apple Pie", categoryId: 9, name: "Apple Pie", price: 230.00, stock: 14, featured: true, image: "/assets/bakery/apple_pie.jpg", description: "Wholesome tradition apple pie." },
  { category: "Muffin & Apple Pie", categoryId: 9, name: "Chocolate Muffin", price: 105.00, stock: 20, image: "/assets/bakery/chocolate_muffin.jpg", description: "Moist chocolate muffin." },
  { category: "Muffin & Apple Pie", categoryId: 9, name: "Plain Muffin", price: 95.00, stock: 25, image: "/assets/bakery/plain_muffin.jpg", description: "Simple and delicious plain muffin." },

  { category: "Pastry", categoryId: 10, name: "Blueberry Tart", price: 195.00, stock: 12, image: "/assets/bakery/blueberry_tart.jpg", description: "Creamy blueberry tart." },
  { category: "Pastry", categoryId: 10, name: "Choco Mix Pastry", price: 200.00, stock: 15, image: "/assets/bakery/choco_mix_pastry.jpg", description: "Delicious mixed chocolate pastry." },
  { category: "Pastry", categoryId: 10, name: "Chocolate Pyramid", price: 180.00, stock: 10, image: "/assets/bakery/chocolate_pyramid.jpg", description: "Iconic chocolate pyramid pastry." },
  { category: "Pastry", categoryId: 10, name: "Classic White Forest Eggless", price: 200.00, stock: 8, image: "/assets/bakery/classic_white_forest_eggless.jpg", description: "Eggless white forest pastry." },
  { category: "Pastry", categoryId: 10, name: "Eclairs", price: 140.00, stock: 20, image: "/assets/bakery/eclairs.jpg", description: "Classic cream-filled eclairs." },
  { category: "Pastry", categoryId: 10, name: "Honey Pastry", price: 205.00, stock: 12, image: "/assets/bakery/honey_pastry.jpg", description: "Sweet honey-infused pastry." },
  { category: "Pastry", categoryId: 10, name: "Lemon Tart", price: 200.00, stock: 15, image: "/assets/bakery/lemon_tart.jpg", description: "Tangy lemon tart." },
  { category: "Pastry", categoryId: 10, name: "Lollipop", price: 60.00, stock: 50, image: "/assets/bakery/lollipop.jpg", description: "Sweet bakery-style lollipops." },
  { category: "Pastry", categoryId: 10, name: "Red Velvet", price: 220.00, stock: 12, featured: true, image: "/assets/bakery/red_velvet.jpg", description: "Rich red velvet pastry." },
  { category: "Pastry", categoryId: 10, name: "Strawberry Tart", price: 190.00, stock: 14, image: "/assets/bakery/strawberry_tart.jpg", description: "Fresh strawberry tart." },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hatemalo_bakery');
    
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    await Category.insertMany(CATEGORIES);

    await Product.insertMany(INITIAL_PRODUCTS);

    await User.create({
        name: "Admin User",
        email: "admin@hatemalo.com",
        password: "admin123",
        isAdmin: true
    });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();

