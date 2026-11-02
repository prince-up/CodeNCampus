const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin', protect, authorize('admin'), getAdminStats);

module.exports = router;
