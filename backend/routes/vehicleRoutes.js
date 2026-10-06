const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, authorizeRoles('owner'), (req, res) => {
  res.json({ success: true, message: "Fetched all vehicles" });
});

router.post('/', protect, authorizeRoles('owner'), (req, res) => {
  res.json({ success: true, message: "Vehicle added" });
});

module.exports = router;
