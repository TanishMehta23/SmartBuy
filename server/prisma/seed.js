import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@storecatalog.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword123!';

  // 1. Seed Initial Admin Account
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash,
      },
    });
    console.log(`✅ Admin account created: ${admin.email}`);
  } else {
    console.log(`ℹ️ Admin account already exists: ${adminEmail}`);
  }

  // 2. Seed Default Categories
  const defaultCategories = [
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

  const categoryMap = {};

  for (const catName of defaultCategories) {
    const category = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });
    categoryMap[catName] = category.id;
  }
  console.log(`✅ Seeded ${defaultCategories.length} categories.`);

  // 3. Seed Initial Sample Products with beautiful curated WebP Unsplash/CDN images
  const sampleProducts = [
    // Fruits
    {
      name: 'Organic Red Fuji Apples',
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Fresh Cavendish Bananas',
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Valencia Sweet Oranges',
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Fresh Strawberries Pack',
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Seedless Green Grapes',
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Ripe Hass Avocados',
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Sweet Tropical Mango',
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Fresh Blueberries Box',
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
    },

    // Vegetables
    {
      name: 'Crisp Organic Broccoli',
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Fresh Baby Spinach Leaves',
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Farm Fresh Red Tomatoes',
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Crunchy Orange Carrots',
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Green Bell Peppers',
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    },

    // Drinks
    {
      name: 'Freshly Squeezed Orange Juice',
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Cold Brew Colombian Coffee',
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Japanese Organic Matcha Green Tea',
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Natural Sparkling Mineral Water',
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=600&q=80',
    },

    // Snacks
    {
      name: 'Roasted & Salted Almonds',
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Artisan Dark Chocolate 75%',
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Sea Salt Kettle Potato Chips',
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    },

    // Dairy & Bakery
    {
      name: 'Organic Whole Milk Bottle',
      category: 'Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Artisanal Sourdough Bread Loaf',
      category: 'Bakery',
      imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Golden Flaky French Croissants',
      category: 'Bakery',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    },
  ];

  for (const item of sampleProducts) {
    const categoryId = categoryMap[item.category];
    if (categoryId) {
      const existingProduct = await prisma.product.findFirst({
        where: { name: item.name },
      });
      if (!existingProduct) {
        await prisma.product.create({
          data: {
            name: item.name,
            imageUrl: item.imageUrl,
            imagePublicId: null,
            categoryId,
          },
        });
      }
    }
  }

  console.log(`✅ Seeded ${sampleProducts.length} sample products with high-res images.`);
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
