import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.NEW_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = args[1] || process.env.NEW_ADMIN_PASSWORD || '';

  if (!email || !password) {
    console.error(`
❌ Usage:
   node create_admin.js <email> <password>

📌 Example:
   node create_admin.js manager@smartbuy.com MySecurePassword123
    `);
    process.exit(1);
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      const updated = await prisma.admin.update({
        where: { email },
        data: { passwordHash },
      });
      console.log(`\n✅ Admin password updated for: ${updated.email}`);
    } else {
      const newAdmin = await prisma.admin.create({
        data: {
          email,
          passwordHash,
        },
      });
      console.log(`\n🎉 New admin created successfully!`);
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   ID:    ${newAdmin.id}`);
    }
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

// node create_admin.js <new_admin_email> <new_admin_password>