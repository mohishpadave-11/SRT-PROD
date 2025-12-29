const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/customErrors');

const protect = (req, res, next) => {
  let token;

  // Check if header starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
      
      // Validate token exists after extraction
      if (!token) {
        return next(new UnauthorizedError('Not authorized, invalid token format'));
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Validate decoded token has required fields
      if (!decoded.id || !decoded.role) {
        return next(new UnauthorizedError('Not authorized, invalid token payload'));
      }
      
      // Add user info to the request
      req.user = decoded;
      
      return next(); // Move to the next step and exit
    } catch (error) {
      // Handle specific JWT errors for better security
      if (error.name === 'TokenExpiredError') {
        return next(new UnauthorizedError('Not authorized, token expired'));
      } else if (error.name === 'JsonWebTokenError') {
        return next(new UnauthorizedError('Not authorized, invalid token'));
      }
      return next(new UnauthorizedError('Not authorized, token verification failed'));
    }
  }

  // No authorization header provided
  return next(new UnauthorizedError('Not authorized, no token provided'));
};

module.exports = { protect };