const Notification = require('../models/Notification');
const { sendPushNotification } = require('../services/pushNotificationService');

const createNotification = async (req, notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${notificationData.recipientId}`).emit('notification:new', {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        bookingId: notification.bookingId,
        isRead: notification.isRead,
        createdAt: notification.createdAt
      });
    }
    
    // Trigger web push notification
    const pushPayload = {
      title: notification.title,
      message: notification.message,
      bookingId: notification.bookingId,
      url: notification.bookingId ? `/bookings/${notification.bookingId}` : '/'
    };
    sendPushNotification(notificationData.recipientId, pushPayload).catch(err => {
      console.error('Failed to trigger web push in background:', err);
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { createNotification };
