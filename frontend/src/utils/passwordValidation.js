/**
 * Consistent password validation utility
 * Rules: At least 8 characters, 1 uppercase letter, 1 number
 */

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true
};

export const PASSWORD_ERROR_MESSAGE = 'Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 number.';

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets all requirements
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false;
  }

  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

/**
 * Get detailed password validation errors
 * @param {string} password - Password to validate
 * @returns {string[]} - Array of error messages
 */
export const getPasswordValidationErrors = (password) => {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
    return errors;
  }

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least 1 uppercase letter');
  }

  if (PASSWORD_REQUIREMENTS.requireNumber && !/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least 1 number');
  }

  return errors;
};

/**
 * Get single password validation error message
 * @param {string} password - Password to validate
 * @returns {string} - First error message or empty string if valid
 */
export const getPasswordValidationError = (password) => {
  const errors = getPasswordValidationErrors(password);
  return errors.length > 0 ? errors[0] : '';
};
