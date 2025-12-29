/**
 * Global authentication utilities for production-grade token management
 */

// Global logout function reference
let globalLogout = null;

/**
 * Register the global logout function
 * @param {Function} logoutFn - Logout function from AuthContext
 */
export const setGlobalLogout = (logoutFn) => {
  if (typeof logoutFn === 'function') {
    globalLogout = logoutFn;
  } else {
    console.warn('setGlobalLogout: Expected function, received:', typeof logoutFn);
  }
};

/**
 * Trigger global logout (called from axios interceptor)
 * @param {string} reason - Reason for logout (for logging)
 */
export const triggerGlobalLogout = (reason = 'Token expired') => {
  if (globalLogout) {
    console.info('Triggering global logout:', reason);
    globalLogout();
  } else {
    console.warn('Global logout not available, falling back to localStorage cleanup');
    // Fallback: clean localStorage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

/**
 * Clear global logout reference (cleanup)
 */
export const clearGlobalLogout = () => {
  globalLogout = null;
};