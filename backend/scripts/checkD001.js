require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const checkD001 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spk_db');
    const drivers = await User.find({ role: 'driver' }).select('+password');
    console.log('All drivers:', drivers.map(d => ({ mobile: d.mobile, pass: d.password, role: d.role, status: d.status })));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkD001();
