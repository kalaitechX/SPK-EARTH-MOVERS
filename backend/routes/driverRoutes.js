const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const Booking = require('../models/Booking');

router.get('/', protect, authorizeRoles('owner'), (req, res) => {
  res.json({ success: true, message: "Fetched all drivers for owner" });
});

router.post('/', protect, authorizeRoles('owner'), (req, res) => {
  res.json({ success: true, message: "Driver account created by owner" });
});

router.get('/jobs', protect, authorizeRoles('driver'), async (req, res) => {
  try {
    const jobs = await Booking.find({ driverId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('farmerId', 'name mobile')
      .populate('vehicleId', 'name');
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
