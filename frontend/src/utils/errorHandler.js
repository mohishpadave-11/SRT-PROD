// Centralized Error Handling Utilities

import toast from 'react-hot-toast';

// Parse backend error response
export const parseError = (error) => {
  // If it's an axios error with response
  if (error.response?.data) {
    return {
      message: error.response.data.message || 'An error occurred',
      statusCode: error.response.data.statusCode || error.response.status,
      success: false
    };
  }
  
  // If it's a fetch error
  if (error.message) {
    return {
      message: error.message,
      statusCode: 500,
      success: false
    };
  }
  
  // Fallback
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    success: false
  };
};

// Show error based on type and severity
export const handleError = (error, options = {}) => {
  const { 
    showToast = true, 
    showInUI = false, 
    onError = null 
  } = options;
  
  const parsedError = parseError(error);
  
  // Show toast notification for most errors
  if (showToast) {
    // Different toast styles based on error type
    if (parsedError.statusCode >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (parsedError.statusCode === 401) {
      toast.error('Please log in to continue');
    } else if (parsedError.statusCode === 403) {
      toast.error('You don\'t have permission for this action');
    } else if (parsedError.statusCode === 404) {
      toast.error('Resource not found');
    } else if (parsedError.statusCode === 409) {
      toast.error(parsedError.message); // Show specific conflict message
    } else {
      toast.error(parsedError.message);
    }
  }
  
  // Call custom error handler if provided
  if (onError) {
    onError(parsedError);
  }
  
  return parsedError;
};

// Success notification helper
export const handleSuccess = (message, options = {}) => {
  const { showToast = true } = options;
  
  if (showToast) {
    toast.success(message, { 
      style: { fontWeight: '500' },
      duration: 3000
    });
  }
};

// Loading state helper
export const handleLoading = (message = 'Loading...') => {
  return toast.loading(message);
};

// Dismiss loading toast
export const dismissLoading = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  }
};