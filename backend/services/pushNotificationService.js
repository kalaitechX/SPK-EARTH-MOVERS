const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (userId, payload) => {
  try {
    const subscriptions = await PushSubscription.find({ userId });
    
    if (!subscriptions || subscriptions.length === 0) {
      return { success: false, message: 'No subscriptions found for user' };
    }

    const payloadString = JSON.stringify({
      title: payload.title || 'SPK Earth Movers',
      body: payload.message,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      data: {
        url: payload.url || '/',
        bookingId: payload.bookingId
      }
    });

    const notifications = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payloadString);
        return { success: true, endpoint: sub.subscription.endpoint };
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          console.log(`[Push] Subscription expired or invalid for User ${userId}. Removing endpoint ending in ...${sub.subscription.endpoint.slice(-10)}`);
          await PushSubscription.deleteOne({ _id: sub._id });
        } else {
          console.error(`[Push] Delivery failed for User ${userId} with HTTP ${error.statusCode || 'unknown'}: ${error.message}`);
        }
        return { success: false, endpoint: sub.subscription.endpoint, error: error.message, statusCode: error.statusCode };
      }
    });

    const results = await Promise.all(notifications);
    return { success: true, results };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPushNotification
};
