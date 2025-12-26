// Custom hook for consistent error handling

import { useState } from 'react';
import { handleError, handleSuccess, parseError } from '../utils/errorHandler';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle API calls with consistent error handling
  const handleAsync = async (asyncFunction, options = {}) => {
    const { 
      showToast = true, 
      showInUI = false,
      successMessage = null,
      loadingMessage = 'Loading...'
    } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      
      if (successMessage) {
        handleSuccess(successMessage);
      }
      
      return result;
    } catch (err) {
      const parsedError = handleError(err, { 
        showToast, 
        onError: showInUI ? setError : null 
      });
      
      if (showInUI) {
        setError(parsedError);
      }
      
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  // Clear error state
  const clearError = () => setError(null);

  // Handle form submission with validation
  const handleFormSubmit = async (submitFunction, options = {}) => {
    return handleAsync(submitFunction, {
      showToast: true,
      showInUI: true,
      ...options
    });
  };

  return {
    error,
    loading,
    handleAsync,
    handleFormSubmit,
    clearError,
    setError,
    setLoading
  };
};