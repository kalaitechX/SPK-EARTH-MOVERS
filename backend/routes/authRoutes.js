const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerFarmer,
  loginFarmer,
  loginDriver,
  loginOwner,
  getMe,
  updateProfile
} = require('../controllers/authController');

router.post('/farmer/register', registerFarmer);
router.post('/farmer/login', loginFarmer);
router.post('/driver/login', loginDriver);
router.post('/owner/login', loginOwner);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
