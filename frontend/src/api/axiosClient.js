import axios from 'axios';
import { triggerGlobalLogout } from '../utils/auth.js';

// Create axios instance with base configuration
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 seconds timeout for better network handling
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling and data extraction
axiosClient.interceptors.response.use(
  (response) => {
    // Production-grade response handling for standardized API format
    const responseData = response.data;
    
    // Handle standardized API response format: { success, data, message, statusCode }
    if (responseData && typeof responseData === 'object' && responseData.hasOwnProperty('success')) {
      // If response has data field, return it (even if null/undefined)
      if (responseData.hasOwnProperty('data')) {
        return responseData.data;
      }
      // If no data field but has success, return the whole response (for operations like delete)
      return responseData;
    }
    
    // Fallback for non-standardized responses (legacy endpoints)
    return responseData;
  },
  (error) => {
    // Enhanced error logging for debugging
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    // Handle global errors
    if (error.response?.status === 401) {
      // Token expired or invalid - trigger global logout
      triggerGlobalLogout('API returned 401 - Token expired or invalid');
      return Promise.reject(new Error('Authentication required. Please log in again.'));
    }
    
    // Extract standardized error message with fallbacks
    let errorMessage = 'An error occurred';
    
    if (error.response?.data) {
      // Try to get message from standardized error response
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      // Handle network errors with more specific messages
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = error.message;
      }
    }
    
    // Persistent error logging
    console.error('Final Error Message:', errorMessage);
    
    // Return a rejected promise with standardized error
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;