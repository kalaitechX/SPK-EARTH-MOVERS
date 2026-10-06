require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const createDriver = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spk_db');
    
    const driverMobile = '9876543210';
    
    let driver = await User.findOne({ mobile: driverMobile });
    if (!driver) {
      driver = await User.create({
        name: 'Test Driver',
        mobile: driverMobile,
        password: 'password123',
        role: 'driver',
        licenceNumber: 'TN-12-3456789'
      });
      console.log('Driver created successfully!');
    } else {
      console.log('Driver already exists!');
      // Update password just in case
      driver.password = 'password123';
      driver.role = 'driver';
      await driver.save();
      console.log('Driver password reset to password123');
    }
    
    console.log(`Mobile: ${driverMobile}`);
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createDriver();
