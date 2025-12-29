// Centralized Error Handler Middleware
const { sendError } = require('../utils/responseHelper');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error('Error:', err);

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(error => error.message).join(', ');
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Custom Error Classes
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  // Send standardized error response
  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? { stack: err.stack } : null);
};

module.exports = errorHandler;