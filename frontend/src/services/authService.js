import axiosClient from '../api/axiosClient.js';

// Register API Call
export const registerAPI = async (userData) => {
  try {
    const response = await axiosClient.post('/api/auth/register', userData);
    
    if (response.token) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Login API Call
export const loginAPI = async (email, password) => {
  try {
    // 👇 CHANGED: Added '/api' before '/auth/login'
    const response = await axiosClient.post('/api/auth/login', { email, password });
    
    if (response.token) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error) {
    // Throw a simple error message
    throw error.response?.data?.message || 'Login failed';
  }
};

// Forgot Password API Call
export const forgotPasswordAPI = async (email) => {
  try {
    // 👇 CHANGED: Added '/api' before '/auth/forgot-password'
    const response = await axiosClient.post('/api/auth/forgot-password', { email });
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
