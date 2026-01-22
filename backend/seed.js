// Seed script to create initial admin user and sample data
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@shopease.com' });
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@shopease.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true
      });
      console.log('✅ Admin user created: admin@shopease.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample categories
    const categoryData = [
      { name: 'Electronics', icon: 'phone-portrait-outline', description: 'Smartphones, laptops, and gadgets' },
      { name: 'Fashion', icon: 'shirt-outline', description: 'Clothing, shoes, and accessories' },
      { name: 'Home & Kitchen', icon: 'home-outline', description: 'Furniture and kitchen appliances' },
      { name: 'Sports', icon: 'fitness-outline', description: 'Sports equipment and activewear' },
      { name: 'Beauty', icon: 'sparkles-outline', description: 'Skincare, makeup, and personal care' },
    ];

    for (const cat of categoryData) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Category created: ${cat.name}`);
      }
    }

    // Create sample products
    const categories = await Category.find();
    const electronics = categories.find(c => c.name === 'Electronics');
    const fashion = categories.find(c => c.name === 'Fashion');

    const productData = [
      {
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.',
        price: 299.99,
        compareAtPrice: 399.99,
        category: electronics?._id,
        brand: 'AudioTech',
        stock: 50,
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', isDefault: true }],
        isFeatured: true,
        isNewArrival: true,
        rating: 4.5,
        reviewCount: 128,
        variants: {
          colors: [
            { type: 'color', value: 'Black', stock: 25 },
            { type: 'color', value: 'White', stock: 15 },
            { type: 'color', value: 'Blue', stock: 10 }
          ]
        }
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
        price: 449.99,
        compareAtPrice: 549.99,
        category: electronics?._id,
        brand: 'TechWear',
        stock: 30,
        images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', isDefault: true }],
        isFeatured: true,
        rating: 4.7,
        reviewCount: 89
      },
      {
        name: 'Classic Leather Jacket',
        description: 'Premium leather jacket with modern fit. Perfect for casual and semi-formal occasions.',
        price: 189.99,
        compareAtPrice: 249.99,
        category: fashion?._id,
        brand: 'UrbanStyle',
        stock: 25,
        images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', isDefault: true }],
        isFeatured: true,
        rating: 4.3,
        reviewCount: 56,
        variants: {
          sizes: [
            { type: 'size', value: 'S', stock: 5 },
            { type: 'size', value: 'M', stock: 10 },
            { type: 'size', value: 'L', stock: 7 },
            { type: 'size', value: 'XL', stock: 3 }
          ]
        }
      },
      {
        name: 'Running Sneakers',
        description: 'Lightweight running shoes with cushioned sole and breathable mesh upper.',
        price: 129.99,
        category: fashion?._id,
        brand: 'SportMax',
        stock: 100,
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', isDefault: true }],
        isNewArrival: true,
        rating: 4.6,
        reviewCount: 234,
        variants: {
          sizes: [
            { type: 'size', value: '8', stock: 20 },
            { type: 'size', value: '9', stock: 25 },
            { type: 'size', value: '10', stock: 30 },
            { type: 'size', value: '11', stock: 15 },
            { type: 'size', value: '12', stock: 10 }
          ],
          colors: [
            { type: 'color', value: 'Red', stock: 40 },
            { type: 'color', value: 'Black', stock: 35 },
            { type: 'color', value: 'White', stock: 25 }
          ]
        }
      }
    ];

    for (const prod of productData) {
      const exists = await Product.findOne({ name: prod.name });
      if (!exists && prod.category) {
        await Product.create(prod);
        console.log(`✅ Product created: ${prod.name}`);
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@shopease.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
