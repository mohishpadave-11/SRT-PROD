const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Apply specific rate limiting to auth endpoints
router.post('/register', register);
router.post('/login', login);

module.exports = router;