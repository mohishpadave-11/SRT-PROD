const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { authRateLimit, registrationRateLimit } = require('../middleware/rateLimiting');

// Apply specific rate limiting to auth endpoints
router.post('/register', registrationRateLimit, register);
router.post('/login', authRateLimit, login);

module.exports = router;