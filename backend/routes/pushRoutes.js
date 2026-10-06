const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { subscribe, unsubscribe, getConfig, testPush } = require('../controllers/pushController');
const rateLimit = require('express-rate-limit');

// Rate Limiting for subscriptions
const pushLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many subscription attempts, please try again later'
});

router.get('/config', getConfig);
router.post('/subscribe', protect, pushLimiter, subscribe);
router.post('/unsubscribe', protect, pushLimiter, unsubscribe);
router.post('/test', protect, authorizeRoles('owner'), testPush);

module.exports = router;
