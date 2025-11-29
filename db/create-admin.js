import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const name = 'Admin User';

  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('Admin user already exists with email:', email);
      return;
    }

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'admin'
      }
    });

    // Create password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.password.create({
      data: {
        userId: user.id,
        password_hash: hashedPassword
      }
    });

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();