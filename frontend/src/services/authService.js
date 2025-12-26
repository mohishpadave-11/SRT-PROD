import axios from 'axios';

// Point to your local backend
const API_URL = `${import.meta.env.VITE_API_URL}/auth` || 'http://localhost:3001/api/auth';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login API Call
export const loginAPI = async (email, password) => {
  try {
    const response = await axiosInstance.post('/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    // Throw a simple error message
    throw error.response?.data?.message || 'Login failed';
  }
};

// Forgot Password API Call
export const forgotPasswordAPI = async (email) => {
  try {
    const response = await axiosInstance.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send reset email';
  }
};

// Logout Helper
export const logoutUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};