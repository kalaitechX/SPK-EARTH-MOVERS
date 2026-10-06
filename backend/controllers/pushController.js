const PushSubscription = require('../models/PushSubscription');

const subscribe = async (req, res) => {
  try {
    const { subscription, deviceInfo } = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ success: false, message: 'Invalid subscription object' });
    }

    // Check if subscription already exists for this endpoint
    let existingSub = await PushSubscription.findOne({ 'subscription.endpoint': subscription.endpoint });
    
    if (existingSub) {
      // If it belongs to a different user, update the user (e.g. they logged out and logged in as another user)
      if (existingSub.userId.toString() !== req.user._id.toString()) {
        existingSub.userId = req.user._id;
        await existingSub.save();
      }
      return res.status(200).json({ success: true, message: 'Subscription already exists and is updated' });
    }

    const newSub = new PushSubscription({
      userId: req.user._id,
      subscription,
      deviceInfo
    });

    await newSub.save();
    res.status(201).json({ success: true, message: 'Successfully subscribed to push notifications' });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate endpoint race condition
      return res.status(200).json({ success: true, message: 'Subscription already exists' });
    }
    console.error('Push subscribe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ success: false, message: 'Endpoint is required' });
    }

    // Only allow removing subscription for the authenticated user
    await PushSubscription.deleteOne({ 'subscription.endpoint': endpoint, userId: req.user._id });
    
    res.status(200).json({ success: true, message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConfig = (req, res) => {
  res.status(200).json({
    success: true,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY
  });
};

const testPush = async (req, res) => {
  try {
    const { sendPushNotification } = require('../services/pushNotificationService');
    const payload = {
      title: 'Test Notification',
      message: 'This is a test notification from the SPK Earth Movers owner dashboard.',
      url: '/owner/dashboard'
    };
    
    // We send it to the logged-in user (who must be an owner)
    const result = await sendPushNotification(req.user._id, payload);
    
    if (result.success && result.results && result.results.length > 0) {
      res.status(200).json({ success: true, message: 'Test notification delivered successfully', result });
    } else {
      res.status(404).json({ success: false, message: 'No active push subscriptions found for this account' });
    }
  } catch (error) {
    console.error('Test push error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getConfig,
  testPush
};
