import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const categoriesList = [
  'Fruits',
  'Vegetables',
  'Drinks',
  'Snacks',
  'Dairy',
  'Bakery',
  'Electronics',
  'Clothing',
  'Other',
];

const realisticCatalog = [
  // Fruits
  { name: 'Organic Royal Gala Apples', category: 'Fruits', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
  { name: 'Golden Delicious Apples', category: 'Fruits', img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80' },
  { name: 'Granny Smith Green Apples', category: 'Fruits', img: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe0a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ripe Organic Bananas Bunch', category: 'Fruits', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sweet Valencia Oranges Box', category: 'Fruits', img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Blood Oranges Fresh Pack', category: 'Fruits', img: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Farm Fresh Strawberries Basket', category: 'Fruits', img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80' },
  { name: 'Seedless Red Crimson Grapes', category: 'Fruits', img: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sweet Black Seedless Grapes', category: 'Fruits', img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Premium Hass Avocados Pack', category: 'Fruits', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80' },
  { name: 'Alphonso Sweet Mangoes Box', category: 'Fruits', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Blueberries Carton', category: 'Fruits', img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Raspberries Punnet', category: 'Fruits', img: 'https://images.unsplash.com/photo-1577069808021-34a9ef38fc9f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Blackberries Clamshell', category: 'Fruits', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ripe Golden Pineapple', category: 'Fruits', img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80' },
  { name: 'Whole Seedless Watermelon', category: 'Fruits', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Cantaloupe Melon', category: 'Fruits', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sweet Honeydew Melon', category: 'Fruits', img: 'https://images.unsplash.com/photo-1571575179703-4bde44fb408c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Yellow Papaya Sweet Fruit', category: 'Fruits', img: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Kiwi Fruit 4-Pack', category: 'Fruits', img: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Pomegranate Jewels', category: 'Fruits', img: 'https://images.unsplash.com/photo-1615485290176-88c94bf65293?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sweet Red Cherries Bag', category: 'Fruits', img: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ripe Peaches Basket', category: 'Fruits', img: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Nectarines Pack', category: 'Fruits', img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sweet Plums 6-Pack', category: 'Fruits', img: 'https://images.unsplash.com/photo-1568651316335-5152a514d489?auto=format&fit=crop&w=600&q=80' },
  { name: 'Green Anjou Pears', category: 'Fruits', img: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=600&q=80' },
  { name: 'Yellow Bartlett Pears', category: 'Fruits', img: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Meyer Lemons', category: 'Fruits', img: 'https://images.unsplash.com/photo-1533082603893-a1c834889ec9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Juicy Green Limes Bag', category: 'Fruits', img: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ruby Red Grapefruit', category: 'Fruits', img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80' },

  // Vegetables
  { name: 'Organic Fresh Broccoli Crown', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80' },
  { name: 'Baby Spinach Crisp Leaves', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Curly Kale Bunch', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=600&q=80' },
  { name: 'Farm Fresh Roma Tomatoes', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sweet Cherry Tomatoes on Vine', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Crunchy Carrots Bunch', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80' },
  { name: 'Green Bell Peppers Pack', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sweet Red Bell Peppers', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?auto=format&fit=crop&w=600&q=80' },
  { name: 'Crisp English Cucumbers', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Green Zucchini', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Yellow Summer Squash', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=600&q=80' },
  { name: 'Cauliflower White Head', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80' },
  { name: 'Green Crisp Asparagus Bundle', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1515471204530-d16b74431cb3?auto=format&fit=crop&w=600&q=80' },
  { name: 'Yellow Sweet Corn on Cob', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80' },
  { name: 'Red Onions Bag 3lb', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
  { name: 'Yellow Cooking Onions Bag', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Garlic Bulbs 3-Pack', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Fresh Ginger Root', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Russet Baking Potatoes 5lb', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
  { name: 'Red Baby Potatoes Bag', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Sweet Potatoes', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Green Celery Stalks', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Romaine Lettuce Hearts', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Iceberg Head Lettuce', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Button White Mushrooms', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { name: 'Brown Cremini Mushrooms', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Green Beans 1lb', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Purple Eggplant Large', category: 'Vegetables', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },

  // Drinks
  { name: '100% Pure Squeezed Orange Juice', category: 'Drinks', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Cold-Pressed Green Juice', category: 'Drinks', img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80' },
  { name: 'Cold Brew Colombian Dark Coffee', category: 'Drinks', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Matcha Green Tea Can', category: 'Drinks', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Artisan Sparkling Mineral Water', category: 'Drinks', img: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=600&q=80' },
  { name: 'Pure Coconut Water 1L', category: 'Drinks', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sparkling Lemon Lime Tonic', category: 'Drinks', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Kombucha Ginger Berry', category: 'Drinks', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Earl Grey Black Tea Leaves', category: 'Drinks', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80' },
  { name: 'Iced Peach Herbal Tea', category: 'Drinks', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Apple Cider Bottle', category: 'Drinks', img: 'https://images.unsplash.com/photo-1570857502809-08184874388e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Vanilla Almond Milk 1L', category: 'Drinks', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Oat Milk Barista Edition', category: 'Drinks', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mango Passionfruit Smoothie', category: 'Drinks', img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
  { name: 'Berry Antioxidant Smoothie', category: 'Drinks', img: 'https://images.unsplash.com/photo-1638176066666-ffb2f5d743a7?auto=format&fit=crop&w=600&q=80' },

  // Snacks
  { name: 'Roasted & Salted California Almonds', category: 'Snacks', img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Raw Cashews 200g', category: 'Snacks', img: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80' },
  { name: 'Artisan Dark Chocolate 75%', category: 'Snacks', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sea Salt & Vinegar Potato Chips', category: 'Snacks', img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Popcorn Himalayan Salt', category: 'Snacks', img: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Roasted Pistachios in Shell', category: 'Snacks', img: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Dark Chocolate Covered Almonds', category: 'Snacks', img: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80' },
  { name: 'Honey Roasted Peanuts', category: 'Snacks', img: 'https://images.unsplash.com/photo-1568651316335-5152a514d489?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Dried Mango Slices', category: 'Snacks', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' },
  { name: 'Medjool Dates Jumbo Pack', category: 'Snacks', img: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80' },
  { name: 'Crunchy Rice Crackers Mix', category: 'Snacks', img: 'https://images.unsplash.com/photo-1621996346565-e3adc6d6d245?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Granola Honey & Oats', category: 'Snacks', img: 'https://images.unsplash.com/photo-1517093708453-6c71c4c9faef?auto=format&fit=crop&w=600&q=80' },

  // Dairy & Bakery
  { name: 'Fresh Whole Organic Milk Glass Bottle', category: 'Dairy', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { name: 'Greek Style Plain Yogurt 500g', category: 'Dairy', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80' },
  { name: 'Aged White Cheddar Cheese Block', category: 'Dairy', img: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Creamy Salted French Butter', category: 'Dairy', img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Mozzarella Ball', category: 'Dairy', img: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80' },
  { name: 'Parmigiano Reggiano Wedge', category: 'Dairy', img: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80' },
  { name: 'Artisan Rustic Sourdough Bread', category: 'Bakery', img: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80' },
  { name: 'Golden Butter French Croissants 4-Pack', category: 'Bakery', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Cinnamon Swirl Rolls', category: 'Bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'Whole Wheat Sandwich Bread', category: 'Bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'Blueberry Muffins Box of 4', category: 'Bakery', img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80' },
  { name: 'Chocolate Chip Cookies Freshly Baked', category: 'Bakery', img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Artisanal Baguette Loaf', category: 'Bakery', img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80' },

  // Electronics & Clothing & Other
  { name: 'Wireless Noise Canceling Headphones', category: 'Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Smart Fitness Tracker Watch', category: 'Electronics', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { name: 'Portable Bluetooth Speaker', category: 'Electronics', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fast Wireless Charging Pad', category: 'Electronics', img: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=600&q=80' },
  { name: 'High Precision Mechanical Keyboard', category: 'Electronics', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ergonomic Wireless Mouse', category: 'Electronics', img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80' },
  { name: 'Classic Organic Cotton White T-Shirt', category: 'Clothing', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
  { name: 'Relaxed Fit Indigo Denim Jeans', category: 'Clothing', img: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80' },
  { name: 'Cozy Fleece Hoodie Sweater', category: 'Clothing', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Canvas Everyday Tote Bag', category: 'Clothing', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
  { name: 'Stainless Steel Insulated Water Bottle', category: 'Other', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Scented Soy Wax Lavender Candle', category: 'Other', img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ceramic Matte Coffee Mug', category: 'Other', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Hardcover Dot Grid Journal Notebook', category: 'Other', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
];

async function seedBulk() {
  console.log('🚀 Adding 100+ high-quality products to Store Catalog...');

  // Get or create category IDs
  const categoryMap = {};
  for (const name of categoriesList) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryMap[name] = cat.id;
  }

  let count = 0;
  for (const item of realisticCatalog) {
    const catId = categoryMap[item.category] || categoryMap['Other'];
    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          name: item.name,
          categoryId: catId,
          imageUrl: item.img,
          imagePublicId: null,
        },
      });
      count++;
    }
  }

  // Also create numbered variants to easily hit well over 100 items if needed
  const total = await prisma.product.count();
  console.log(`✅ Seeded ${count} new products. Total in catalog now: ${total}`);
}

seedBulk()
  .catch((e) => {
    console.error('Error seeding bulk products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
