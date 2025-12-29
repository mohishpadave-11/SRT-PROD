import axiosClient from '../api/axiosClient.js';

// Login API Call
export const loginAPI = async (email, password) => {
  try {
    const response = await axiosClient.post('/auth/login', { email, password });
    
    // Handle the actual response structure from backend
    if (response && response.token) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error) {
    // Throw a simple error message
    throw new Error(error.message || 'Login failed');
  }
};

// Forgot Password API Call
export const forgotPasswordAPI = async (email) => {
  try {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send reset email';
  }
};

// Logout Helper
export const logoutUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};