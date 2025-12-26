const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/customErrors');

const protect = (req, res, next) => {
  let token;

  // Check if header starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user info to the request
      req.user = decoded;
      
      next(); // Move to the next step
    } catch (error) {
      return next(new UnauthorizedError('Not authorized, token failed'));
    }
  }

  if (!token) {
    return next(new UnauthorizedError('Not authorized, no token'));
  }
};

module.exports = { protect };