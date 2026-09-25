import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// 10 Curated, premium categories including Bathroom, Eatables, Makeup, etc.
const categoriesData = [
  { name: 'Eatables & Pantry', order: 1 },
  { name: 'Bathroom & Hygiene', order: 2 },
  { name: 'Makeup & Beauty', order: 3 },
  { name: 'Fresh Fruits', order: 4 },
  { name: 'Fresh Vegetables', order: 5 },
  { name: 'Artisan Bakery', order: 6 },
  { name: 'Dairy & Eggs', order: 7 },
  { name: 'Drinks & Beverages', order: 8 },
  { name: 'Snacks & Sweets', order: 9 },
  { name: 'Household & Cleaning', order: 10 },
];

const productsData = [
  // ─── 1. Eatables & Pantry (10 items) ───
  {
    category: 'Eatables & Pantry',
    name: 'Extra Virgin Portuguese Olive Oil 750ml',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'Italian Bronze-Cut Penne Rigate Pasta 500g',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3adc6d6d245?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'Organic Basmati Long Grain Rice 1kg',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'San Marzano Crushed Canned Tomatoes 400g',
    imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'Organic Raw Wildflower Honey 500g',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'Natural Crunchy Peanut Butter 350g',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'Organic Rolled Oats Whole Grain 1kg',
    imageUrl: 'https://images.unsplash.com/photo-1517093708453-6c71c4c9faef?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'Fine Sea Salt from Algarve 1kg',
    imageUrl: 'https://images.unsplash.com/photo-1518110903495-cd99c129f170?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'Whole Black Peppercorn Grinder 100g',
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Eatables & Pantry',
    name: 'Traditional Portuguese Tuna Fillets in Olive Oil',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 2. Bathroom & Hygiene (10 items) ───
  {
    category: 'Bathroom & Hygiene',
    name: 'Moisturizing Liquid Hand Wash with Aloe 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'Nourishing Coconut & Argan Body Wash 400ml',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'Herbal Essence Hydrating Shampoo 400ml',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'Silk & Shine Repair Conditioner 350ml',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'Ultra Soft 3-Ply Luxury Toilet Tissue 12 Rolls',
    imageUrl: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'Colgate Total Care Whitening Toothpaste 100ml',
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e111241a7e4e?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'Eco-Friendly Bamboo Toothbrushes 4-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'Antibacterial Hand Sanitizer Gel 250ml',
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'French Lavender Botanical Bar Soap 150g',
    imageUrl: 'https://images.unsplash.com/photo-1607006314592-3c139c878953?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Bathroom & Hygiene',
    name: 'Soft Plush Cotton Bathroom Bath Towel',
    imageUrl: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 3. Makeup & Beauty (10 items) ───
  {
    category: 'Makeup & Beauty',
    name: 'Hydrating Matte Velvet Liquid Lipstick',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'Luminous Glow Longwear Liquid Foundation 30ml',
    imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'Volumizing & Lengthening Waterproof Mascara',
    imageUrl: 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'Warm Nudes 12-Shade Eyeshadow Palette',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'Rose Quartz Radiance Powder Blush',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'Hyaluronic Acid Hydrating Face Serum 30ml',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'Micellar Cleansing Water All-in-1 400ml',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'SPF 50+ Invisible Daily Sunscreen Gel 50ml',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'Professional Makeup Brush Set 8-Piece',
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Makeup & Beauty',
    name: 'Soothing Chamomile Facial Sheet Masks 5-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 4. Fresh Fruits (10 items) ───
  {
    category: 'Fresh Fruits',
    name: 'Organic Royal Gala Apples 1kg',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Sweet Bananas from Madeira Bunch',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Sweet Algarve Valencia Oranges 2kg',
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Farm Fresh Strawberries Punnet 500g',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Seedless Red Crimson Grapes 500g',
    imageUrl: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Premium Hass Avocados Ready to Eat 2-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Sweet Tropical Mango Tree-Ripened',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Organic Blueberries Clamshell 250g',
    imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Sweet Golden Extra Sweet Pineapple',
    imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Fruits',
    name: 'Fresh Rocha Pears from Portugal 1kg',
    imageUrl: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 5. Fresh Vegetables (10 items) ───
  {
    category: 'Fresh Vegetables',
    name: 'Organic Fresh Broccoli Crown',
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Crisp Baby Spinach Washed Leaves 300g',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Sweet Cherry Vine Tomatoes 400g',
    imageUrl: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Organic Sweet Orange Carrots Bunch 1kg',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Tricolor Bell Peppers Pack of 3',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Crisp Green English Cucumbers 2-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Fresh Purple Garlic Bulbs 3-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Red Onions Bag 1kg',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Portuguese Sweet Potatoes 1kg',
    imageUrl: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Fresh Vegetables',
    name: 'Fresh White Button Mushrooms 300g',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 6. Artisan Bakery (10 items) ───
  {
    category: 'Artisan Bakery',
    name: 'Traditional Pastéis de Nata Custard Tarts 6-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Rustic Sourdough Loaf Slow-Fermented',
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Golden French All-Butter Croissants 4-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Freshly Baked Artisanal Baguette Loaf',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Traditional Portuguese Pão de Mafra Bread',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Chocolate Chip Brioche Rolls 6-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Blueberry Streusel Muffins Box of 4',
    imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Whole Seeded Grain Sandwich Bread 500g',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Cinnamon Swirl Danish Pastries 2-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Artisan Bakery',
    name: 'Gourmet Red Velvet Cupcakes Box of 4',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 7. Dairy & Eggs (10 items) ───
  {
    category: 'Dairy & Eggs',
    name: 'Mimosa Fresh Semi-Skimmed Milk 1L',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Free-Range Fresh Farm Eggs Grade A 12-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Queijo São Jorge Island Cheese Aged 7 Months 300g',
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Authentic Greek Natural Plain Yogurt 500g',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Salted Portuguese Butter from Azores 250g',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Fresh Buffalo Mozzarella Ball 125g',
    imageUrl: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Aged White Cheddar Cheese Wedge 200g',
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Organic Barista Oat Drink 1L',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Vanilla Flavored Organic Skyr 400g',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Dairy & Eggs',
    name: 'Grated Parmigiano Reggiano DOP 100g',
    imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 8. Drinks & Beverages (10 items) ───
  {
    category: 'Drinks & Beverages',
    name: 'Compal 100% Squeezed Orange Nectar 1L',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Douro Valley Reserva Red Wine 750ml',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Vinho Verde Crisp White Wine 750ml',
    imageUrl: 'https://images.unsplash.com/photo-1558001373-a212acc60a69?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Pedras Salgadas Sparkling Natural Mineral Water 6x250ml',
    imageUrl: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Organic Cold Brew Colombian Coffee 330ml',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Pure Green Coconut Water 1L',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Organic Ginger & Lemon Sparkling Kombucha 330ml',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Artisan Crafted IPA Craft Beer 330ml',
    imageUrl: 'https://images.unsplash.com/photo-1608270192804-06d9fb7ce5d5?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Earl Grey Organic Loose Leaf Black Tea 100g',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Drinks & Beverages',
    name: 'Wild Berry Cold Pressed Fresh Juice 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 9. Snacks & Sweets (10 items) ───
  {
    category: 'Snacks & Sweets',
    name: 'Artisan Dark Chocolate 72% with Sea Salt 100g',
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Roasted California Almonds Sea Salted 200g',
    imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Kettle Cooked Olive Oil Potato Crisps 150g',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Organic Cashew Nuts Roasted & Lightly Salted 200g',
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Traditional Portuguese Butter Cookies Tin 250g',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Organic Popcorn with Pink Himalayan Salt 100g',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Jumbo Medjool Dates Natural Sweet 400g',
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Roasted Pistachios in Shell 250g',
    imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Chocolate Covered Roasted Hazelnut Pralines 150g',
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Snacks & Sweets',
    name: 'Organic Dried Mango Slices Unsweetened 150g',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 10. Household & Cleaning (10 items) ───
  {
    category: 'Household & Cleaning',
    name: 'Eco Dishwashing Liquid Citrus & Mint 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Plant-Based Laundry Detergent Lavender 1.5L',
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Multi-Surface Antibacterial Cleaning Spray 750ml',
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Ultra Absorbent Kitchen Paper Towel 3 Rolls',
    imageUrl: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Scented Soy Wax French Lavender Candle',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Natural Coconut Fiber Scrubber Sponges 4-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Lavender Fabric Conditioner Softener 1L',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Biodegradable Heavy-Duty Trash Bags 30L 20-Pack',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Glass & Window Streak-Free Shine Cleaner 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  },
  {
    category: 'Household & Cleaning',
    name: 'Aroma Reed Diffuser Fresh Linen & Jasmine 100ml',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  },
];

async function seed10CategoriesAndProducts() {
  console.log('✨ Seeding 10 categories with 10 products each (100 total products)...');

  // 1. Clear old demo products and categories to provide a completely clean catalog
  console.log('🧹 Cleaning existing products and categories...');
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Create the 10 Categories
  const catMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        order: cat.order,
      },
    });
    catMap[cat.name] = created.id;
    console.log(`📁 Created Category: ${cat.name} (order: ${cat.order})`);
  }

  // 3. Create 10 Products for Each Category
  let count = 0;
  for (const item of productsData) {
    const categoryId = catMap[item.category];
    if (!categoryId) {
      console.warn(`Category not found for: ${item.category}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: item.name,
        categoryId: categoryId,
        imageUrl: item.imageUrl,
        imagePublicId: null,
      },
    });
    count++;
  }

  console.log(`\n🎉 Successfully created 10 Categories and ${count} Products (10 in each category)!`);
}

seed10CategoriesAndProducts()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
