const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  village: String,
  district: String,
  landmark: String,
  address: String,
  latitude: Number,
  longitude: Number
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['JCB', 'Tractor', 'Tipper'],
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  workType: {
    type: String,
    required: true
  },
  workDescription: {
    type: String
  },
  estimatedHours: {
    type: Number
  },
  workDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  location: locationSchema,
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Driver Assigned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash'],
    default: 'Cash'
  },
  rejectionReason: {
    type: String
  },
  workStartedAt: Date,
  workCompletedAt: Date,
  actualWorkHours: Number,
  driverNotes: String,
  workStartedLocation: locationSchema,
  workCompletedLocation: locationSchema,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
