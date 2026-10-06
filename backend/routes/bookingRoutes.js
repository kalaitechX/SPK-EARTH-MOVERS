const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getOwnerBookings,
  updateBookingStatus,
  assignBooking
} = require('../controllers/bookingController');

router.post('/', protect, authorizeRoles('farmer'), createBooking);
router.get('/my', protect, authorizeRoles('farmer'), getMyBookings);
router.get('/', protect, authorizeRoles('owner'), getOwnerBookings);

// Get by ID applies to all roles, controller logic will restrict access
router.get('/:id', protect, getBookingById);

// Status updates by Owner or Driver
router.patch('/:id/status', protect, authorizeRoles('owner', 'driver'), updateBookingStatus);

// Assignment by Owner
router.post('/:id/assign', protect, authorizeRoles('owner'), assignBooking);

module.exports = router;
