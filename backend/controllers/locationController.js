const Location = require('../models/Location');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Update user location
// @route   POST /api/locations
// @access  Private
const updateLocation = async (req, res) => {
  const { latitude, longitude, accuracy, sessionActive, bookingId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.locationSharingEnabled) {
      return res.status(403).json({ success: false, message: 'Location sharing is not enabled' });
    }

    // Upsert the latest location
    let location = await Location.findOne({ userId: req.user._id });

    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.accuracy = accuracy;
      location.sessionActive = sessionActive;
      location.timestamp = Date.now();
      if (bookingId) location.bookingId = bookingId;
      await location.save();
    } else {
      location = await Location.create({
        userId: req.user._id,
        role: user.role,
        latitude,
        longitude,
        accuracy,
        sessionActive,
        bookingId
      });
    }

    // Socket emission logic if applicable (assume io is available via req.app.get('io'))
    const io = req.app.get('io');
    if (io && sessionActive) {
      io.emit('location_update', {
        userId: req.user._id,
        role: user.role,
        latitude,
        longitude,
        accuracy,
        timestamp: location.timestamp
      });
    }

    res.json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active locations for Owner map
// @route   GET /api/locations
// @access  Private (Owner only)
const getActiveLocations = async (req, res) => {
  try {
    // Only return locations where sessionActive is true
    // Also, we can filter by drivers who have an active booking
    // For now, let's just return all sessionActive=true locations
    const locations = await Location.find({ sessionActive: true }).populate('userId', 'name mobile licenceNumber role').populate('bookingId', 'bookingId status vehicleType');

    res.json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateLocation,
  getActiveLocations
};
