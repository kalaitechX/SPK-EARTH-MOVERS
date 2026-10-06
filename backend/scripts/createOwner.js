require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const ownerMobile = process.env.OWNER_MOBILE || '9999999999';
    
    const ownerExists = await User.findOne({ mobile: ownerMobile });
    
    if (ownerExists) {
      console.log('Owner account already exists!');
      process.exit();
    }
    
    const owner = await User.create({
      name: process.env.OWNER_NAME || 'SPK Owner',
      mobile: ownerMobile,
      password: process.env.OWNER_PASSWORD || 'admin123',
      role: 'owner'
    });
    
    if (owner) {
      console.log('Owner account created successfully!');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error creating owner:', error.message);
    process.exit(1);
  }
};

createOwner();
