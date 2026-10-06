const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'NEW_BOOKING',
      'BOOKING_ACCEPTED',
      'BOOKING_REJECTED',
      'DRIVER_ASSIGNED',
      'WORK_STARTED',
      'WORK_COMPLETED',
      'AMOUNT_CONFIRMED',
      'PAYMENT_RECEIVED'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  }
}, { timestamps: true });

// Ensure compound indexes if needed for efficient unread queries
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
