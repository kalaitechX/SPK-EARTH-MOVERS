require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedDrivers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spk_earth_movers');
    
    const driverMobiles = ['D001', 'SPK-DRV-001', '9876543210'];
    
    for (const mobile of driverMobiles) {
      let driver = await User.findOne({ mobile });
      if (!driver) {
        driver = await User.create({
          name: 'Test Driver ' + mobile,
          mobile: mobile,
          password: 'password123',
          role: 'driver',
          licenceNumber: 'TN-12-3456789'
        });
        console.log(`Driver ${mobile} created successfully!`);
      } else {
        // Reset password just in case (will trigger pre-save hook properly)
        driver.password = 'password123';
        await driver.save();
        console.log(`Driver ${mobile} password reset.`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDrivers();
