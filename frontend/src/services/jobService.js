import axios from 'axios';
import { handleError } from '../utils/errorHandler';

// Point to your Backend Job Route
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/jobs';

// Helper function to get the token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the token so the backend knows who you are
      'Content-Type': 'application/json',
    },
  };
};

// 1. Create a Job
export const createJobAPI = async (jobData) => {
  try {
    const response = await axios.post(API_URL, jobData, getAuthConfig());
    return response.data;
  } catch (error) {
    // Use centralized error handling
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};

// 2. Get All Jobs (We will use this later for the Dashboard)
export const getJobsAPI = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    // Assuming backend returns { success: true, data: [...] } or just the array
    return response.data.data || response.data; 
  } catch (error) {
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};

// 2.1. Get Single Job by ID
export const getJobByIdAPI = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/${jobId}`, getAuthConfig());
    return response.data.data || response.data;
  } catch (error) {
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};

// 3. Update a Job
export const updateJobAPI = async (jobId, jobData) => {
  try {
    const response = await axios.put(`${API_URL}/${jobId}`, jobData, getAuthConfig());
    return response.data;
  } catch (error) {
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};

// 4. Delete a Job
export const deleteJobAPI = async (jobId) => {
  try {
    const response = await axios.delete(`${API_URL}/${jobId}`, getAuthConfig());
    return response.data;
  } catch (error) {
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};