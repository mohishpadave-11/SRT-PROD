/**
 * Production-grade token validation utilities
 */

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token to validate
 * @returns {boolean} - True if token is expired or invalid
 */
export const isTokenExpired = (token) => {
  if (!token || typeof token !== 'string') {
    return true;
  }
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if payload has expiration time
    if (!payload.exp || typeof payload.exp !== 'number') {
      return true;
    }
    
    // Compare expiration time with current time (with 30 second buffer)
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 30; // 30 seconds buffer before actual expiry
    
    return payload.exp <= (currentTime + bufferTime);
  } catch (error) {
    // If any error occurs during parsing, consider token invalid
    console.warn('Token validation error:', error);
    return true;
  }
};

/**
 * Get token expiration time in milliseconds
 * @param {string} token - JWT token
 * @returns {number|null} - Expiration time in milliseconds or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.exp || typeof payload.exp !== 'number') {
      return null;
    }
    
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

/**
 * Validate token and return user info if valid
 * @param {string} token - JWT token
 * @returns {object|null} - User info from token or null if invalid
 */
export const validateTokenAndGetUser = (token) => {
  if (isTokenExpired(token)) {
    return null;
  }
  
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    // Return user info from token payload
    return {
      id: payload.id,
      role: payload.role,
      exp: payload.exp,
      iat: payload.iat
    };
  } catch (error) {
    return null;
  }
};