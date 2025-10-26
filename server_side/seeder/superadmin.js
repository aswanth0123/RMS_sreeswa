import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Superadmin already exists');
      return;
    }

    const superAdmin = new User({
      username: 'admin',
      password: 'Admin123',
      role: 'superadmin' // Meets validation: uppercase, lowercase, number
    });

    await superAdmin.save();
    console.log('Superadmin created successfully');
    console.log('Username: admin');
    console.log('Password: Admin123');

  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedSuperAdmin();
