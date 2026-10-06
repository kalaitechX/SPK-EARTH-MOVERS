const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const { createNotification } = require('../utils/notificationHelper');

const createBooking = async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    const bookingId = `SPK-BOOK-${String(count + 1).padStart(6, '0')}`;
    
    const booking = new Booking({
      ...req.body,
      bookingId,
      farmerId: req.user._id,
      status: 'Pending',
      paymentMethod: 'Cash'
    });
    
    const savedBooking = await booking.save();

    // Create Notification for Owner
    const owner = await mongoose.model('User').findOne({ role: 'owner' });
    if (owner) {
      await createNotification(req, {
        recipientId: owner._id,
        type: 'NEW_BOOKING',
        title: 'New Booking Received',
        message: `New ${savedBooking.vehicleType} booking received from ${req.user.name || 'a farmer'}.`,
        bookingId: savedBooking._id
      });
    }

    const bookingObj = savedBooking.toObject();
    bookingObj.farmerName = req.user.name || 'Farmer';
    bookingObj.farmerPhone = req.user.mobile || '9876543210';

    res.status(201).json({ success: true, booking: bookingObj });
  } catch (error) {
    if (error.code === 11000) { 
      const newBookingId = `SPK-BOOK-${Math.floor(Date.now() / 1000)}`;
      try {
        const booking = new Booking({
          ...req.body,
          bookingId: newBookingId,
          farmerId: req.user._id,
          status: 'Pending',
          paymentMethod: 'Cash'
        });
        const savedBooking = await booking.save();
        const owner = await mongoose.model('User').findOne({ role: 'owner' });
        if (owner) {
          await createNotification(req, {
            recipientId: owner._id,
            type: 'NEW_BOOKING',
            title: 'New Booking Received',
            message: `New ${savedBooking.vehicleType} booking received from ${req.user.name || 'a farmer'}.`,
            bookingId: savedBooking._id
          });
        }
        const bookingObj = savedBooking.toObject();
        bookingObj.farmerName = req.user.name || 'Farmer';
        bookingObj.farmerPhone = req.user.mobile || '9876543210';
        return res.status(201).json({ success: true, booking: bookingObj });
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ farmerId: req.user._id }).sort({ createdAt: -1 }).populate('farmerId', 'name mobile');
    const formattedBookings = bookings.map(b => {
      const obj = b.toObject();
      if (b.farmerId) {
        obj.farmerName = b.farmerId.name || 'Farmer';
        obj.farmerPhone = b.farmerId.mobile || '9876543210';
      }
      return obj;
    });
    res.json({ success: true, bookings: formattedBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('farmerId', 'name mobile').populate('driverId', 'name mobile');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (req.user.role === 'farmer' && booking.farmerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    if (req.user.role === 'driver' && booking.driverId && booking.driverId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const bookingObj = booking.toObject();
    if (booking.farmerId) {
      bookingObj.farmerName = booking.farmerId.name || 'Farmer';
      bookingObj.farmerPhone = booking.farmerId.mobile || '9876543210';
    }
    res.json({ success: true, booking: bookingObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.status && req.query.status !== 'All') query.status = req.query.status;
    if (req.query.vehicleType && req.query.vehicleType !== 'All') query.vehicleType = req.query.vehicleType;
    if (req.query.date) {
      const dateStr = req.query.date;
      query.workDate = {
        $gte: new Date(dateStr),
        $lt: new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + 1))
      };
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('farmerId', 'name mobile')
      .populate('driverId', 'name mobile');
      
    const formattedBookings = bookings.map(b => {
      const obj = b.toObject();
      if (b.farmerId) {
        obj.farmerName = b.farmerId.name || 'Farmer';
        obj.farmerPhone = b.farmerId.mobile || '9876543210';
      }
      return obj;
    });

    res.json({ success: true, bookings: formattedBookings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    const { status, rejectionReason } = req.body;

    if (req.user.role === 'owner') {
      if (status === 'Accepted' && booking.status !== 'Pending') {
        return res.status(400).json({ success: false, message: 'Only Pending bookings can be accepted' });
      }
      if (status === 'Rejected' && booking.status !== 'Pending') {
        return res.status(400).json({ success: false, message: 'Only Pending bookings can be rejected' });
      }
      booking.status = status;
      if (rejectionReason) booking.rejectionReason = rejectionReason;
    } else if (req.user.role === 'driver') {
      if (!booking.driverId || booking.driverId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not assigned to this driver' });
      }
      if (status === 'In Progress' && booking.status !== 'Driver Assigned') {
        return res.status(400).json({ success: false, message: 'Invalid transition' });
      }
      if (status === 'Completed' && booking.status !== 'In Progress') {
        return res.status(400).json({ success: false, message: 'Invalid transition' });
      }
      booking.status = status;
      if (status === 'In Progress') booking.workStartedAt = req.body.workStartedAt || new Date();
      if (status === 'Completed') {
        booking.workCompletedAt = req.body.workCompletedAt || new Date();
        booking.actualWorkHours = req.body.actualWorkHours;
        booking.driverNotes = req.body.driverNotes;
      }
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedBooking = await booking.save();

    // Notifications for status update
    if (status === 'Accepted') {
      await createNotification(req, {
        recipientId: updatedBooking.farmerId,
        type: 'BOOKING_ACCEPTED',
        title: 'Booking Accepted',
        message: 'Your SPK Earth Movers booking has been accepted.',
        bookingId: updatedBooking._id
      });
    } else if (status === 'Rejected') {
      await createNotification(req, {
        recipientId: updatedBooking.farmerId,
        type: 'BOOKING_REJECTED',
        title: 'Booking Rejected',
        message: rejectionReason ? `Booking rejected: ${rejectionReason}` : 'Your SPK Earth Movers booking has been rejected.',
        bookingId: updatedBooking._id
      });
    } else if (status === 'In Progress') {
      const owner = await mongoose.model('User').findOne({ role: 'owner' });
      if (owner) {
        await createNotification(req, {
          recipientId: owner._id,
          type: 'WORK_STARTED',
          title: 'Work Started',
          message: `Work has started for booking ${updatedBooking.bookingId}.`,
          bookingId: updatedBooking._id
        });
      }
      await createNotification(req, {
        recipientId: updatedBooking.farmerId,
        type: 'WORK_STARTED',
        title: 'Work Started',
        message: `Work has started for your booking ${updatedBooking.bookingId}.`,
        bookingId: updatedBooking._id
      });
    } else if (status === 'Completed') {
      const owner = await mongoose.model('User').findOne({ role: 'owner' });
      if (owner) {
        await createNotification(req, {
          recipientId: owner._id,
          type: 'WORK_COMPLETED',
          title: 'Work Completed',
          message: `Work completed for booking ${updatedBooking.bookingId} at ${updatedBooking.location?.village || 'the site'}.`,
          bookingId: updatedBooking._id
        });
      }
      await createNotification(req, {
        recipientId: updatedBooking.farmerId,
        type: 'WORK_COMPLETED',
        title: 'Work Completed',
        message: `Work completed for your booking ${updatedBooking.bookingId}.`,
        bookingId: updatedBooking._id
      });
    }

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const assignBooking = async (req, res) => {
  try {
    const { vehicleId, driverId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ success: false, message: 'Invalid Driver ID' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.status !== 'Accepted') {
      return res.status(400).json({ success: false, message: 'Booking must be Accepted first' });
    }
    
    // We check valid objectId for driverId, but for vehicle we don't strict check it just in case. 
    // We update it directly.
    booking.vehicleId = vehicleId;
    booking.driverId = driverId;
    booking.status = 'Driver Assigned';
    
    const updatedBooking = await booking.save();
    
    // Notify Driver
    await createNotification(req, {
      recipientId: driverId,
      type: 'DRIVER_ASSIGNED',
      title: 'New Job Assigned',
      message: `You have been assigned a ${updatedBooking.vehicleType} job.`,
      bookingId: updatedBooking._id
    });

    // Notify Farmer
    await createNotification(req, {
      recipientId: updatedBooking.farmerId,
      type: 'DRIVER_ASSIGNED',
      title: 'Driver Assigned',
      message: `A driver has been assigned to your ${updatedBooking.vehicleType} booking.`,
      bookingId: updatedBooking._id
    });

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getOwnerBookings,
  updateBookingStatus,
  assignBooking
};
