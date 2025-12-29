const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Protect all dashboard routes with authentication
router.use(protect);

// @route   GET /api/dashboard/data
// @desc    Get dashboard statistics
// @access  Private
router.get('/data', getDashboardData);

module.exports = router;