/**
 * Consistent email validation utility
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email format is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return EMAIL_REGEX.test(email);
};

/**
 * Get email validation error message
 * @param {string} email - Email to validate
 * @returns {string} - Error message or empty string if valid
 */
export const getEmailValidationError = (email) => {
  if (!email) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};
