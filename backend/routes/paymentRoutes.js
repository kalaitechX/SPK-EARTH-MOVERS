const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const Booking = require('../models/Booking');
const { createNotification } = require('../utils/notificationHelper');

router.get('/', protect, (req, res) => {
  if (req.user.role === 'farmer') {
    return res.json({ success: true, message: "Fetched farmer's own payments", farmerId: req.user._id });
  } else if (req.user.role === 'owner') {
    return res.json({ success: true, message: "Fetched all payments for owner" });
  } else {
    return res.status(403).json({ success: false, message: 'Not authorized to access this route' });
  }
});

router.put('/:id/confirm', protect, authorizeRoles('owner'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      // Add amount fields if needed, or just emit notification
      await createNotification(req, {
        recipientId: booking.farmerId,
        type: 'AMOUNT_CONFIRMED',
        title: 'Amount Confirmed',
        message: `The final work amount for your booking ${booking.bookingId} has been confirmed.`,
        bookingId: booking._id
      });
    }
    res.json({ success: true, message: "Work amount confirmed by owner" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/pay', protect, authorizeRoles('owner'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      await createNotification(req, {
        recipientId: booking.farmerId,
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Received',
        message: `Your cash payment for booking ${booking.bookingId} has been marked as received.`,
        bookingId: booking._id
      });
    }
    res.json({ success: true, message: "Cash payment marked as received by owner" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
