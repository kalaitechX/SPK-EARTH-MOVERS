const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { updateLocation, getActiveLocations } = require('../controllers/locationController');

router.post('/', protect, updateLocation);
router.get('/', protect, authorizeRoles('owner'), getActiveLocations);

module.exports = router;
