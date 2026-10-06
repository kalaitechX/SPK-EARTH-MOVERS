require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const checkDriver = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spk_db');
    
    const driver = await User.findOne({ mobile: '9876543210' }).select('+password');
    if (!driver) {
      console.log('Driver not found in DB!');
    } else {
      console.log('Driver found:');
      console.log('ID:', driver._id);
      console.log('Mobile:', driver.mobile);
      console.log('Role:', driver.role);
      console.log('Status:', driver.status);
      console.log('Password (hashed):', driver.password);
      
      // Test password match
      const match = await driver.matchPassword('password123');
      console.log('Password Match for "password123":', match);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDriver();
